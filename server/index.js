import express, { json, urlencoded } from 'express';
import { createProductRouter } from './routes/productos.js';
import { createImagenRouter } from './routes/imagenes.js';
import { corsMiddleware } from './middlewares/cors.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import fetch from 'node-fetch';
import { createFtpRouter } from './routes/ftp.js';
import { createInstagramRouter } from './routes/instagram.js';
// 👉 NUEVO: router de colecciones (JSON)
import { createCollectionsRouter } from './routes/collections.js';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');
app.use(urlencoded({ extended: true }));

app.get('/api/proxy', async (req, res) => {
  const imageUrl = req.query.url;
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return res.status(response.status).send('Error al cargar la imagen');
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType);
    response.body.pipe(res);
  } catch (err) {
    console.error('Error en proxy de imagen:', err);
    res.status(500).send('Error en el servidor proxy');
  }
});

// Sirve archivos estáticos desde el directorio 'web'
app.use(express.static(join(__dirname, 'web')));

// Rutas de productos e imágenes
app.use('/api/products', createProductRouter({ pool }));
app.use('/api/images', createImagenRouter({ pool }));
app.use('/api/ftp', createFtpRouter());
app.use('/api/instagram', createInstagramRouter());

// 👉 NUEVO: rutas de colecciones/portadas basadas en JSON
//    GET /api/collections/image?marca=ARE&coleccion=ATMOSPHERE
app.use('/api/collections', createCollectionsRouter());

// Configuración SMTP con nodemailer
const SMTP_HOST = "send.one.com";
const SMTP_PORT = 465;

const gerardoTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.GERARDO_EMAIL,
    pass: process.env.GERARDO_PASS,
  },
});

const pedidosTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.PEDIDOS_EMAIL,
    pass: process.env.PEDIDOS_PASS,
  },
});

// ── Endpoint para el formulario de contacto ──
app.post("/api/email", async (req, res) => {
  const { email, phone, message } = req.body;

  if (
    !email ||
    !message ||
    !phone ||
    !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
  ) {
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
            <p><strong>Mensaje:</strong> ${message}</p>
          </div>
        `,
    });

    await pedidosTransporter.sendMail({
      from: `"CJMW WEB" <${process.env.PEDIDOS_EMAIL}>`,
      to: email,
      subject: "Gracias por contactarnos en CJMW WEB",
      html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <p>Gracias por contactarnos. Nos pondremos en contacto contigo a la brevedad.</p>
          </div>
        `,
    });

    res.status(200).json({ message: "✅ Correos enviados con éxito" });
  } catch (error) {
    console.error("❌ Error al enviar los correos:", error);
    res.status(500).json({ error: "❌ Error al enviar los correos" });
  }
});

