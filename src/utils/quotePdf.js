// src/utils/quotePdf.js
// Presupuesto cortinas/puf con imágenes embebidas (Base64) y resumen en 2 columnas.
// Usa siempre el proxy existente en /api/proxy (ya configurado en tu backend).

// html2pdf se carga on-demand (reduce bundle inicial)
import i18n from '../i18n'; // <--- añadido para i18n en PDF
const tPdf = (k, opts) => i18n.t(k, { ns: 'quotePdf', ...opts });

/* ====================== CONFIG ====================== */
const COMPANY = {
  name: 'CJM WORLDWIDE S.L.',
  logoUrl: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/logo_cjm_blanco.png',
  email: 'info@cjmw.eu',
  addressLines: ['B14570873', 'AVDA. DE EUROPA 19', '14550 MONTILLA (SPAIN)', '+34 957 656 475', 'www.cjmw.eu']
};

/* ====================== HELPERS ====================== */
const fmt2 = (n) => (Number(n || 0)).toFixed(2);
const money = (n, cur = '€') => `${fmt2(n)} ${cur}`;
const safe = (v) => (v == null ? '' : String(v));
const today = () => {
  const d = new Date(), p = (x) => String(x).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};

/* ====================== FIRMA / REGISTRO ====================== */
// Llama al backend, firma y devuelve el PDF directamente (sin guardarlo en servidor)
// Llama al backend, firma y devuelve el PDF directamente (sin guardarlo en servidor)
export async function registerAndSignOnServer({ file, pdfBytes, ref, total, email, upload = false }) {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

  // Preferimos la ruta oficial, y dejamos alias por compatibilidad
  const urls = [
    `${base}/api/quotes/register-and-sign`,
    `${base}/api/quotes/register-sign`,
  ];

  // Construir el File si llega arrayBuffer/pdfBytes
  let fileToSend = file;
  if (!fileToSend && pdfBytes) {
    const blob = pdfBytes instanceof Blob
      ? pdfBytes
      : new Blob([pdfBytes], { type: 'application/pdf' });
    fileToSend = new File([blob], `${ref}.pdf`, { type: 'application/pdf' });
  }

  if (!fileToSend) {
    throw new Error('No hay PDF para firmar (ni file ni pdfBytes).');
  }

  // Ojo: FormData hay que recrearlo por cada fetch (algunos runtimes consumen el body)
  const buildFormData = () => {
    const fd = new FormData();
    fd.append('file', fileToSend, fileToSend.name || `${ref}.pdf`);
    fd.append('ref', ref);
    if (total != null) fd.append('total', String(total));
    if (email) fd.append('email', email);
    fd.append('upload', upload ? 'true' : 'false');
    return fd;
  };

  let lastMsg = '';

  for (const url of urls) {
    const res = await fetch(url, { method: 'POST', body: buildFormData() });

    if (res.ok) {
      const blob = await res.blob();
      return new File([blob], `${ref}.pdf`, { type: 'application/pdf' });
    }

    // Si es 404 probamos la otra ruta
    if (res.status === 404) {
      lastMsg = await res.text().catch(() => '');
      continue;
    }

    const msg = await res.text().catch(() => '');
    throw new Error(`Error firmando: ${res.status} ${msg}`);
  }

  throw new Error(`Error firmando: 404 ${lastMsg || ''}`.trim());
}

