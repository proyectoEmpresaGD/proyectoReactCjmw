import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import { ContactController } from '../controllers/contactController.js';
import { ContactRequestModel } from '../models/Postgres/contactRequestsModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = resolve(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ts = Date.now();
        const clean = file.originalname.toLowerCase().replace(/[^a-z0-9.\-]/g, '_');
        cb(null, `${ts}-${clean}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error('INVALID_FILE_TYPE'));
    },
});

const submissionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many contact requests from this IP, please try again later.' },
});

const norm = s => (s ?? '').toString().trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
const isSpain = (country) => {
    if (!country) return false;
    const raw = String(country).trim();
    if (raw.length === 2) return raw.toUpperCase() === 'ES';
    const n = norm(raw);
    return n === 'espana' || n === 'españa' || n === 'spain';
};

// Validaciones comunes + condicionales
const contactValidation = [
    body('profile').isIn(['private', 'professional']).withMessage('invalid_profile'),

    body('firstName')
        .trim().isLength({ min: 1, max: 120 }).withMessage('invalid_first_name')
        .matches(/^[\p{L}\s.'-]+$/u).withMessage('invalid_first_name_format'),

    body('lastName')
        .trim().isLength({ min: 1, max: 120 }).withMessage('invalid_last_name')
        .matches(/^[\p{L}\s.'-]+$/u).withMessage('invalid_last_name_format'),

    body('email').isEmail().withMessage('invalid_email'),

    body('country')
        .trim().isLength({ min: 2, max: 120 }).withMessage('invalid_country'),

    // Código postal: si ES -> 5 dígitos y provincia 01..52; otro país -> 2..20 alfanum
    body('postalCode').custom((val, { req }) => {
        const v = String(val || '').trim();
        if (!v) throw new Error('invalid_postal_code');
        if (isSpain(req.body.country)) {
            if (!/^(0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/.test(v)) {
                throw new Error('invalid_postal_code_es');
            }
        } else {
            if (!/^[A-Za-z0-9\- ]{2,20}$/.test(v)) {
                throw new Error('invalid_postal_code_generic');
            }
        }
        return true;
    }),

    body('province').optional({ checkFalsy: true }).isLength({ max: 120 }).withMessage('invalid_province'),

    // Empresa obligatoria si perfil profesional
    body('company').optional({ checkFalsy: true }).isLength({ max: 160 }).withMessage('invalid_company'),
    body('company').custom((val, { req }) => {
        if (req.body.profile === 'professional' && !String(val || '').trim()) {
            throw new Error('company_required_for_professional');
        }
        return true;
    }),

    body('reason').trim().isLength({ min: 2, max: 160 }).withMessage('invalid_reason'),
    body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('invalid_message'),
    body('marketing').optional().isIn(['true', 'false']).withMessage('invalid_marketing'),
    body('consent').equals('true').withMessage('invalid_consent'),
    body('consentVersion').optional().isLength({ max: 50 }).withMessage('invalid_consent_version'),
];

const adminAuthMiddleware = (req, res, next) => {
    const expected = process.env.CONTACT_ADMIN_TOKEN;
    if (!expected) return res.status(500).json({ error: 'Admin token is not configured.' });

    const auth = req.get('authorization') || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    if (auth.replace('Bearer ', '') !== expected) return res.status(401).json({ error: 'Unauthorized' });
    next();
};

const buildMailer = () => {
    const host = process.env.CONTACT_SMTP_HOST ?? process.env.SMTP_HOST;
    const port = Number(process.env.CONTACT_SMTP_PORT ?? process.env.SMTP_PORT ?? 465);
    const user = process.env.CONTACT_SMTP_USER ?? process.env.SMTP_USER;
    const pass = process.env.CONTACT_SMTP_PASS ?? process.env.SMTP_PASS;

    if (!host || !user || !pass) return null;

    return nodemailer.createTransport({
        host, port, secure: port === 465, auth: { user, pass },
    });
};

export const createContactRouter = ({ pool, contactModel }) => {
    const modelInstance = contactModel ?? (pool ? new ContactRequestModel(pool) : null);
    if (!modelInstance) throw new Error('A contact model or PostgreSQL pool is required to initialise the contact router.');

    const router = Router();
    const transporter = buildMailer();
    const contactInbox = process.env.CONTACT_INBOX || process.env.PEDIDOS_EMAIL; // fallback
    const controller = new ContactController({ contactModel: modelInstance, transporter, contactInbox });

    const uploadMiddleware = (req, res, next) => {
        upload.single('attachment')(req, res, (err) => {
            if (!err) return next();
            if (err.message === 'INVALID_FILE_TYPE') {
                return res.status(400).json({ error: 'Unsupported file type. Allowed formats: PDF, JPG, PNG.' });
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File exceeds the maximum allowed size of 2 MB.' });
            }
            return next(err);
        });
    };

    router.post(
        '/contact',
        submissionLimiter,
        uploadMiddleware,
        contactValidation,
        controller.handleCreate.bind(controller)
    );

    router.get(
        '/admin/contacts',
        adminAuthMiddleware,
        controller.handleList.bind(controller)
    );

    return router;
};
