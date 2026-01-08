import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const OUTPUT_DIR = 'dist';
const requiredTags = ['<title>', 'name="description"', 'rel="canonical"', 'application/ld+json'];

const loadManifest = async () => {
    const manifestPath = path.join(OUTPUT_DIR, 'prerender-manifest.json');
    const raw = await readFile(manifestPath, 'utf8');
    return JSON.parse(raw);
};

const verifyFile = async (filePath) => {
    await access(filePath);
    const content = await readFile(filePath, 'utf8');
    const missing = requiredTags.filter((tag) => !content.includes(tag));
    if (missing.length) {
        throw new Error(`Faltan tags obligatorios en ${filePath}: ${missing.join(', ')}`);
    }
};

const main = async () => {
    const manifest = await loadManifest();
    for (const entry of manifest) {
        await verifyFile(entry.filePath);
    }
    console.log(`Verificación OK: ${manifest.length} archivos prerender tienen head y JSON-LD.`);
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});