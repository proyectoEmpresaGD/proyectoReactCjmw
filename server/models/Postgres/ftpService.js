// models/Postgres/ftpService.js
import path from "path";
import { Client } from "basic-ftp";

const FTP_BASE = process.env.FTP_BASE_PATH || "";
const IMG_BASE_URL = (process.env.IMG_BASE_URL || "").replace(/\/$/, "");

const brandMap = {
    ARE: "ARENA AMBIENTE",
    FLA: "FLAMENCO AMBIENTE",
    HAR: "HARBOUR AMBIENTE",
    BAS: "BASSARI AMBIENTE",
    CJM: "CJM AMBIENTE"
};

// genera variantes posibles de la carpeta de marca
function brandCandidates(marca) {
    const fromMap = brandMap[marca] || marca;
    const plain = (fromMap || "").replace(/\s+AMBIENTE$/i, ""); // quita " AMBIENTE"
    const upper = (plain || "").toUpperCase();

    const uniq = new Set([
        fromMap,           // "ARENA AMBIENTE"
        plain,             // "ARENA"
        marca,             // "ARE"
        upper,             // "ARENA"
        `${upper} AMBIENTE`
    ].filter(Boolean));

    return Array.from(uniq);
}

// ftpService.js – reemplaza withFtp por esto
async function withFtp(callback) {
    const client = new Client();
    // debug útil
    client.ftp.verbose = true;
    client.ftp.socketTimeout = 30000;   // 30s
    try {
        await client.access({
            host: process.env.FTP_HOST,
            port: Number(process.env.FTP_PORT) || 21,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: process.env.FTP_SECURE === "true", // FTPS explícito
            secureOptions: { rejectUnauthorized: false } // si tu cert no es perfecto
        });
        // fuerza modo pasivo (por defecto lo usa basic-ftp, pero dejamos constancia)
        client.ftp.passive = true;

        return await callback(client);
    } catch (error) {
        console.error("❌ Error de conexión FTP (access):", error?.message || error);
        return null;
    } finally {
        client.close();
    }
}


export async function getRandomImageUrl({ marca, coleccion }) {
    // cache simple opcional: comentado si prefieres ver los logs en pruebas
    // const cached = imageCache.get(`${marca}_${coleccion}`);
    // if (cached) return cached;

    const brandDirs = brandCandidates(marca);
    const safeColeccion = coleccion; // respeta mayúsculas/espacios reales

    return await withFtp(async (client) => {
        // probar candidatos de marca hasta encontrar una carpeta que contenga imágenes
        for (const brandDir of brandDirs) {
            const remotePath = path.posix.join(FTP_BASE, brandDir, safeColeccion);
            try {
                console.log(`📁 Probing FTP path: ${remotePath}`);
                const list = await client.list(remotePath);
                const images = list.filter(f => !f.isDirectory && /\.(jpe?g|webp|png)$/i.test(f.name));
                if (images.length > 0) {
                    const picked = images[Math.floor(Math.random() * images.length)].name;

                    // construir URL pública final (OJO con encodeURIComponent por segmento)
                    const fullUrl = `${IMG_BASE_URL}/${encodeURIComponent(brandDir)}/${encodeURIComponent(safeColeccion)}/${encodeURIComponent(picked)}`;

                    console.log(`✅ Found image at: ${remotePath} -> ${picked}`);
                    // imageCache.set(`${marca}_${coleccion}`, fullUrl);
                    return fullUrl;
                } else {
                    console.warn(`⚠️ No images in: ${remotePath}`);
                }
            } catch (err) {
                console.warn(`⚠️ FTP list failed at ${remotePath}: ${err?.message || err}`);
            }
        }

        console.warn(`⚠️ No se encontraron imágenes para marca=${marca}, coleccion=${coleccion}`);
        return null;
    });
}
