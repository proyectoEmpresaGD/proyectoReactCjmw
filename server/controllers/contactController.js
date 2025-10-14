import { validationResult } from 'express-validator';
import xss from 'xss';

/* ============================================================================
   Utilidades de idioma (detección ES/EN por país)
============================================================================ */
const SPANISH_CC = new Set([
  'ES', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'GT', 'HN', 'SV', 'NI', 'CR', 'PA', 'CU', 'DO', 'PR', 'AD', 'GQ'
]);
const SPANISH_NAMES = new Set([
  'espana', 'españa', 'spain', 'mexico', 'méxico', 'argentina', 'chile', 'colombia', 'peru', 'perú', 'venezuela', 'ecuador',
  'bolivia', 'paraguay', 'uruguay', 'guatemala', 'honduras', 'el salvador', 'nicaragua', 'costa rica', 'panama', 'panamá',
  'cuba', 'dominican republic', 'república dominicana', 'puerto rico', 'andorra', 'equatorial guinea', 'guinea ecuatorial'
]);
const normalizeCountry = (v) => (v ?? '')
  .toString().trim().toLowerCase()
  .normalize('NFD').replace(/\p{Diacritic}/gu, '');
const isSpanishCountry = (country) => {
  if (!country) return false;
  const raw = String(country).trim();
  if (raw.length === 2) return SPANISH_CC.has(raw.toUpperCase());
  return SPANISH_NAMES.has(normalizeCountry(raw));
};

/* ============================================================================
   Constantes de layout/email (Outlook clásico – motor Word)
============================================================================ */
const ORDER_EMAIL_WIDTH = 640;

const LOGO_URL = 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoCJM_group.png'; // <- logo solicitado
const DIVIDER = '#E4E8F1';
const TEXT_MAIN = '#0B1526';
const TEXT_MUTED = '#4F566B';
const BRAND_HEADER_BG = '#F3F4F6';  // Header claro (el logo es oscuro)
const SOFT_PANEL = '#F7F8FC';
const BRAND_ACCENT = '#0E1B2E';
const CTA_TEXT = '#FFFFFF';

// Imagen hero (>=640px ancho real) — cojines / rafias
const HERO_IMG =
  'https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/KANNATURA%20AMBIENTE%20BUENA%20CALIDAD/AR_AMBIENTE_RAFIAS_YUKI.jpg';