function apiBase() {
  // Igual que haces en otros lados: usa VITE_API_BASE_URL en prod; vacío en dev (proxy de Vite)
  const base = (import.meta?.env?.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
  return base; // '' en dev → usamos rutas relativas /api/...
}

function buildRef(prefix = 'PRES') {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${y}${m}${day}-${rnd}`;
}

function downloadUrl(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ---- Base64 ----
function blobToDataURL(blob) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
}

function isDataURL(str) {
  return typeof str === 'string' && str.startsWith('data:');
}

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  if (u.startsWith('//')) return `https:${u}`;
  if (/^https?:\/\//i.test(u)) return u;
  return u;
}

function proxyBase() {
  const base = (import.meta?.env?.VITE_API_BASE_URL || '').trim();
  return base ? `${base.replace(/\/+$/, '')}/api/proxy` : '/api/proxy';
}

/** Convierte una URL a dataURL usando SIEMPRE el proxy del backend */
async function urlToDataURL(url, { timeout = 10000 } = {}) {
  if (!url || typeof url !== 'string') return null;
  if (isDataURL(url)) return url;

  const clean = sanitizeUrl(url);
  if (!clean) return null;

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const proxiedUrl = `${proxyBase()}?url=${encodeURIComponent(clean)}&ts=${Date.now()}`;
    const res = await fetch(proxiedUrl, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(id);

    if (!res.ok) return null;

    const blob = await res.blob();
    const dataUrl = await blobToDataURL(blob);

    // Evita que html2pdf reciba el HTML de la SPA en lugar de la imagen
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:text/html')) {
      return null;
    }
    return dataUrl;
  } catch (_) {
    return null;
  }
}

async function ensureDataURL({ dataUrl, url }) {
  // Si ya viene un dataURL, solo aceptamos image/*
  if (isDataURL(dataUrl)) {
    return dataUrl.startsWith('data:image') ? dataUrl : null;
  }
  // Si también te pasan un dataURL en "url" (caso raro), aplica la misma regla
  if (isDataURL(url)) {
    return url.startsWith('data:image') ? url : null;
  }
  // Resolver mediante proxy
  if (url) return await urlToDataURL(url);
  return null;
}

/* ====================== RESOLUCIÓN DE IMÁGENES ====================== */
function pickFirst(values) {
  return values.find((v) => typeof v === 'string' && v.trim().length > 0) || null;
}

function getObjectImageUrl(obj) {
  if (!obj || typeof obj !== 'object') return null;

  const direct = pickFirst([
    obj.imageUrl, obj.image, obj.imagen, obj.foto,
    obj.thumbnail, obj.thumbUrl, obj.previewUrl, obj.swatchUrl
  ]);
  if (direct) return direct;

  const nested = obj?.image?.url || obj?.imagen?.url || obj?.assets?.thumbnail || obj?.assets?.image;
  if (nested) return nested;

  const arr =
    (Array.isArray(obj.images) && obj.images[0]) ||
    (Array.isArray(obj.fotos) && obj.fotos[0]) ||
    (obj?.assets?.images && obj.assets.images[0]) ||
    null;

  if (typeof arr === 'string') return arr;
  if (arr && typeof arr === 'object') {
    return pickFirst([arr.url, arr.imageUrl, arr.thumbnail, arr.previewUrl, arr.swatchUrl]);
  }

  return null;
}

function getImageUrlFromProductAndColor(product, color) {
  const colorUrl = getObjectImageUrl(color);
  if (colorUrl) return colorUrl;
  const prodUrl = getObjectImageUrl(product);
  if (prodUrl) return prodUrl;
  return null;
}

/* ====================== UI HELPERS ====================== */
function renderAddress(lines) {
  return lines.map(l => `<div>${l}</div>`).join('');
}
function sectionTitle(text) {
  return `<div style="font-weight:600; font-size:14px; margin:18px 0 8px;">${text}</div>`;
}
function kv(label, value) {
  return `
    <div style="display:flex; justify-content:space-between; gap:12px; margin:4px 0;">
      <div style="color:#475569; white-space:nowrap;">${label}</div>
      <div style="font-weight:600; text-align:right;">${value}</div>
    </div>
  `;
}
function card(content, accent = '#0f172a') {
  return `
    <div style="border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
      <div style="height:4px; background:${accent};"></div>
      <div style="padding:12px 14px;">${content}</div>
    </div>
  `;
}
function table(rows) {
  return `
    <table style="width:100%; border-collapse:separate; border-spacing:0; font-size:12px;">
      <thead>
        <tr>
          <th style="text-align:left; padding:10px 8px; border-bottom:1px solid #e2e8f0;">${tPdf('table.concept', { defaultValue: 'Concepto' })}</th>
          <th style="text-align:left; padding:10px 8px; border-bottom:1px solid #e2e8f0;">${tPdf('table.detail', { defaultValue: 'Detalle' })}</th>
          <th style="text-align:right; padding:10px 8px; border-bottom:1px solid #e2e8f0;">${tPdf('labels.amount')}</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((r, i) => `
          <tr style="background:${i % 2 ? '#fafafa' : '#fff'};">
            <td style="padding:10px 8px;">${r.concept}</td>
            <td style="padding:10px 8px;">${r.detail}</td>
            <td style="padding:10px 8px; text-align:right;">${r.amount}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
function twoColSummary({ leftHTML, rightHTML }) {
  return `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:8px 0;">
      ${card(leftHTML)} ${card(rightHTML)}
    </div>
  `;
}

/** Versión original (se mantiene por compatibilidad, no se usa ya) */
function fabricsBlock({ main, lining }) {
  const cells = [];
  if (main) cells.push(main);
  if (lining) cells.push(lining);
  if (!cells.length) return '';

  const items = cells.map(c => `
    <div style="display:flex; gap:12px; align-items:center;">
      ${c.dataUrl
      ? `<img src="${c.dataUrl}" style="height:56px;width:56px;border-radius:8px;object-fit:cover;border:1px solid #e2e8f0;" />`
      : `<div style="height:56px;width:56px;border-radius:8px;background:#f1f5f9;border:1px solid #e2e8f0;"></div>`}
      <div>
        <div style="font-weight:600;">${safe(c.title)}</div>
        ${c.subtitle ? `<div style="font-size:12px;color:#64748b;">${safe(c.subtitle)}</div>` : ''}
      </div>
    </div>
  `).join('');

  return `${sectionTitle(tPdf('sections.selectedFabrics'))}<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">${items}</div>`;
}

/** NUEVO: bloque con etiquetas (principal/forro) y detalle de paños/alto/metros/ancho pieza */
function fabricsBlockDetailed({ main, lining }) {
  const cells = [];
  if (main) cells.push({ ...main, label: main.label || tPdf('labels.mainFabric') });
  if (lining) cells.push({ ...lining, label: lining.label || tPdf('labels.lining') });
  if (!cells.length) return '';

  const fmtDrop = (cm) => (typeof cm === 'number' ? `${(cm / 100).toFixed(2)} m` : null);

  const items = cells.map(c => {
    const dropsLine = (typeof c.drops === 'number')
      ? `<div style="font-size:12px;color:#64748b;margin-top:4px;">
           ${tPdf('labels.panels', { defaultValue: 'Paños necesarios' })}: <strong>${c.drops}</strong>${c.dropHeightCm ? ` · ${tPdf('labels.dropHeight', { defaultValue: 'Alto por paño' })}: <strong>${fmtDrop(c.dropHeightCm)}</strong>` : ''}
           ${typeof c.meters === 'number' ? ` · ${tPdf('labels.meters', { defaultValue: 'Metros' })}: <strong>${fmt2(c.meters)} m</strong>` : ''}
           ${typeof c.boltWidthCm === 'number' ? ` · ${tPdf('labels.boltWidth', { defaultValue: 'Ancho pieza' })}: <strong>${c.boltWidthCm} cm</strong>` : ''}
         </div>`
      : '';

    return `
      <div style="display:flex; gap:12px; align-items:center;">
        ${c.dataUrl
        ? `<img src="${c.dataUrl}" style="height:56px;width:56px;border-radius:8px;object-fit:cover;border:1px solid #e2e8f0;" />`
        : `<div style="height:56px;width:56px;border-radius:8px;background:#f1f5f9;border:1px solid #e2e8f0;"></div>`}
        <div>
          <div style="font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:.02em; margin-bottom:2px;">${safe(c.label)}</div>
          <div style="font-weight:600;">${safe(c.title)}</div>
          ${c.subtitle ? `<div style="font-size:12px;color:#64748b;">${safe(c.subtitle)}</div>` : ''}
          ${dropsLine}
        </div>
      </div>
    `;
  }).join('');

  return `${sectionTitle(tPdf('sections.selectedFabrics'))}<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">${items}</div>`;
}

function headerHTML({ title, logoDataUrl, ref }) {
  return `
    <div style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
      <div style="background:linear-gradient(90deg,#0f172a,#334155);min-height:56px;display:flex;align-items:center;gap:12px;padding:10px 14px;">
        ${logoDataUrl ? `<img src="${logoDataUrl}" style="height:34px;width:auto;object-fit:contain;" />` : ''}
        <div style="font-size:16px;font-weight:700;color:#fff;">${safe(title)}</div>
      </div>
      <div style="display:flex;justify-content:space-between;padding:12px 14px;">
        <div><div style="font-weight:700;">${safe(COMPANY.name)}</div>${renderAddress(COMPANY.addressLines)}</div>
        <div style="text-align:right;font-size:12px;">
          <div><strong>${tPdf('header.date')}:</strong> ${today()}</div>
          <div><strong>${tPdf('header.ref')}:</strong> ${safe(ref)}</div>
        </div>
      </div>
    </div>
  `;
}
function footerHTML({ ref }) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:16px;font-size:12px;color:#334155;">
      <div>${tPdf('footer.sendTo')} <strong>${safe(COMPANY.email)}</strong>.</div>
      <div style="text-align:right;font-size:10px;">
        <div><strong>Ref:</strong> ${safe(ref)}</div>
        ${safe(COMPANY.name)}<br/>${renderAddress(COMPANY.addressLines)}
      </div>
    </div>
  `;
}

/* ====================== PUFF (adaptado con etiquetas) ====================== */
export async function generatePuffQuotePDF(input) {
  const {
    puffType, fabricsMode,
    fabric1, fabric2,
    fabricCost1 = 0, fabricCost2 = 0, confeccion = 0, total = 0,
    currency = '€',
    assets = {}
  } = input || {};

  const metersMain = fabricsMode === 'uno' ? 1.20 : 0.60;
  const metersTop = fabricsMode === 'dos' ? 0.60 : 0;

  const typeLabel =
    puffType === 'mediaLuna' ? tPdf('puff.type.halfMoon', { defaultValue: 'Media luna' }) :
      puffType === 'redondo' ? tPdf('puff.type.round', { defaultValue: 'Redondo' }) :
        puffType === 'trebol' ? tPdf('puff.type.clover', { defaultValue: 'Trébol' }) : safe(puffType).toUpperCase();

  const logoDataUrl = await ensureDataURL({ dataUrl: assets.logoDataUrl, url: COMPANY.logoUrl });

  // Resolver URL imagen principal/tapa: probar color y luego producto
  const mainUrlGuess = pickFirst([
    fabric1?.imageUrl,
    getImageUrlFromProductAndColor(fabric1?.product, fabric1?.color)
  ]);
  const topUrlGuess = pickFirst([
    fabric2?.imageUrl,
    getImageUrlFromProductAndColor(fabric2?.product, fabric2?.color)
  ]);

  const mainImg = await ensureDataURL({ dataUrl: fabric1?.imageDataUrl, url: mainUrlGuess });
  const topImg = await ensureDataURL({ dataUrl: fabric2?.imageDataUrl, url: topUrlGuess });

  if (!mainImg) console.debug('[PDF] Sin imagen para tejido principal PUF');
  if (!topImg && fabricsMode === 'dos') console.debug('[PDF] Sin imagen para tapa PUF');

  const left = kv(tPdf('labels.type'), typeLabel) + kv(tPdf('labels.numFabrics'), fabricsMode === 'uno' ? tPdf('labels.oneFabric') : tPdf('labels.twoFabrics'));
  const right = kv(`${tPdf('labels.sewing')} (${currency})`, money(confeccion, currency)) + kv(`${tPdf('labels.total')} (${currency})`, money(total, currency));
  const summary = twoColSummary({ leftHTML: left, rightHTML: right });

  const rows = [
    {
      concept: tPdf('labels.mainFabric'),
      detail: `${fmt2(metersMain)} m × €/m ${fabric1?.product ? `— ${safe(fabric1.product.nombre || fabric1.product.name)}${fabric1?.color?.name ? `, ${fabric1.color.name}` : ''}` : ''}`,
      amount: money(fabricCost1, currency)
    }
  ];
  if (fabricsMode === 'dos') {
    rows.push({
      concept: tPdf('labels.puffTop'),
      detail: `${fmt2(metersTop)} m × €/m ${fabric2?.product ? `— ${safe(fabric2.product.nombre || fabric2.product.name)}${fabric2?.color?.name ? `, ${fabric2.color.name}` : ''}` : ''}`,
      amount: money(fabricCost2, currency)
    });
  }
  rows.push({ concept: tPdf('labels.sewing'), detail: tPdf('labels.sewingDetail', { defaultValue: 'Trabajo de confección' }), amount: money(confeccion, currency) });
  rows.push({ concept: '<strong>TOTAL</strong>', detail: '', amount: `<strong>${money(total, currency)}</strong>` });

  const fabrics = fabricsBlockDetailed({
    main: fabric1?.product ? {
      label: tPdf('labels.mainFabric'),
      title: safe(fabric1.product?.nombre || fabric1.product?.name),
      subtitle: fabric1?.color?.name || '',
      dataUrl: mainImg,
      meters: metersMain
    } : null,
    lining: (fabricsMode === 'dos' && fabric2?.product) ? {
      label: tPdf('labels.puffTop'),
      title: safe(fabric2.product?.nombre || fabric2.product?.name),
      subtitle: fabric2?.color?.name || '',
      dataUrl: topImg,
      meters: metersTop
    } : null
  });

  const body = `${summary}${fabrics}${sectionTitle(tPdf('sections.economicDetail'))}${table(rows)}`;
  const ref = buildRef('PRES');
  await buildAndDownloadPDF({
    title: tPdf('header.title'),
    body,
    filename: `Presupuesto_PUF_${Date.now()}.pdf`,
    logoDataUrl,
    ref,
    total,               // el total que ya recibes en input
    email: input?.clienteEmail || '' // si lo tienes; si no, quita esta línea
  });
}

/* ====================== CORTINAS (con estilo/paños por tejido) ====================== */
/**
 * Tu llamada puede pasar:
 *  - meters, pricePerMeter, fabricCost, makingCost, subtotalWithoutLining, total
 *  - liningMeters, liningPricePerMeter, liningFabricCost
 *  - dropsMain, dropHeightCmMain, dropsLining, dropHeightCmLining (OPCIONAL: para mostrar paños por tejido)
 *  - config: {
 *      heightCm, widthCm, fabricBoltWidthCm, panels, dropHeightCm (opcional para resumen),
 *      mainFabricProduct, mainFabricColor,
 *      lining, liningProduct, liningColor, liningBoltWidthCm,
 *      makingType, bottom, includeMaking
 *    }
 *  - currency
 */
export async function generateCurtainQuotePDF(input) {
  const {
    meters = 0, pricePerMeter = 0, fabricCost = 0, makingCost = 0,
    subtotalWithoutLining = 0, total = 0,
    liningMeters = 0, liningPricePerMeter = 0, liningFabricCost = 0,
    dropsMain, dropHeightCmMain,
    dropsLining, dropHeightCmLining,
    config = {}, currency = '€', assets = {}
  } = input || {};

  // ---- Logo en base64 ----
  const logoDataUrl = await ensureDataURL({ dataUrl: assets.logoDataUrl, url: COMPANY.logoUrl });

  // ---- Resolver URLs de imagen a partir de producto+color (principal y forro) ----
  const mainUrlGuess = pickFirst([
    config?.mainFabricProduct?.imageUrl,
    getImageUrlFromProductAndColor(config?.mainFabricProduct, config?.mainFabricColor)
  ]);
  const liningUrlGuess = pickFirst([
    config?.liningProduct?.imageUrl,
    getImageUrlFromProductAndColor(config?.liningProduct, config?.liningColor)
  ]);

  // ---- Convertir a Base64 si existen ----
  const mainImg = await ensureDataURL({
    dataUrl: config?.mainFabricProduct?.imageDataUrl,
    url: mainUrlGuess
  });
  const liningImg = await ensureDataURL({
    dataUrl: config?.liningProduct?.imageDataUrl,
    url: liningUrlGuess
  });

  if (!mainImg) console.debug('[PDF] Sin imagen tela principal — revisa keys: imageUrl/image/imagen/images[0]/thumbnail en mainFabricProduct o mainFabricColor');
  if (!liningImg && config?.lining === 'forrada') console.debug('[PDF] Sin imagen forro — revisa keys en liningProduct o liningColor');

  // ---- Resumen en DOS columnas ----
  const left = [
    kv(tPdf('labels.width'), `${config.widthCm || '-'} cm`),
    kv(tPdf('labels.height'), `${config.heightCm || '-'} cm`),
    kv(tPdf('labels.style'), safe(config.panels ?? '-')),
  ].join('');

  const right = [
    kv(tPdf('labels.makingType', { defaultValue: 'Confección' }), safe(config.makingType || '-')),
    kv(tPdf('labels.bottom', { defaultValue: 'Bajo' }), safe(config.bottom || '-')),
    kv(`${tPdf('labels.total')} (€)`, money(total, currency))
  ].join('');

  const summary = twoColSummary({ leftHTML: left, rightHTML: right });

  // ---- Tejidos seleccionados (PRINCIPAL + FORRO) con paños por tejido ----
  const fabrics = fabricsBlockDetailed({
    main: config?.mainFabricProduct ? {
      label: tPdf('labels.mainFabric'),
      title: safe(config.mainFabricProduct?.nombre || config.mainFabricProduct?.name),
      subtitle: config?.mainFabricColor?.name || '',
      dataUrl: mainImg,
      meters,                          // m de la tela principal
      drops: typeof dropsMain === 'number' ? dropsMain : undefined,
      dropHeightCm: typeof dropHeightCmMain === 'number' ? dropHeightCmMain : undefined,
      boltWidthCm: config.fabricBoltWidthCm
    } : null,
    lining: config?.liningProduct ? {
      label: tPdf('labels.lining'),
      title: safe(
        config.liningProduct?.nombre ||
        config.liningProduct?.name ||
        config.liningProduct?.product?.nombre ||
        config.liningProduct?.product?.name
      ),
      subtitle: config?.liningColor?.name || '',
      dataUrl: liningImg,
      meters: liningMeters,
      drops: typeof dropsLining === 'number' ? dropsLining : undefined,
      dropHeightCm: typeof dropHeightCmLining === 'number' ? dropHeightCmLining : undefined,
      boltWidthCm: config.liningBoltWidthCm
    } : null
  });

  // ---- Detalle económico ----
  const rows = [
    { concept: tPdf('labels.fabric'), detail: `${fmt2(meters)} m × ${fmt2(pricePerMeter)} €/m`, amount: money(fabricCost, currency) }
  ];
  if (liningMeters && liningPricePerMeter) {
    rows.push({ concept: tPdf('labels.lining'), detail: `${fmt2(liningMeters)} m × ${fmt2(liningPricePerMeter)} €/m`, amount: money(liningFabricCost, currency) });
  }
  rows.push({ concept: tPdf('labels.sewing'), detail: tPdf('labels.sewingByType', { defaultValue: 'Según tipo elegido' }), amount: money(makingCost, currency) });
  rows.push({ concept: '<strong>TOTAL</strong>', detail: '', amount: `<strong>${money(total, currency)}</strong>` });

  const body = `${summary}${fabrics}${sectionTitle(tPdf('sections.economicDetail'))}${table(rows)}`;
  const ref = buildRef('PRES');
  await buildAndDownloadPDF({
    title: tPdf('header.title'),
    body,
    filename: `Presupuesto_CORTINAS_${Date.now()}.pdf`,
    logoDataUrl,
    ref,
    total,               // el total que recibes en input
    email: input?.clienteEmail || ''  // opcional
  });
}

/* ====================== PAPELES (WALLPAPER) ====================== */
/**
 * Genera el PDF de PAPEL PINTADO usando la misma infraestructura (proxy, i18n, firma).
 * input:
 *  - paper: { id, name, collection, price, ... }
 *  - widthCm, heightCm
 *  - calc info: rollLengthM, step1Raw, step1, factor, usablePerStripM, rolls
 *  - pricePerRoll, total
 *  - currency
 *  - assets: { logoDataUrl? }
 */
export async function generateWallpaperQuotePDF(input) {
  const {
    paper,
    widthCm = 0,
    heightCm = 0,
    isColony = false,

    rollLengthM = 0,
    step1Raw = 0,
    step1 = 0,
    factor = 0,
    usablePerStripM = 0,
    rolls = 0,

    pricePerRoll = 0,
    total = 0,
    currency = '€',
    assets = {}
  } = input || {};

  const logoDataUrl = await ensureDataURL({ dataUrl: assets.logoDataUrl, url: COMPANY.logoUrl });

  // Intentar imagen del papel si existe (por compatibilidad con distintos shape)
  const paperUrlGuess = pickFirst([
    paper?.imageUrl,
    getObjectImageUrl(paper),
  ]);
  const paperImg = await ensureDataURL({ dataUrl: paper?.imageDataUrl, url: paperUrlGuess });

  const left = [
    kv(tPdf('labels.width'), `${widthCm || '-'} cm`),
    kv(tPdf('labels.height'), `${heightCm || '-'} cm`),
    kv(tPdf('wallpaper.rollType', { defaultValue: 'Tipo de rollo' }), isColony ? 'COLONY (10 m)' : 'Estándar (5,5 m)'),
  ].join('');

  const right = [
    kv(tPdf('wallpaper.rollsNeeded', { defaultValue: 'Rollos necesarios' }), `<strong>${Number(rolls || 0)}</strong>`),
    kv(tPdf('wallpaper.pricePerRoll', { defaultValue: 'Precio/rollo' }), money(pricePerRoll, currency)),
    kv(`${tPdf('labels.total')} (${currency})`, `<strong>${money(total, currency)}</strong>`),
  ].join('');

  const summary = twoColSummary({ leftHTML: left, rightHTML: right });

  const selected = (() => {
    const title = safe(paper?.name || paper?.nombre || tPdf('wallpaper.wallpaper', { defaultValue: 'Papel pintado' }));
    const subtitleParts = [];
    if (paper?.collection) subtitleParts.push(`${tPdf('wallpaper.collection', { defaultValue: 'Colección' })}: ${safe(paper.collection)}`);
    if (Number.isFinite(Number(pricePerRoll)) && Number(pricePerRoll) > 0) subtitleParts.push(`${tPdf('wallpaper.pricePerRoll', { defaultValue: 'Precio/rollo' })}: ${money(pricePerRoll, currency)}`);

    return `${sectionTitle(tPdf('sections.selectedFabrics', { defaultValue: 'Producto seleccionado' }))}${`<div style="display:grid;grid-template-columns:1fr;gap:12px;">` +
      card(`
        <div style="display:flex; gap:12px; align-items:center;">
          ${paperImg
          ? `<img src="${paperImg}" style="height:56px;width:56px;border-radius:8px;object-fit:cover;border:1px solid #e2e8f0;" />`
          : `<div style="height:56px;width:56px;border-radius:8px;background:#f1f5f9;border:1px solid #e2e8f0;"></div>`
        }
          <div>
            <div style="font-weight:600;">${title}</div>
            ${subtitleParts.length ? `<div style="font-size:12px;color:#64748b;">${subtitleParts.join(' · ')}</div>` : ''}
          </div>
        </div>
      `) +
      `</div>`
      }`;
  })();

  const rows = [
    {
      concept: tPdf('wallpaper.wallpaper', { defaultValue: 'Papel' }),
      detail: `${safe(paper?.name || paper?.nombre || '—')}${paper?.collection ? ` · ${safe(paper.collection)}` : ''}`,
      amount: ''
    },
    {
      concept: tPdf('wallpaper.wallSize', { defaultValue: 'Medidas pared' }),
      detail: `${Number(widthCm) || 0} × ${Number(heightCm) || 0} cm`,
      amount: ''
    },
    {
      concept: tPdf('wallpaper.rollLength', { defaultValue: 'Longitud rollo' }),
      detail: `${fmt2(rollLengthM)} m`,
      amount: ''
    },
    {
      concept: tPdf('wallpaper.step1', { defaultValue: 'Tramos por rollo (floor)' }),
      detail: `${fmt2(step1Raw)} → ${Number(step1)}`,
      amount: ''
    },
    {
      concept: tPdf('wallpaper.factor', { defaultValue: 'Factor útil' }),
      detail: `${fmt2(factor)} m`,
      amount: ''
    },
    {
      concept: tPdf('wallpaper.usable', { defaultValue: 'Ancho útil por tramo' }),
      detail: `${fmt2(usablePerStripM)} m`,
      amount: ''
    },
    {
      concept: tPdf('wallpaper.rollsNeeded', { defaultValue: 'Rollos necesarios' }),
      detail: `${Number(rolls)}`,
      amount: ''
    },
    {
      concept: tPdf('wallpaper.cost', { defaultValue: 'Coste' }),
      detail: `${Number(rolls)} × ${fmt2(pricePerRoll)} ${currency}`,
      amount: money(Number(rolls) * Number(pricePerRoll), currency)
    },
    {
      concept: '<strong>TOTAL</strong>',
      detail: '',
      amount: `<strong>${money(total, currency)}</strong>`
    }
  ];

  const body = `
    ${summary}
    ${selected}
    ${sectionTitle(tPdf('sections.economicDetail'))}
    ${table(rows)}
  `;

  const ref = buildRef('PRES');
  await buildAndDownloadPDF({
    title: tPdf('header.wallpaperTitle', { defaultValue: 'Presupuesto · Papel pintado' }),
    body,
    filename: `Presupuesto_PAPELES_${Date.now()}.pdf`,
    logoDataUrl,
    ref,
    total: Number(total) || 0,
    email: input?.clienteEmail || ''
  });
}


/* ====================== ESTORES (actualizado) ====================== */
/**
 * Genera el PDF de ESTORES usando la misma infraestructura (proxy, i18n, firma).
 * input:
 *  - widthCm, heightCm
 *  - withRods (boolean)
 *  - mechPerMeter, mechCost, makingFixed, total        // total ya puede incluir tela si quieres
 *  - cutInfo: { cutWidth, cutHeight, rule }
 *  - areaM2 (número, m²)
 *  - pricePerMeter, metersLinear, fabricCost           // NUEVO: coste de tela
 *  - fabric: { product, color, rollWidth }
 *  - currency (por defecto '€')
 *  - assets: { logoDataUrl? }
 */
export async function generateStoreQuotePDF(input) {
  const {
    widthCm = 0,
    heightCm = 0,
    withRods = true,
    mechPerMeter = 0,
    mechCost = 0,
    makingFixed = 0,
    total = 0,
    cutInfo = { cutWidth: 0, cutHeight: 0, rule: 'base' },
    areaM2 = 0,
    pricePerMeter = 0,
    metersLinear = 0,
    fabricCost = 0,
    fabric = {},
    currency = '€',
    assets = {}
  } = input || {};

  const logoDataUrl = await ensureDataURL({ dataUrl: assets.logoDataUrl, url: COMPANY.logoUrl });

  const mainUrlGuess = pickFirst([
    fabric?.imageUrl,
    getImageUrlFromProductAndColor(fabric?.product, fabric?.color)
  ]);
  const mainImg = await ensureDataURL({
    dataUrl: fabric?.imageDataUrl,
    url: mainUrlGuess
  });

  const left = [
    kv(tPdf('labels.width'), `${widthCm || '-'} cm`),
    kv(tPdf('labels.height'), `${heightCm || '-'} cm`),
    kv(tPdf('labels.requiredFabric', { defaultValue: 'Tela necesaria' }), `${Number(areaM2 || 0).toFixed(2)} m²`),
    kv(tPdf('labels.cut', { defaultValue: 'Corte' }),
      `${cutInfo?.cutWidth || '-'} × ${cutInfo?.cutHeight || '-'} cm${cutInfo?.rule === 'railroaded' ? ' · optimizado por rollo' : ''}`
    ),
  ].join('');

  const right = [
    kv(`${tPdf('labels.fabric')} (${currency})`,
      `${Number(metersLinear).toFixed(2)} m × ${Number(pricePerMeter).toFixed(2)} €/m = ${Number(fabricCost).toFixed(2)} ${currency}`),
    kv(`${withRods ? tPdf('store.withRods', { defaultValue: 'Con varillas' }) : tPdf('store.withoutRods', { defaultValue: 'Sin varillas' })} (${currency})`,
      `${(widthCm / 100).toFixed(2)} m × ${Number(mechPerMeter).toFixed(2)} €/m = ${Number(mechCost).toFixed(2)} ${currency}`),
    kv(`${tPdf('labels.sewing')} (${currency})`, `${Number(makingFixed).toFixed(2)} ${currency}`),
    kv(`${tPdf('labels.total')} (${currency})`, `<strong>${Number(total).toFixed(2)} ${currency}</strong>`)
  ].join('');

  const summary = twoColSummary({ leftHTML: left, rightHTML: right });

  const fabricTitle = fabric?.product?.nombre || fabric?.product?.name || tPdf('labels.mainFabric');
  const fabricSubtitle = fabric?.color?.name || fabric?.color?.nombre || '';
  const fabrics = fabricsBlockDetailed({
    main: {
      label: tPdf('labels.mainFabric'),
      title: safe(fabricTitle),
      subtitle: [fabricSubtitle, fabric?.rollWidth ? `· ${tPdf('labels.boltWidthShort', { defaultValue: 'ancho' })} ${fabric.rollWidth} cm` : ''].filter(Boolean).join(' '),
      dataUrl: mainImg
    }
  });

  const rows = [
    {
      concept: tPdf('labels.fabric'),
      detail: `${Number(metersLinear).toFixed(2)} m × ${Number(pricePerMeter).toFixed(2)} €/m`,
      amount: `${Number(fabricCost).toFixed(2)} ${currency}`
    },
    {
      concept: withRods ? tPdf('store.withRods', { defaultValue: 'Con varillas' }) : tPdf('store.withoutRods', { defaultValue: 'Sin varillas' }),
      detail: `${(widthCm / 100).toFixed(2)} m × ${Number(mechPerMeter).toFixed(2)} €/m`,
      amount: `${Number(mechCost).toFixed(2)} ${currency}`
    },
    {
      concept: tPdf('labels.sewing'),
      detail: tPdf('store.sewingDetail', { defaultValue: 'Confección fija' }),
      amount: `${Number(makingFixed).toFixed(2)} ${currency}`
    },
    {
      concept: '<strong>TOTAL</strong>',
      detail: '',
      amount: `<strong>${Number(total).toFixed(2)} ${currency}</strong>`
    }
  ];

  const body = `
    ${summary}
    ${fabrics}
    ${sectionTitle(tPdf('sections.economicDetail'))}
    ${table(rows)}
  `;

  const ref = buildRef('PRES');
  await buildAndDownloadPDF({
    title: tPdf('header.storeTitle', { defaultValue: 'Presupuesto · Estor' }),
    body,
    filename: `Presupuesto_ESTOR_${Date.now()}.pdf`,
    logoDataUrl,
    ref,
    total: Number(total) || 0,
    email: input?.clienteEmail || ''
  });
}

/* ====================== MARCA DE AGUA ====================== */
// Genera un patrón SVG en dataURL para usarlo como background repetido
function watermarkBackground(text = 'PRESUPUESTO CJM GROUP') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="300" viewBox="0 0 420 300">
      <defs>
        <style>
          text { font-family: Inter, Arial, sans-serif; font-weight: 800; }
        </style>
      </defs>
      <g transform="rotate(-30,210,150)">
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-size="36" fill="#0f172a" fill-opacity="0.08">
          ${text}
        </text>
      </g>
    </svg>
  `;
  const encoded = encodeURIComponent(svg.replace(/\n+/g, ''));
  return `url("data:image/svg+xml;utf8,${encoded}")`;
}

// Ajustes rápidos (cm y color RGB)
const REF_TEXT_SIZE = 11;          // tamaño de fuente
const REF_OFFSET_X_CM = -0.30;     // negativo = mueve a la IZQUIERDA, positivo = a la DERECHA
const REF_OFFSET_Y_CM = 0.80;      // positivo = BAJA, negativo = SUBE
const REF_COLOR_RGB = [255, 255, 255]; // blanco (cambia a [0,0,0] para negro)

async function buildAndDownloadPDF({ title, body, filename, logoDataUrl, ref, total, email }) {
  if (!ref) {
    ref = `PRES-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  const wrapper = document.createElement('div');

  // A4 + estilos base
  const PAGE_W_CM = 21;
  const PAGE_H_CM = 29.7;
  const MARGIN_CM = 1.2;

  wrapper.style.width = `${PAGE_W_CM}cm`;
  // FIX: no fijamos minHeight para evitar desbordes que causan página en blanco
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.padding = `${MARGIN_CM}cm`;
  wrapper.style.background = '#ffffff';
  wrapper.style.color = '#0f172a';
  wrapper.style.fontFamily = 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
  wrapper.style.fontSize = '13.5px';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.gap = '14px';
  wrapper.style.wordBreak = 'keep-all';
  wrapper.style.overflowWrap = 'anywhere';

  // Marca de agua (si la usas)
  wrapper.style.backgroundImage = watermarkBackground('PRESUPUESTO CJM GROUP');
  wrapper.style.backgroundRepeat = 'repeat';
  wrapper.style.backgroundPosition = 'center';
  wrapper.style.backgroundSize = '420px 300px';

  // Contenido HTML (para usuario)
  wrapper.innerHTML = `
    ${headerHTML({ title, logoDataUrl, ref })}
    ${body}
    <hr style="margin:14px 0; border:0; border-top:1px solid #e2e8f0;" />
    ${footerHTML({ ref })}
  `;

  document.body.appendChild(wrapper);
  const { default: html2pdf } = await import('html2pdf.js');
  const opts = {
    margin: 0,
    filename,
    html2canvas: { scale: 3, useCORS: true },
    jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
  };

  try {
    // 1) Render HTML -> jsPDF
    const worker = html2pdf().set(opts).from(wrapper).toPdf();
    const pdf = await worker.get('pdf'); // instancia jsPDF (unit=cm)

    // 2) Estampar UNA referencia como texto PDF real (cabecera derecha, dentro de márgenes)
    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(REF_TEXT_SIZE);
    pdf.setTextColor(...REF_COLOR_RGB);

    const pageWidth = pdf.internal.pageSize.getWidth();            // cm
    const rightX = pageWidth - MARGIN_CM;                          // borde derecho seguro
    const topY = MARGIN_CM + 0.35 + REF_OFFSET_Y_CM;               // posición vertical
    const refText = `Reference: ${ref}`;
    const textWidth = pdf.getTextWidth(refText);                   // cm
    const x = Math.max(MARGIN_CM, rightX - textWidth + REF_OFFSET_X_CM);

    pdf.setPage(1);
    pdf.text(refText, x, topY);

    // 2.5) Guardia: si el contenido cabe en una página pero html2pdf añadió otra por redondeos, elimínala
    try {
      const totalPages =
        (pdf.internal.getNumberOfPages && pdf.internal.getNumberOfPages()) ||
        (pdf.getNumberOfPages && pdf.getNumberOfPages()) || 1;

      const pxPerCm = wrapper.offsetWidth / PAGE_W_CM;
      const contentHeightCm = wrapper.offsetHeight / pxPerCm;

      // Tolerancia de 0.2cm para redondeos
      if (totalPages > 1 && contentHeightCm <= (PAGE_H_CM - 0.2)) {
        pdf.deletePage(totalPages);
      }
    } catch (_) {
      // Si la API difiere, simplemente no aplicamos la poda.
    }

    // 3) Metadatos útiles (no visibles)
    pdf.setProperties({
      title: filename.replace(/\.pdf$/i, ''),
      subject: `Reference: ${ref}`,
      keywords: [
        `reference:${ref}`,
        `ref:${ref}`,
        `Reference ${ref}`,
        `Reference: ${ref}`,
        ref
      ].join(', ')
    });

    // 4) Exportar bytes y firmar en backend
    const arrayBuffer = pdf.output('arraybuffer');

    const signedFile = await registerAndSignOnServer({
      ref,
      total: typeof total === 'number' ? total : undefined,
      email: email || undefined,
      pdfBytes: arrayBuffer
    });

    // 5) Descargar firmado
    const url = URL.createObjectURL(signedFile);
    const signedName = filename.replace(/\.pdf$/i, '.pdf');
    const a = document.createElement('a');
    a.href = url;
    a.download = signedName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } finally {
    document.body.removeChild(wrapper);
  }
}