// ── Endpoint para tramitar pedidos ──
app.post("/api/order", async (req, res) => {
  const { name, email, phone, zona, isClient, cif, cartItems } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !zona ||
    !cartItems ||
    !Array.isArray(cartItems) ||
    cartItems.length === 0
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
    // Calcular el precio final del pedido
    const finalPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ).toFixed(2);

    // Construir el listado de productos en HTML, incluyendo la imagen del producto
    const itemsHtml = cartItems
      .map((item) => {
        return `
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
          `;
      })
      .join("");

    // Plantilla del correo para el agente con logos y productos
    const agentHtml = `
    <table width="700px" cellpadding="0" cellspacing="0" border="0" align="center"
      style="padding: 20px; margin: auto; margin-bottom:30px;">

      <tr>
          <td align="center">

              <!--[if mso]>
                    <v:shape xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" 
                        style="width:700px; height:auto; mso-position-horizontal:left;">
                        <v:fill type="solid" color="#ffffff"/>
                        <v:textbox inset="10px,10px,10px,10px" style="mso-fit-shape-to-text:true; height:auto;">
                            <table width="90%" cellpadding="20" cellspacing="0" border="0" align="center"
                                style="background-color: #ffffff; text-align: left; margin: auto;">
                                <tr>
                                    <td align="left" style="width: 100px; height: auto; margin-top: 115px;">
                                        <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/CJMlogo.png" 
                                            alt="CJMW Logo" width="80" style="width:120px; height:160px; display: block; margin-bottom: 10px;">
                                    </td>
                                  <td align="right" style="width: 120px; margin-top: 50px;">
                                      <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/CJM_group.png" alt="CJMW Group" width="120"
                                          style="display: block;">
                                  </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h2 style="color: #007BFF; text-align: center;">Nuevo Pedido Tramitado</h2>
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
                        </v:textbox>
                    </v:shape>
                    <![endif]-->

              <!--[if !mso]><!-->
              <table width="700px" cellpadding="0" cellspacing="0" border="0"
                  style="background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.2); padding: 20px;">
                  <tr>
                      <td align="left" style="width: 100px;">
                          <a href="https://www.cjmw.eu/#/" target="_blank">
                              <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/CJMlogo.png" alt="CJMW Logo"
                                  width="80" style="display: block;">
                          </a>
                      </td>
                      <td align="right" style="width: 120px;">
                          <a href="https://www.cjmw.eu/#/" target="_blank">
                              <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/CJM_group.png" alt="CJMW Group"
                                  width="120" style="display: block;">
                          </a>
                      </td>
                  </tr>
                  <tr>
                      <td colspan="2" align="center"
                          style="background-color: #007BFF; padding: 15px; border-radius: 5px;">
                          <h2 style="color: #ffffff; margin: 0;">Nuevo pedido tramitado</h2>
                      </td>
                  </tr>
                  <tr>
                      <td style="padding: 20px; text-align: left;">
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
                      </td>
                  </tr>
              </table>
              <!--<![endif]-->

          </td>
      </tr>
  </table>
      `;

    // Plantilla del correo para el cliente con logos
    const clientHtml = `
          <table width="700px" cellpadding="0" cellspacing="0" border="0" align="center"
          style="background-color: #f4f4f4; padding: 20px; margin: auto;">

          <tr>
              <td align="center">

                  <!--[if mso]>
                        <v:shape xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" 
                            style="width:700px; height:auto; mso-position-horizontal:left;">
                            <v:fill type="solid" color="#ffffff"/>
                            <v:textbox inset="10px,10px,10px,10px" style="mso-fit-shape-to-text:true; height:auto;">
                                <table width="90%" cellpadding="20" cellspacing="0" border="0" align="center"
                                    style="background-color: #ffffff; text-align: left; margin: auto;">
                                    <tr>
                                        <td align="left" style="width: 120px; margin-top: 0px;">
                                            <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/CJMlogo.png" 
                                                alt="CJMW Logo" width="80" style="display: block;">
                                        </td>
                                        <td align="right" style="width: 120px; margin-top: 0px;">
                                            <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/CJM_group.png" 
                                                alt="CJMW Group" width="120" style="display: block;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <h2 style="color: #007BFF; text-align: center;">Pedido en Trámite</h2>
                                            <p>Estimado/a <strong>${name}</strong>,</p>
                                            <p>Su pedido se está tramitando. En breve, uno de nuestros agentes se pondrá en contacto con
                                                usted.</p>
                                            <p>¡Gracias por confiar en <strong>CJMW WEB</strong>!</p>
                                        </td>
                                    </tr>
                                </table>
                            </v:textbox>
                        </v:shape>
                        <![endif]-->

                  <!--[if !mso]><!-->
                  <table width="700px" cellpadding="0" cellspacing="0" border="0"
                      style="background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.2); padding: 20px;">
                      <tr>
                          <td align="left" style="width: 100px;">
                              <a href="https://www.cjmw.eu/#/" target="_blank">
                                  <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/CJMlogo.png" alt="CJMW Logo"
                                      width="80" style="display: block;">
                              </a>
                          </td>
                          <td align="right" style="width: 120px;">
                              <a href="https://www.cjmw.eu/#/" target="_blank">
                                  <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/CJM_group.png"
                                      alt="CJMW Group" width="120" style="display: block;">
                              </a>
                          </td>
                      </tr>
                      <tr>
                          <td colspan="2" align="center"
                              style="background-color: #007BFF; padding: 15px; border-radius: 5px;">
                              <h2 style="color: #ffffff; margin: 0;">Pedido en Trámite</h2>
                          </td>
                      </tr>
                      <tr>
                          <td colspan="2" style="padding: 20px; text-align: left;">
                              <p>Estimado/a <strong>${name}</strong>,</p>
                              <p>Su pedido se está tramitando. En breve, uno de nuestros agentes se pondrá en contacto con
                                  usted.</p>
                              <p>¡Gracias por confiar en <strong>CJMW WEB</strong>!</p>
                          </td>
                      </tr>
                  </table>
                  <!--<![endif]-->

              </td>
          </tr>

          <!-- Sección de Logos de Marcas -->
          <tr>
              <td align="center" style="padding-top: 20px;">
                  <table width="600px" cellpadding="5" cellspacing="0" border="0" align="center">
                      <tr>
                          <td align="center">
                              <a href="https://www.cjmw.eu/#/cjmHome" target="_blank">
                                  <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoCJM-sintexto.png"
                                      alt="Marca 1" width="50" style="display: block;">
                              </a>
                          </td>
                          <td align="center">
                              <a href="https://www.cjmw.eu/#/arenaHome" target="_blank">
                                  <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoArena.png"
                                      alt="Marca 2" width="100" style="display: block;">
                              </a>
                          </td>
                          <td align="center">
                              <a href="https://www.cjmw.eu/#/flamencoHome" target="_blank">
                                  <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoFlamenco.png"
                                      alt="Marca 3" width="100" style="display: block;">
                              </a>
                          </td>
                          <td align="center">
                              <a href="https://www.cjmw.eu/#/harbourHome" target="_blank">
                                  <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoHarbour.png"
                                      alt="Marca 4" width="100" style="display: block;">
                              </a>
                          </td>
                          <td align="center">
                              <a href="https://www.cjmw.eu/#/bassariHome" target="_blank">
                                  <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png"
                                      alt="Marca 5" width="80" style="display: block;">
                              </a>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>

      </table>

  </body>

  </html>


      `;

    // Enviar correo al agente
    await gerardoTransporter.sendMail({
      from: `"CJMW WEB Pedido" <${process.env.GERARDO_EMAIL}>`,
      to: process.env.PEDIDOS_EMAIL,
      subject: "Nuevo Pedido Tramitado",
      html: agentHtml,
    });

    gerardoTransporter.verify((error, success) => {
      if (error) {
        console.error("Error en gerardoTransporter:", error);
      } else {
        console.log("gerardoTransporter listo para enviar mensajes");
      }
    });

    // Enviar correo al cliente
    await pedidosTransporter.sendMail({
      from: `"CJMW WEB" <${process.env.PEDIDOS_EMAIL}>`,
      to: email,
      subject: "Su Pedido se Está Tramitando",
      html: clientHtml,
    });

    pedidosTransporter.verify((error, success) => {
      if (error) {
        console.error("Error en pedidosTransporter:", error);
      } else {
        console.log("pedidosTransporter listo para enviar mensajes");
      }
    });

    res.status(200).json({
      message: "✅ Pedido tramitado. Se han enviado los correos correspondientes.",
    });
  } catch (error) {
    console.error("❌ Error al tramitar el pedido:", error);
    res.status(500).json({ error: "❌ Error al tramitar el pedido" });
  }
});

// ── Error Handlers ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ error: err.message });
});

// ── Configuración de caché para Vercel Edge Caching ──
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate');
  }
  next();
});

// Puerto de la aplicación
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Serving static files from ${join(__dirname, 'web')}`);
});

export default app;
