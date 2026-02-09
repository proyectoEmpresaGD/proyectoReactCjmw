import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import { createProductRouter } from './routes/productos.js';
import { createImagenRouter } from './routes/imagenes.js';
import { corsMiddleware } from './middlewares/cors.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { createQuotesRouter } from './routes/quotes.js';
import 'dotenv/config';
import fetch from 'node-fetch';
import { createFtpRouter } from './routes/ftp.js';
import { createInstagramRouter } from './routes/instagram.js';
import { createCollectionsRouter } from './routes/collections.js';
import { createContactRouter } from './routes/contact.js';
import { ContactRequestModel } from './models/Postgres/contactRequestsModel.js';
import cron from 'node-cron';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ================== Postgres ================== */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/* ================== App base ================== */
const app = express();
app.set('trust proxy', 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');
app.use(urlencoded({ extended: true }));

/* ================== Utilidades idioma (ES/EN) ================== */
const SPANISH_CC = new Set([
  'ES', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'GT', 'HN', 'SV', 'NI', 'CR', 'PA', 'CU', 'DO', 'PR', 'AD', 'GQ'
]);
const SPANISH_NAMES = new Set([
  'espana', 'españa', 'spain', 'mexico', 'méxico', 'argentina', 'chile', 'colombia', 'peru', 'perú',
  'venezuela', 'ecuador', 'bolivia', 'paraguay', 'uruguay', 'guatemala', 'honduras', 'el salvador', 'nicaragua',
  'costa rica', 'panama', 'panamá', 'cuba', 'dominican republic', 'república dominicana', 'puerto rico',
  'andorra', 'equatorial guinea', 'guinea ecuatorial'
]);
const normalizeCountry = c => (c ?? '')
  .toString().trim().toLowerCase()
  .normalize('NFD').replace(/\p{Diacritic}/gu, '');
const isSpanishSpeakingCountry = country => {
  if (!country) return false;
  const raw = country.toString().trim();
  if (raw.length === 2) return SPANISH_CC.has(raw.toUpperCase());
  return SPANISH_NAMES.has(normalizeCountry(raw));
};

function getThankYouEmail(locale = 'es', { name } = {}) {
  const subject =
    locale === 'es' ? 'Gracias por contactarnos — CJMW' : 'Thank you for contacting us — CJMW';
  const greet =
    locale === 'es' ? `Hola${name ? ` ${name}` : ''},` : `Hello${name ? ` ${name}` : ''},`;
  const p1 =
    locale === 'es'
      ? 'Hemos recibido tu mensaje y uno de nuestros agentes se pondrá en contacto contigo muy pronto.'
      : 'We have received your message and one of our agents will get back to you shortly.';
  const p2 =
    locale === 'es'
      ? 'Si necesitas añadir información adicional, simplemente responde a este correo.'
      : 'If you need to add more information, just reply to this email.';
  const footer = locale === 'es' ? 'Gracias por confiar en CJMW.' : 'Thank you for choosing CJMW.';

  const html = `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>${subject}</title>
<style>
body{margin:0!important;padding:0!important;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#222;}
a{color:inherit;text-decoration:none}
.container{max-width:700px;margin:0 auto;padding:20px;}
.card{background:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.06);overflow:hidden}
.header{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#0A58CA;color:#fff}
.header img{display:block;height:40px}
.content{padding:20px}
h1{font-size:20px;margin:0 0 8px}
p{margin:0 0 12px;line-height:1.5}
.small{font-size:12px;color:#666}
.brand-logos{display:flex;gap:16px;justify-content:center;align-items:center;flex-wrap:wrap;padding:16px}
hr{border:none;border-top:1px solid #eee;margin:16px 0}
@media (max-width:480px){
  .header{padding:12px}
  .content{padding:16px}
  .brand-logos img{height:28px}
}
</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <a href="https://www.cjmw.eu/#/"><img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/ESCUDOS/ESCUDO%20FAMILIAR/CJMlogo.png" alt="CJMW" /></a>
        <a href="https://www.cjmw.eu/#/"><img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM_group.png" alt="CJMW Group" style="height:36px" /></a>
      </div>
      <div class="content">
        <h1>${greet}</h1>
        <p>${p1}</p>
        <p>${p2}</p>
        <hr/>
        <p class="small">${footer}</p>
      </div>
      <div class="brand-logos">
        <a href="https://www.cjmw.eu/#/cjmHome"><img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png" alt="CJM" height="36"/></a>
        <a href="https://www.cjmw.eu/#/arenaHome"><img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoArena.png" alt="Arena" height="40"/></a>
        <a href="https://www.cjmw.eu/#/flamencoHome"><img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoFlamenco.png" alt="Flamenco" height="40"/></a>
        <a href="https://www.cjmw.eu/#/harbourHome"><img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoHarbour.png" alt="Harbour" height="40"/></a>
        <a href="https://www.cjmw.eu/#/bassariHome"><img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png" alt="Bassari" height="36"/></a>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text =
    `${greet}\n\n${p1}\n${p2}\n\n` +
    (locale === 'es' ? 'Gracias por confiar en CJMW.' : 'Thank you for choosing CJMW.') +
    `\nhttps://www.cjmw.eu/#/\n`;

  return { subject, html, text };
}

/* ================== Proxy imagen (robusto) ================== */
app.get('/api/proxy', async (req, res) => {
  const raw = (req.query.url || '').trim();

  if (!raw) {
    return res.status(400).json({ error: 'Missing url param' });
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ error: 'Only http/https URLs are allowed' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: 'follow',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream responded ${response.status}` });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400, immutable');

    response.body.pipe(res);
  } catch (e) {
    if (e.name === 'AbortError') {
      return res.status(504).json({ error: 'Upstream timeout' });
    }
    console.error('[image-proxy] Fetch error:', e.message);
    return res.status(502).json({ error: 'Fetch failed' });
  } finally {
    clearTimeout(timeout);
  }
});

/* ================== Estáticos ================== */
app.use(express.static(join(__dirname, 'web')));

/* ================== Rutas negocio ================== */
app.use('/api/products', createProductRouter({ pool }));
app.use('/api/images', createImagenRouter({ pool }));
app.use('/api/ftp', createFtpRouter());
app.use('/api/instagram', createInstagramRouter());
app.use('/api/collections', createCollectionsRouter());
app.use('/api/quotes', createQuotesRouter());
app.use('/files', express.static(path.join(__dirname, 'output')));

/* ================== Contact router + limpieza ================== */
const contactModel = new ContactRequestModel(pool);
app.use('/api', createContactRouter({ pool, contactModel }));

const retentionDays = Number.parseInt(process.env.CONTACT_RETENTION_DAYS ?? '180', 10);
cron.schedule('30 3 * * *', async () => {
  try {
    await contactModel.deleteOlderThanDays(retentionDays);
  } catch (cronError) {
    console.error('Error pruning contact requests:', cronError);
  }
});

/* ================== SMTP existentes ================== */
const SMTP_HOST = "send.one.com";
const SMTP_PORT = 465;

const gerardoTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: { user: process.env.GERARDO_EMAIL, pass: process.env.GERARDO_PASS },
});

const pedidosTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: { user: process.env.PEDIDOS_EMAIL, pass: process.env.PEDIDOS_PASS },
});

/* ================== /api/email (legado) con idioma por país ================== */
app.post("/api/email", async (req, res) => {
  const { email, phone, message, name, country } = req.body;

  if (!email || !message || !phone || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({
      error: "⚠️ Datos inválidos. Ingresa un email, teléfono y mensaje válidos.",
    });
  }

  try {
    await gerardoTransporter.sendMail({
      from: `"CJMW WEB Contacto" <${process.env.GERARDO_EMAIL}>`,
      to: process.env.PEDIDOS_EMAIL,
      subject: "Nuevo contacto desde la web",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>País:</strong> ${country ?? '—'}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
        </div>
      `,
      text: `Email: ${email}\nTeléfono: ${phone}\nPaís: ${country ?? '—'}\n\nMensaje:\n${message}`
    });

    const locale = isSpanishSpeakingCountry(country) ? 'es' : 'en';
    const { subject, html, text } = getThankYouEmail(locale, { name });

    await pedidosTransporter.sendMail({
      from: `"CJMW WEB" <${process.env.PEDIDOS_EMAIL}>`,
      to: email,
      subject,
      html,
      text,
    });

    res.status(200).json({ message: "✅ Correos enviados con éxito" });
  } catch (error) {
    console.error("❌ Error al enviar los correos:", error);
    res.status(500).json({ error: "❌ Error al enviar los correos" });
  }
});