/* ============================================================================
   Bloques “seguros” para Outlook clásico (tablas + inline styles)
============================================================================ */
function headerBlock640() {
  return `
  <tr>
    <td align="center" bgcolor="${BRAND_HEADER_BG}" style="padding:12px 16px;background:${BRAND_HEADER_BG};">
      <table role="presentation" width="${ORDER_EMAIL_WIDTH}" cellpadding="0" cellspacing="0" border="0" align="center" style="width:${ORDER_EMAIL_WIDTH}px;">
        <tr>
          <td align="left" valign="middle" style="padding:0;">
            <a href="https://www.cjmw.eu/#/" style="text-decoration:none;border:0;outline:none;">
              <img src="${LOGO_URL}" alt="CJM Group" width="180"
                   style="display:block;border:0;height:auto;max-width:180px;">
            </a>
          </td>
          <td align="right" valign="middle" style="font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function heroBlock640(imageUrl = HERO_IMG, altText = 'Colección CJM Group') {
  return `
  <tr>
    <td align="center" style="padding:0;line-height:0;font-size:0;">
      <table role="presentation" width="${ORDER_EMAIL_WIDTH}" cellpadding="0" cellspacing="0" border="0" align="center"
             style="width:${ORDER_EMAIL_WIDTH}px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
        <tr>
          <td style="padding:0;line-height:0;font-size:0;">
            <img src="${imageUrl}"
                 alt="${altText}"
                 width="${ORDER_EMAIL_WIDTH}"
                 style="display:block;border:0;width:${ORDER_EMAIL_WIDTH}px;height:auto;">
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function brandsStrip640() {
  return `
  <tr>
    <td align="center" bgcolor="${SOFT_PANEL}" style="padding:12px 10px;background:${SOFT_PANEL};border-top:1px solid ${DIVIDER};">
      <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" valign="middle" style="padding:4px 8px;">
            <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoCJM-sintexto.png" alt="CJM" width="60" style="display:block;border:0;height:auto;">
          </td>
          <td align="center" valign="middle" style="padding:4px 8px;">
            <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoArena.png" alt="Arena" width="68" style="display:block;border:0;height:auto;">
          </td>
          <td align="center" valign="middle" style="padding:4px 8px;">
            <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoFlamenco.png" alt="Flamenco" width="68" style="display:block;border:0;height:auto;">
          </td>
          <td align="center" valign="middle" style="padding:4px 8px;">
            <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoHarbour.png" alt="Harbour" width="68" style="display:block;border:0;height:auto;">
          </td>
          <td align="center" valign="middle" style="padding:4px 8px;">
            <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png" alt="Bassari" width="60" style="display:block;border:0;height:auto;">
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function wrapEmail640(innerRows) {
  return `<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="x-apple-disable-message-reformatting">
<!--[if mso]>
  <style>
    *{font-family:Arial,Helvetica,sans-serif !important}
    table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}
    img{-ms-interpolation-mode:bicubic}
    a{text-decoration:none}
  </style>
<![endif]-->
<title>CJMW</title>
</head>
<body style="margin:0;padding:0;background:#FFFFFF;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#FFFFFF;">
    <tr>
      <td align="center" style="padding:24px 0;">
        <table role="presentation" width="${ORDER_EMAIL_WIDTH}" cellpadding="0" cellspacing="0" border="0"
               style="width:${ORDER_EMAIL_WIDTH}px;background:#ffffff;border:1px solid ${DIVIDER};">
          ${headerBlock640()}
          ${innerRows}
          ${brandsStrip640()}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ============================================================================
   Helpers de contenido
============================================================================ */
const buildDetailRow = (label, value) => `
  <tr>
    <td style="width:210px;padding:8px 0;color:${TEXT_MUTED};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4;">${label}</td>
    <td style="padding:8px 0;color:${TEXT_MAIN};font-weight:600;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4;">${value}</td>
  </tr>
`;

/* ============================================================================
   Plantilla: notificación interna (al inbox)
============================================================================ */
const internalTemplate = ({ record, payload }) => {
  const {
    profile,
    firstName,
    lastName,
    email,
    company,
    country,
    postalCode,
    province,
    reason,
    message,
    marketingOptIn,
    consentVersion,
    ipAddress,
    userAgent,
    attachmentPath,
  } = payload;

  const subject = 'Nueva solicitud de contacto';
  const profileLabel = profile === 'professional' ? 'Profesional' : 'Particular';

  const bodyRows = `
  ${heroBlock640(HERO_IMG, 'Colección CJM Group')}
  <tr>
    <td class="p-xs" style="padding:24px 28px;font-family:Arial,Helvetica,sans-serif;color:${TEXT_MAIN};">
      <div style="margin-bottom:12px;">
        <span style="display:inline-block;padding:6px 12px;border:1px solid #E1E6F0;color:${BRAND_ACCENT};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">
          ${profileLabel}
        </span>
      </div>

      <h1 style="margin:0 0 12px 0;font-weight:700;font-size:20px;line-height:1.3;color:${TEXT_MAIN};">Nueva solicitud de contacto</h1>
      <p style="margin:0 0 14px 0;color:${TEXT_MUTED};line-height:1.6;font-size:14px;">
        Se ha registrado una nueva solicitud de contacto desde la web corporativa. A continuación encontrarás el resumen completo.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${[
      ['Nombre completo', `<strong>${firstName} ${lastName}</strong>`],
      ['Correo electrónico', `<a href="mailto:${email}" style="color:${BRAND_ACCENT};text-decoration:none;">${email}</a>`],
      ['Empresa', company ?? '—'],
      ['País', country ?? '—'],
      ['Código postal', postalCode ?? '—'],
      ['Provincia', province ?? '—'],
      ['Motivo', reason ?? '—'],
      ['Consentimiento', `versión ${consentVersion}`],
      ['Marketing', marketingOptIn ? 'Sí' : 'No'],
    ].map(([label, value]) => buildDetailRow(label, value)).join('')
    }
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0 0;border-top:1px solid ${DIVIDER};">
        <tr>
          <td style="padding:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;">
            <div style="font-weight:700;font-size:15px;margin-bottom:6px;color:${TEXT_MAIN};">Mensaje enviado</div>
            <div style="white-space:pre-wrap;color:#3D4556;line-height:1.6;font-size:14px;">${message ?? ''}</div>
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${DIVIDER};margin-top:12px;color:#6B7280;font-size:12px;font-family:Arial,Helvetica,sans-serif;">
        <tr><td style="padding:6px 0;width:210px;">ID del registro:</td><td style="padding:6px 0;color:${TEXT_MAIN};">${record.id}</td></tr>
        <tr><td style="padding:6px 0;">IP:</td><td style="padding:6px 0;color:${TEXT_MAIN};">${ipAddress ?? '—'}</td></tr>
        <tr><td style="padding:6px 0;">User-Agent:</td><td style="padding:6px 0;color:${TEXT_MAIN};">${userAgent ?? '—'}</td></tr>
        <tr><td style="padding:6px 0;">Fecha:</td><td style="padding:6px 0;color:${TEXT_MAIN};">${record.created_at.toISOString()}</td></tr>
        ${attachmentPath ? `<tr><td style="padding:6px 0;">Adjunto:</td><td style="padding:6px 0;color:${TEXT_MAIN};">${attachmentPath}</td></tr>` : ''}
      </table>
    </td>
  </tr>`;

  const html = wrapEmail640(bodyRows);

  const text = `Nueva solicitud de contacto

Perfil: ${profileLabel}
Nombre: ${firstName} ${lastName}
Email: ${email}
Empresa: ${company ?? '—'}
País: ${country ?? '—'}
Código postal: ${postalCode ?? '—'}
Provincia: ${province ?? '—'}
Motivo: ${reason ?? '—'}
Marketing: ${marketingOptIn ? 'Sí' : 'No'}
Consentimiento: versión ${consentVersion}

Mensaje:
${message ?? ''}

ID del registro: ${record.id}
IP: ${ipAddress ?? '—'}
User-Agent: ${userAgent ?? '—'}
Fecha: ${record.created_at.toISOString()}
${attachmentPath ? `Adjunto: ${attachmentPath}` : ''}`;

  return { subject, html, text };
};

/* ============================================================================
   Plantilla: correo de agradecimiento (al usuario)
   - Showroom: Av. de Europa, 19 · 14550 Montilla (Córdoba) · España
============================================================================ */
const thankYouTemplate = (locale = 'es', { name }) => {
  const subject = locale === 'es'
    ? 'Gracias por contactarnos — CJMW'
    : 'Thank you for contacting us — CJMW';

  const greet = locale === 'es'
    ? `Hola${name ? ` ${name}` : ''},`
    : `Hello${name ? ` ${name}` : ''},`;

  const firstParagraph = locale === 'es'
    ? 'Hemos recibido tu mensaje y uno de nuestros especialistas se pondrá en contacto contigo en breve.'
    : 'We have received your message and one of our specialists will get back to you shortly.';

  const secondParagraph = locale === 'es'
    ? 'Si necesitas añadir más información puedes responder directamente a este correo.'
    : 'If you need to add any information, simply reply to this email.';

  const footer = locale === 'es' ? 'Gracias por confiar en CJMW.' : 'Thank you for choosing CJMW.';

  const collectionsTitle = locale === 'es' ? 'Explora nuestras colecciones' : 'Explore our collections';
  const ctaLabel = locale === 'es' ? 'Visitar la web' : 'Visit our website';

  const showroomTitle = locale === 'es' ? 'Showroom Montilla' : 'Montilla Showroom';
  const showroomCopy = 'Av. de Europa, 19 · 14550 Montilla (Córdoba) · España';

  const clientServicesTitle = locale === 'es' ? 'Atención al cliente' : 'Client Services';
  const clientServicesCopy = locale === 'es'
    ? 'Para cualquier consulta adicional puedes escribirnos a info@cjmw.eu o llamarnos al +34 957 65 67 08.'
    : 'For any additional enquiries reach us at info@cjmw.eu or call +34 957 65 67 08.';

  const bodyRows = `
  ${heroBlock640(HERO_IMG, 'CJM Group')}
  <tr>
    <td class="p-xs" style="padding:24px 28px;font-family:Arial,Helvetica,sans-serif;color:#14213b;line-height:1.6;">
      <div style="font-weight:700;font-size:18px;margin:0 0 10px 0;color:${TEXT_MAIN};">
        ${locale === 'es' ? 'Gracias por ponerte en contacto con CJMW' : 'Thank you for reaching out to CJMW'}
      </div>
      <p style="margin:0 0 10px 0;color:${TEXT_MUTED};font-size:14px;">${firstParagraph}</p>
      <p style="margin:0 0 16px 0;color:${TEXT_MUTED};font-size:14px;">${secondParagraph}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:0;">
            <!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://www.cjmw.eu/#/"
              style="height:40px;v-text-anchor:middle;width:220px;" arcsize="8%" stroke="f" fillcolor="${BRAND_ACCENT}">
              <w:anchorlock/>
              <center style="color:${CTA_TEXT};font-family:Arial, Helvetica, sans-serif;font-size:13px;font-weight:bold;">
                ${ctaLabel}
              </center>
            </v:roundrect>
            <![endif]-->
            <!--[if !mso]><!-- -->
            <a href="https://www.cjmw.eu/#/"
               style="display:inline-block;padding:12px 22px;background:${BRAND_ACCENT};color:${CTA_TEXT};
                      font-weight:700;font-size:13px;text-decoration:none;border-radius:4px;">
              ${ctaLabel}
            </a>
            <!--<![endif]-->
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td class="p-xs" style="padding:20px 28px 8px 28px;font-family:Arial,Helvetica,sans-serif;color:#14213b;line-height:1.6;">
      <div style="font-weight:700;font-size:16px;margin:0 0 10px 0;color:${TEXT_MAIN};">${collectionsTitle}</div>

      <!-- 2 columnas seguras -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td class="stack" style="width:320px;padding:0 8px 12px 0;vertical-align:top;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${DIVIDER};">
              <tr>
                <td style="padding:14px;">
                  <img src="https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO_%20TEJIDO%20RAYA%20ANCHA(1).jpg"
                       alt="Harbour" width="292" style="display:block;width:292px;height:auto;border:0;">
                  <div style="font-weight:700;margin:10px 0 6px 0;color:${TEXT_MAIN};">Harbour</div>
                  <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">
                    ${locale === 'es'
      ? 'Colecciones outdoor &amp; contract inspiradas en la costa mediterránea.'
      : 'Outdoor &amp; contract collections inspired by the Mediterranean coast.'}
                  </p>
                </td>
              </tr>
            </table>
          </td>
          <td class="stack" style="width:320px;padding:0 0 12px 8px;vertical-align:top;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${DIVIDER};">
              <tr>
                <td style="padding:14px;">
                  <img src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ARENA%20AMBIENTE/COSY/ARN_COSY_6%20MINIATURA.jpg"
                       alt="Arena" width="292" style="display:block;width:292px;height:auto;border:0;">
                  <div style="font-weight:700;margin:10px 0 6px 0;color:${TEXT_MAIN};">Arena</div>
                  <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">
                    ${locale === 'es'
      ? 'Texturas mediterráneas y soluciones prêt-à-porter para proyectos residenciales.'
      : 'Mediterranean textures and prêt-à-porter solutions for residential projects.'}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Dos tarjetas informativas -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
        <tr>
          <td class="stack" style="width:320px;padding:0 8px 12px 0;vertical-align:top;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND_ACCENT};color:#ffffff;border:1px solid ${BRAND_ACCENT};">
              <tr><td style="padding:14px 16px;">
                <div style="font-weight:700;font-size:15px;margin-bottom:6px;">${showroomTitle}</div>
                <p style="margin:0;color:#ffffff;font-size:13px;">${showroomCopy}</p>
              </td></tr>
            </table>
          </td>
          <td class="stack" style="width:320px;padding:0 0 12px 8px;vertical-align:top;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FDF2EC;color:#7A3411;border:1px solid #F5C5A2;">
              <tr><td style="padding:14px 16px;">
                <div style="font-weight:700;font-size:15px;margin-bottom:6px;">${clientServicesTitle}</div>
                <p style="margin:0;color:#7A3411;font-size:13px;">${clientServicesCopy}</p>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

  const html = wrapEmail640(bodyRows);

  const text = `${greet}

${firstParagraph}
${secondParagraph}

${collectionsTitle}:
- Harbour: ${locale === 'es' ? 'Colecciones outdoor & contract inspiradas en la costa mediterránea.' : 'Outdoor & contract collections inspired by the Mediterranean coast.'}
- Arena: ${locale === 'es' ? 'Texturas mediterráneas y soluciones prêt-à-porter para proyectos residenciales.' : 'Mediterranean textures and prêt-à-porter solutions for residential projects.'}

${showroomTitle}: ${showroomCopy}
${clientServicesTitle}: ${clientServicesCopy}

${footer}
https://www.cjmw.eu/#/
Instagram: https://www.instagram.com/cjmw.group/
LinkedIn: https://www.linkedin.com/company/cjmw-group/
Pinterest: https://www.pinterest.es/cjmw_group/
`;

  return { subject, html, text };
};

/* ============================================================================
   Controlador
============================================================================ */
export class ContactController {
  constructor({ contactModel, transporter = null, contactInbox = null }) {
    if (!contactModel) throw new Error('contactModel dependency is required');
    this.contactModel = contactModel;
    this.transporter = transporter;
    this.contactInbox = contactInbox;
  }

  sanitize(value) {
    if (typeof value !== 'string') return value;
    return xss(value, { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ['script'] });
  }

  async handleCreate(req, res, next) {
    try {
      const validation = validationResult(req);
      if (!validation.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: validation.array() });
      }

      const {
        profile,
        firstName,
        lastName,
        email,
        company,
        country,
        postalCode,
        province,
        reason,
        message,
        marketing = 'false',
        consentVersion = '1.0',
      } = req.body;

      const sanitizedPayload = {
        profile,
        firstName: this.sanitize(firstName),
        lastName: this.sanitize(lastName),
        email: email.toLowerCase(),
        company: company ? this.sanitize(company) : null,
        country: this.sanitize(country),
        postalCode: this.sanitize(postalCode),
        province: province ? this.sanitize(province) : null,
        reason: this.sanitize(reason),
        message: this.sanitize(message),
        marketingOptIn: marketing === 'true',
        consentGranted: true,
        consentVersion,
        attachmentPath: req.file ? `uploads/${req.file.filename}` : null,
        attachmentMime: req.file?.mimetype ?? null,
        attachmentSize: req.file?.size ?? null,
        ipAddress: req.ip,
        userAgent: req.get('user-agent') ?? null,
      };

      const record = await this.contactModel.create(sanitizedPayload);

      await this.sendNotificationEmail({ record, payload: sanitizedPayload, originalAttachment: req.file ?? null });
      await this.sendThankYouEmail({ payload: sanitizedPayload });

      return res.status(201).json({ message: 'Contact request stored successfully.', id: record.id });
    } catch (error) {
      return next(error);
    }
  }

  async handleList(req, res, next) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
      const offset = parseInt(req.query.offset, 10) || 0;
      const reasonFilter = req.query.reason;
      const profileFilter = req.query.profile;

      const rows = await this.contactModel.list({ limit, offset, reason: reasonFilter, profile: profileFilter });
      return res.json({ data: rows, count: rows.length });
    } catch (error) {
      return next(error);
    }
  }

  async prune(retentionDays) {
    await this.contactModel.deleteOlderThanDays(retentionDays);
  }

  async sendNotificationEmail({ record, payload, originalAttachment }) {
    if (!this.transporter || !this.contactInbox) return;

    const { subject, html, text } = internalTemplate({ record, payload });

    const fromAddress =
      this.transporter?.options?.auth?.user ??
      process.env.CONTACT_SMTP_USER ??
      process.env.SMTP_USER ??
      'no-reply@example.com';

    const mailOptions = {
      from: `Contacto Web <${fromAddress}>`,
      to: this.contactInbox,
      subject,
      html,
      text,
      attachments: originalAttachment
        ? [{
          filename: originalAttachment.originalname,
          path: originalAttachment.path,
          contentType: originalAttachment.mimetype,
        }]
        : [],
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending contact notification email:', emailError);
    }
  }

  async sendThankYouEmail({ payload }) {
    if (!this.transporter) return;
    const { email, firstName, country } = payload;
    if (!email) return;

    const locale = isSpanishCountry(country) ? 'es' : 'en';
    const tpl = thankYouTemplate(locale, { name: firstName });

    const fromAddress =
      this.transporter?.options?.auth?.user ??
      process.env.CONTACT_SMTP_USER ??
      process.env.SMTP_USER ??
      'no-reply@example.com';

    try {
      await this.transporter.sendMail({
        from: `CJMW WEB <${fromAddress}>`,
        to: email,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
      });
    } catch (emailError) {
      console.error('Error sending thank-you email:', emailError);
    }
  }
}
