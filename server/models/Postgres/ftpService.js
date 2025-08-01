import path from "path";
import { Client } from "basic-ftp";

const FTP_BASE = process.env.FTP_BASE_PATH;
const IMG_BASE_URL = process.env.IMG_BASE_URL;

// Mapeo de códigos de marca a carpetas
const brandMap = {
    ARE: "ARENA AMBIENTE",
    FLA: "FLAMENCO AMBIENTE",
    HAR: "HARBOUR AMBIENTE",
    BAS: "BASSARI AMBIENTE",
    CJM: "CJM AMBIENTE"
};

// Cache simple en memoria
const imageCache = new Map();

function getCachedImage(marca, coleccion) {
    return imageCache.get(`${marca}_${coleccion}`);
}

function setCachedImage(marca, coleccion, url) {
    imageCache.set(`${marca}_${coleccion}`, url);
}

// Acceso FTP seguro
async function withFtp(callback) {
    const client = new Client();
    try {
        await client.access({
            host: process.env.FTP_HOST,
            port: Number(process.env.FTP_PORT) || 21,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: process.env.FTP_SECURE === "true"
        });
        return await callback(client);
    } catch (error) {
        console.error("❌ Error de conexión FTP:", error);
        return null;
    } finally {
        client.close();
    }
}

export async function getRandomImageUrl({ marca, coleccion }) {
    // Verificar en caché primero
    const cached = getCachedImage(marca, coleccion);
    if (cached) return cached;

    const carpetaMarca = brandMap[marca] || marca;
    const remotePath = path.posix.join(FTP_BASE || '', carpetaMarca, coleccion || '');

    return await withFtp(async (client) => {
        console.log(`📁 Listando: ${remotePath}`);
        const list = await client.list(remotePath);
        const images = list.filter(f => !f.isDirectory && /\.(jpe?g|webp)$/i.test(f.name));

        if (!images.length) {
            console.warn(`⚠️ Sin imágenes para ${marca}/${coleccion}`);
            return null;
        }

        const random = images[Math.floor(Math.random() * images.length)].name;
        const fullUrl = `${IMG_BASE_URL?.replace(/\/$/, "")}/${encodeURIComponent(carpetaMarca)}/${encodeURIComponent(coleccion)}/${encodeURIComponent(random)}`;

        setCachedImage(marca, coleccion, fullUrl); // Guardar en caché

        return fullUrl;
    });
}
