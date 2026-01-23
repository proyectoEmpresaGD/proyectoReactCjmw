// /api/proxy.js  (ESM, compatible con Vercel y "type":"module")

export default async function handler(req, res) {
    try {
        // soporta tanto req.query.url como parsing manual (por si acaso)
        const urlParam =
            (req.query && req.query.url) ||
            new URL(req.url, `http://${req.headers.host}`).searchParams.get('url');

        if (!urlParam) {
            res.statusCode = 400;
            res.end('Missing url');
            return;
        }

        const r = await fetch(urlParam); // fetch nativo en Node 18+
        const ct = r.headers.get('content-type') || 'application/octet-stream';
        res.setHeader('Content-Type', ct);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

        const buf = Buffer.from(await r.arrayBuffer());
        res.statusCode = r.status;
        res.end(buf);
    } catch (err) {
        console.error('Proxy error', err);
        res.statusCode = 500;
        res.end('Proxy error');
    }
}
