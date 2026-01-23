// controllers/quotesController.js
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { PDFDocument } from 'pdf-lib';
import { pdflibAddPlaceholder } from '@signpdf/placeholder-pdf-lib';
import { SignPdf } from '@signpdf/signpdf';
import { P12Signer } from '@signpdf/signer-p12';
import forge from 'node-forge';

import { QuotesModel } from '../models/Postgres/quotes.js';

// === CONFIG ===
// URL pública del backend para servir ficheros en DEV cuando no hay Blob token
const API_PUBLIC = process.env.PUBLIC_API_BASE || `http://localhost:${process.env.PORT || 1234}`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// === HELPERS ===
const sha256Hex = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

function normalizePem(envValue) {
    if (!envValue) return null;
    return (envValue.includes('\\n') ? envValue.replace(/\\n/g, '\n') : envValue).trim();
}

function getPemOrThrow() {
    const keyPem = normalizePem(process.env.PRIVATE_KEY_PEM);
    const certPem = normalizePem(process.env.CERTIFICATE_PEM);

    if (!keyPem || !certPem) {
        const missing = [!keyPem ? 'PRIVATE_KEY_PEM' : null, !certPem ? 'CERTIFICATE_PEM' : null]
            .filter(Boolean)
            .join(', ');
        throw new Error(`Config error: falta(n) ${missing}.`);
    }

    return { keyPem, certPem };
}

/**
 * Normaliza el fichero recibido desde middleware (multer / express-fileupload / etc.)
 * Soporta:
 *  - file.buffer (multer memoryStorage)
 *  - file.data (express-fileupload)
 *  - file.path (si algún middleware deja el fichero en disco)
 */
function getUploadedPdfBuffer(file) {
    if (!file) return null;

    if (file.buffer && Buffer.isBuffer(file.buffer)) return file.buffer;
    if (file.buffer instanceof Uint8Array) return Buffer.from(file.buffer);

    if (file.data && Buffer.isBuffer(file.data)) return file.data;
    if (file.data instanceof Uint8Array) return Buffer.from(file.data);

    if (typeof file.path === 'string' && file.path) {
        return fs.readFileSync(file.path);
    }

    return null;
}

// === PEM -> P12 (Buffer) ===
function pemToP12Buffer({ keyPem, certPem, password = '' }) {
    const privateKey = forge.pki.privateKeyFromPem(keyPem);
    const certificate = forge.pki.certificateFromPem(certPem);

    const p12Asn1 = forge.pkcs12.toPkcs12Asn1(privateKey, [certificate], password, {
        generateLocalKeyId: true,
        friendlyName: 'CJM WORLDWIDE',
    });

    const der = forge.asn1.toDer(p12Asn1).getBytes();
    return Buffer.from(der, 'binary');
}

// === SUBIDA A VERCEL BLOB (opcional) ===
async function uploadToBlob(filename, bytes, contentType = 'application/pdf') {
    const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

    // Normaliza bytes (puede venir como Uint8Array desde pdf-lib / signpdf)
    const bodyBytes = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);

    if (!token) {
        // DEV: guarda local y devuelve URL estática del backend
        const safeName = filename.replace(/[^a-zA-Z0-9._/-]/g, '_');
        const outDir = path.join(__dirname, '..', 'output');
        const fullPath = path.join(outDir, safeName);

        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, bodyBytes);

        return `${API_PUBLIC}/files/${safeName}`;
    }

    const res = await fetch('https://api.vercel.com/v2/blob/upload', {
        method: 'POST',
        headers: {
            'content-type': 'application/octet-stream',
            'x-vercel-filename': filename,
            'x-vercel-content-type': contentType,
            authorization: `Bearer ${token}`,
        },
        body: bodyBytes,
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Blob upload failed: ${res.status} ${errText}`);
    }

    const data = await res.json();
    return data.url; // pública
}

// === FIRMA PDF ===
async function signPdfBuffer(pdfBuffer) {
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // OJO: pdflibAddPlaceholder NO devuelve bytes; modifica pdfDoc
    pdflibAddPlaceholder({
        pdfDoc,
        reason: 'Documento emitido y firmado digitalmente',
        contactInfo: 'info@cjmw.eu',
        name: 'CJM WORLDWIDE S.L.',
        location: 'España',
    });

    // Esto SÍ devuelve los bytes (Uint8Array)
    const pdfWithPlaceholderBytes = await pdfDoc.save();

    const p12Password = process.env.P12_PASSWORD || '';

    let p12Buffer;
    const p12Base64 = (process.env.P12_BASE64 || '').trim();

    if (p12Base64) {
        p12Buffer = Buffer.from(p12Base64, 'base64');
    } else {
        const { keyPem, certPem } = getPemOrThrow();
        p12Buffer = pemToP12Buffer({ keyPem, certPem, password: p12Password });
    }

    const p12Signer = new P12Signer(p12Buffer, { passphrase: p12Password });

    // Importante: sign() es async en @signpdf moderno
    const signedPdf = await new SignPdf().sign(pdfWithPlaceholderBytes, p12Signer);

    // signpdf devuelve Buffer o Uint8Array según versión; devolvemos Buffer para consistencia
    return Buffer.isBuffer(signedPdf) ? signedPdf : Buffer.from(signedPdf);
}

export class QuotesController {
    /**
     * POST /api/quotes/register-and-sign
     * Espera multipart/form-data con campo 'file' (PDF), y body: { ref, total, email }
     */
    async registerAndSign(req, res) {
        try {
            const file = req.file || (req.files && req.files.file);
            const { ref, total, email } = req.body || {};

            if (!ref) return res.status(400).json({ error: 'Missing ref' });

            const inputPdfBuffer = getUploadedPdfBuffer(file);
            if (!inputPdfBuffer) return res.status(400).json({ error: 'Missing file (PDF)' });

            // 1) Firmar
            const signed = await signPdfBuffer(inputPdfBuffer);

            // 2) Hash metadata
            const sha256 = sha256Hex(signed);

            // 3) Guardar/subir SIEMPRE el PDF firmado y obtener su URL pública
            const filename = `${ref}.pdf`;
            const blobUrl = await uploadToBlob(`quotes/${filename}`, signed, 'application/pdf');

            // 4) Persistir metadatos
            await QuotesModel.upsertMetadata({
                ref,
                sha256,
                size: signed.byteLength,
                mime: 'application/pdf',
                blobUrl,
                total: total ?? null,
                email: email ?? null,
            });

            // 5) Responder PDF como attachment
            const verifyUrl = `${process.env.PUBLIC_BASE_URL || ''}/verify/${encodeURIComponent(ref)}`;

            res.setHeader('content-type', 'application/pdf');
            res.setHeader('content-disposition', `attachment; filename="${filename}"`);
            res.setHeader('x-ref', ref);
            res.setHeader('x-sha256', sha256);
            res.setHeader('x-verify-url', verifyUrl);

            return res.send(signed);
        } catch (e) {
            console.error('[QuotesController.registerAndSign] ERROR:', e);
            return res.status(500).json({ error: e.message });
        }
    }

    /** GET /api/quotes/:ref -> metadatos */
    async getByRef(req, res) {
        try {
            const { ref } = req.params;

            const row = await QuotesModel.findByRef(ref);
            if (!row) return res.status(404).json({ error: 'Not found' });

            return res.json(row);
        } catch (e) {
            console.error('[QuotesController.getByRef] ERROR:', e);
            return res.status(500).json({ error: e.message });
        }
    }
}
