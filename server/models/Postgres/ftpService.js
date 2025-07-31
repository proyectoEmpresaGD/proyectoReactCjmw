// models/Postgres/ftpService.js
import path from "path";
import { Client } from "basic-ftp";

const FTP_BASE = process.env.FTP_BASE_PATH;
const IMG_BASE_URL = process.env.IMG_BASE_URL;

// Mapeo de códigos de marca a nombre real de carpeta en el FTP
const brandMap = {
    ARE: "ARENA AMBIENTE",
    FLA: "FLAMENCO AMBIENTE",
    HAR: "HARBOUR AMBIENTE",
    BAS: "BASSARI AMBIENTE",
    CJM: "CJM AMBIENTE"
};

export async function getRandomImageUrl({ marca, coleccion }) {
    const client = new Client();

    try {
        await client.access({
            host: process.env.FTP_HOST,
            port: Number(process.env.FTP_PORT) || 21,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: process.env.FTP_SECURE === "true",
        });

        const carpetaMarca = brandMap[marca] || marca;
        const remotePath = path.posix.join(FTP_BASE, carpetaMarca, coleccion);

        const list = await client.list(remotePath);
        const images = list.filter(f => !f.isDirectory && /\.(jpe?g|webp)$/i.test(f.name));

        if (!images.length) return null;

        const random = images[Math.floor(Math.random() * images.length)].name;
        return `${IMG_BASE_URL.replace(/\/$/, "")}/${carpetaMarca}/${coleccion}/${encodeURIComponent(random)}`;
    } catch (err) {
        console.error("❌ Error en getRandomImageUrl:", err);
        return null;
    } finally {
        client.close();
    }
}