/* ================== /api/order (tu endpoint completo) ================== */
app.post("/api/order", async (req, res) => {
  const { name, email, phone, zona, isClient, cif, cartItems } = req.body;

  if (
    !name || !email || !phone || !zona ||
    !cartItems || !Array.isArray(cartItems) || cartItems.length === 0
  ) {
    return res.status(400).json({
      error: "⚠️ Por favor, proporciona nombre, email, teléfono y productos del pedido.",
    });
  }

  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ error: "⚠️ Email inválido." });
  }

  if (isClient && !cif) {
    return res.status(400).json({ error: "⚠️ El CIF es obligatorio para clientes." });
  }

  try {
    const finalPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    ).toFixed(2);

    const itemsHtml = cartItems.map((item) => `
      <div style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee;">
        <table style="width:100%;">
          <tr>
            <td style="width:60px;">
              <img src="${item.image}" alt="${item.name}" style="max-width:50px; max-height:50px; object-fit:cover;" />
            </td>
            <td style="vertical-align:top; padding-left:10px;">
              <p style="margin: 0;"><strong>Producto:</strong> ${item.name}</p>
              <p style="margin: 0;"><strong>Cantidad:</strong> ${item.quantity}</p>
              <p style="margin: 0;"><strong>Precio:</strong> €${item.price}</p>
              <p style="margin: 0;">
                <strong>Ancho:</strong> ${item.ancho || '-'} &nbsp;|&nbsp;
                <strong>Color:</strong> ${item.color || '-'} &nbsp;|&nbsp;
                <strong>Tonalidad:</strong> ${item.tonalidad || '-'}
              </p>
            </td>
          </tr>
        </table>
      </div>
    `).join("");

    const agentHtml = `
    <table width="700" cellpadding="0" cellspacing="0" border="0" align="center"
      style="padding: 20px; margin: auto; margin-bottom:30px;">
      <tr><td align="center">
        <table width="700" cellpadding="0" cellspacing="0" border="0"
          style="background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.2); padding: 20px;">
          <tr>
            <td align="left" style="width: 100px;">
              <a href="https://www.cjmw.eu/#/" target="_blank">
                <img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/ESCUDOS/ESCUDO%20FAMILIAR/CJMlogo.png" alt="CJMW Logo" width="80" style="display: block;">
              </a>
            </td>
            <td align="right" style="width: 120px;">
              <a href="https://www.cjmw.eu/#/" target="_blank">
                <img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM_group.png" alt="CJMW Group" width="120" style="display: block;">
              </a>
            </td>
          </tr>
          <tr>
            <td colspan="2" align="center" style="background-color: #007BFF; padding: 15px; border-radius: 5px;">
              <h2 style="color: #ffffff; margin: 0;">Nuevo pedido tramitado</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: left;" colspan="2">
              <p><strong>Nombre:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Teléfono:</strong> ${phone}</p>
              <p><strong>Zona:</strong> ${zona}</p>
              ${isClient ? `<p><strong>CIF:</strong> ${cif}</p>` : ""}
              <h3>Productos Solicitados:</h3>
              ${itemsHtml}
              <p style="font-size: 16px; color: #007BFF; text-align: center; margin-top:20px;">
                <strong>Precio final del pedido: €${finalPrice}</strong>
              </p>
              <p style="font-size: 14px; color: #555; text-align: center;">
                <em>El pedido se está procesando. Contacte con el cliente para finalizar el trámite.</em>
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>`;

    const clientHtml = `
      <table width="700" cellpadding="0" cellspacing="0" border="0" align="center"
      style="background-color: #f4f4f4; padding: 20px; margin: auto;">
      <tr><td align="center">
        <table width="700" cellpadding="0" cellspacing="0" border="0"
          style="background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.2); padding: 20px;">
          <tr>
            <td align="left" style="width: 100px;">
              <a href="https://www.cjmw.eu/#/" target="_blank">
                <img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/ESCUDOS/ESCUDO%20FAMILIAR/CJMlogo.png" alt="CJMW Logo" width="80" style="display: block;">
              </a>
            </td>
            <td align="right" style="width: 120px;">
              <a href="https://www.cjmw.eu/#/" target="_blank">
                <img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM_group.png" alt="CJMW Group" width="120" style="display: block;">
              </a>
            </td>
          </tr>
          <tr>
            <td colspan="2" align="center" style="background-color: #007BFF; padding: 15px; border-radius: 5px;">
              <h2 style="color: #ffffff; margin: 0;">Pedido en Trámite</h2>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 20px; text-align: left;">
              <p>Estimado/a <strong>${name}</strong>,</p>
              <p>Su pedido se está tramitando. En breve, uno de nuestros agentes se pondrá en contacto con usted.</p>
              <p>¡Gracias por confiar en <strong>CJMW WEB</strong>!</p>
            </td>
          </tr>
        </table>

        <table width="600" cellpadding="5" cellspacing="0" border="0" align="center" style="margin-top: 20px;">
          <tr>
            <td align="center">
              <a href="https://www.cjmw.eu/#/cjmHome" target="_blank">
                <img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png" alt="Marca 1" width="50" style="display: block;">
              </a>
            </td>
            <td align="center">
              <a href="https://www.cjmw.eu/#/arenaHome" target="_blank">
                <img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoArena.png" alt="Marca 2" width="100" style="display: block;">
              </a>
            </td>
            <td align="center">
              <a href="https://www.cjmw.eu/#/flamencoHome" target="_blank">
                <img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoFlamenco.png" alt="Marca 3" width="100" style="display: block;">
              </a>
            </td>
            <td align="center">
              <a href="https://www.cjmw.eu/#/harbourHome" target="_blank">
                <img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoHarbour.png" alt="Marca 4" width="100" style="display: block;">
              </a>
            </td>
            <td align="center">
              <a href="https://www.cjmw.eu/#/bassariHome" target="_blank">
                <img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png" alt="Marca 5" width="80" style="display: block;">
              </a>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>`;

    await gerardoTransporter.sendMail({
      from: `"CJMW WEB Pedido" <${process.env.GERARDO_EMAIL}>`,
      to: process.env.PEDIDOS_EMAIL,
      subject: "Nuevo Pedido Tramitado",
      html: agentHtml,
    });

    await pedidosTransporter.sendMail({
      from: `"CJMW WEB" <${process.env.PEDIDOS_EMAIL}>`,
      to: email,
      subject: "Su Pedido se Está Tramitando",
      html: clientHtml,
    });

    res.status(200).json({
      message: "✅ Pedido tramitado. Se han enviado los correos correspondientes.",
    });
  } catch (error) {
    console.error("❌ Error al tramitar el pedido:", error);
    res.status(500).json({ error: "❌ Error al tramitar el pedido" });
  }
});

/* ================== Error handler único ================== */
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  const status = err.status ?? 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  if (req.originalUrl.startsWith('/api/')) {
    res.status(status).json({ error: message });
  } else {
    res.status(status).send(message);
  }
});

/* ================== Cache-control para GET ================== */
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate');
  }
  next();
});

/* ================== Arranque ================== */
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Serving static files from ${join(__dirname, 'web')}`);
});

export default app;
