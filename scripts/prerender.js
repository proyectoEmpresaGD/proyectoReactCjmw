import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = 'dist';
const APP_FILE = path.join(__dirname, '..', 'src', 'App.jsx');
const BASE_TEMPLATE = path.join(__dirname, '..', OUTPUT_DIR, 'index.html');
const SITE_BASE_URL = process.env.SITE_BASE_URL || 'https://www.cjmgroup.com';

const escapeHtml = (value = '') =>
  value
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const readBaseTemplate = async () => {
  try {
    return await readFile(BASE_TEMPLATE, 'utf8');
  } catch (error) {
    console.error('No se encontró dist/index.html. Ejecuta primero "npm run build:spa".');
    throw error;
  }
};

const extractRoutes = async () => {
  const fileContent = await readFile(APP_FILE, 'utf8');
  const routeRegex = /<Route[^>]*path=["']([^"']+)["'][^>]*>/g;
  const matches = new Set();
  let match;
  while ((match = routeRegex.exec(fileContent)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
};

const loadDynamicData = async () => {
  const newsModule = await import(
    pathToFileURL(path.join(__dirname, '..', 'src', 'data', 'newsData.js'))
  );
  return {
    blogPosts: newsModule.newsData || [],
  };
};

const baseMeta = {
  '/': {
    title: 'CJM Group | Textiles contract y decorativos con innovación',
    description:
      'Soluciones textiles premium para hospitality, retail y residencial: telas ignífugas, sostenibles y listas para proyectos exigentes.',
    type: 'home',
  },
  '/about': {
    title: 'Sobre CJM Group | Diseño textil y fabricación propia',
    description: 'Equipo experto en telas contract con certificaciones, soporte técnico y logística global.',
    type: 'standard',
  },
  '/products': {
    title: 'Catálogo CJM Group | Telas contract y decorativas',
    description: 'Explora colecciones Harbour, Arena, Flamenco y Bassari con fichas técnicas y muestras.',
    type: 'listing',
  },
  '/media': {
    title: 'Media | Vídeos y recursos de CJM Group',
    description: 'Recursos audiovisuales y catálogos para especificadores y clientes.',
    type: 'standard',
  },
  '/harbourHome': {
    title: 'Colección Harbour | Exteriores resistentes y elegantes',
    description: 'Tejidos técnicos con resistencia UV, hidrofugado y paletas inspiradas en la costa.',
    type: 'product',
  },
  '/cjmHome': {
    title: 'Colección CJM | Telas decorativas para contract',
    description: 'Tapicerías y cortinas certificadas para proyectos exigentes.',
    type: 'product',
  },
  '/arenaHome': {
    title: 'Colección Arena | Textiles de alto tránsito',
    description: 'Diseños neutros y durables para hospitality, retail y oficinas.',
    type: 'product',
  },
  '/flamencoHome': {
    title: 'Colección Flamenco | Color y ritmo en telas contract',
    description: 'Paletas vivas con rendimiento profesional y fácil mantenimiento.',
    type: 'product',
  },
  '/bassariHome': {
    title: 'Colección Bassari | Telas premium con acentos artesanales',
    description: 'Diseños sofisticados con texturas y tonos cálidos para contract.',
    type: 'product',
  },
  '/contact': {
    title: 'Contacto | CJM Group',
    description: 'Solicita muestrarios, fichas técnicas o asesoría para tu proyecto.',
    type: 'standard',
  },
  '/Contract': {
    title: 'Servicios Contract | CJM Group',
    description: 'Soporte integral para proyectos contract desde el diseño hasta la instalación.',
    type: 'standard',
  },
  '/usages': {
    title: 'Usos y aplicaciones | CJM Group',
    description: 'Inspiración y casos de uso de telas técnicas para diferentes sectores.',
    type: 'standard',
  },
  '/BlogHome/:newsId': {
    title: 'Blog CJM Group',
    description: 'Artículos sobre innovación textil, sostenibilidad y tendencias.',
    type: 'blogIndex',
  },
};

const getDefaultMeta = (routePath) => ({
  title: `CJM Group | ${routePath.replace(/\//g, ' ').trim() || 'Ruta'}`,
  description: 'Página prerenderizada para mejorar indexación y experiencia en buscadores.',
  type: 'standard',
});

const getRouteMeta = (routePath, dynamicData) => {
  if (routePath === '/BlogHome/:newsId') return baseMeta[routePath];
  return baseMeta[routePath] || getDefaultMeta(routePath);
};

const buildCanonical = (routePath) => `${SITE_BASE_URL}${routePath === '/' ? '/' : routePath}`;

const buildSchemas = (route, dynamicData) => {
  const schemas = [];

  if (route.type === 'home') {
    schemas.push(
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CJM Group',
        url: SITE_BASE_URL,
        logo:
          'https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logo%20CJM.png',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CJM Group',
        url: SITE_BASE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_BASE_URL}/buscar?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }
    );
  }

  if (route.type === 'blogPost' && route.blogPost) {
    schemas.push(
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: route.blogPost.title,
        description: route.blogPost.content.slice(0, 160),
        datePublished: route.blogPost.date,
        dateModified: route.blogPost.date,
        author: {
          '@type': 'Organization',
          name: 'CJM Group',
        },
        mainEntityOfPage: buildCanonical(route.path),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Blog',
            item: `${SITE_BASE_URL}/BlogHome/${route.blogPost.id}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: route.blogPost.title,
            item: buildCanonical(route.path),
          },
        ],
      }
    );
  }

  if (route.type === 'product') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: route.title.replace(' |', ''),
      description: route.description,
      brand: {
        '@type': 'Brand',
        name: 'CJM Group',
      },
    });
  }

  if (schemas.length === 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: route.title,
      description: route.description,
      url: buildCanonical(route.path),
    });
  }

  return schemas;
};

const renderContent = (route) => {
  if (route.type === 'home') {
    return `<section><h1>Colecciones textiles contract listas para especificar</h1><p>Prerender estático con head optimizado. La SPA sigue funcionando tras cargar los assets.</p><a href="/products">Ver colecciones</a></section>`;
  }
  if (route.type === 'blogPost' && route.blogPost) {
    return `<article><h1>${escapeHtml(route.blogPost.title)}</h1><p>${escapeHtml(
      route.blogPost.content.slice(0, 280)
    )}</p><p>Publicado: ${escapeHtml(route.blogPost.date)}</p></article>`;
  }
  return `<section><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.description)}</p></section>`;
};

const injectHeadAndContent = (baseHtml, route, schemas) => {
  let html = baseHtml;

  html = html.replace(/<html[^>]*>/i, '<html lang="es">');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);

  const replaceOrInsert = (pattern, tag) => {
    if (pattern.test(html)) {
      html = html.replace(pattern, tag);
    } else {
      html = html.replace('</head>', `${tag}\n</head>`);
    }
  };

  replaceOrInsert(
    /<meta[^>]+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(route.description)}">`
  );
  replaceOrInsert(
    /<meta[^>]+name=["']robots["'][^>]*>/i,
    `<meta name="robots" content="${route.robots || 'index,follow'}">`
  );
  replaceOrInsert(
    /<link[^>]+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${buildCanonical(route.path)}">`
  );
  replaceOrInsert(
    /<link[^>]+hreflang=["']es["'][^>]*>/i,
    `<link rel="alternate" href="${buildCanonical(route.path)}" hreflang="es">`
  );

  const schemaTag = `<script type="application/ld+json">${JSON.stringify(schemas, null, 2)}</script>`;
  html = html.replace('</head>', `${schemaTag}\n</head>`);

  html = html.replace('<div id="root"></div>', `<div id="root">${renderContent(route)}</div>`);

  return html;
};

const buildRouteList = async () => {
  const rawRoutes = await extractRoutes();
  const dynamicData = await loadDynamicData();
  const routes = [];

  rawRoutes.forEach((routePath) => {
    if (routePath === '/BlogHome/:newsId') {
      dynamicData.blogPosts.forEach((post) => {
        const pathWithId = routePath.replace(':newsId', post.id.toString());
        routes.push({
          path: pathWithId,
          title: `${post.title} | Blog CJM Group`,
          description: post.content.slice(0, 160),
          robots: 'index,follow',
          type: 'blogPost',
          blogPost: post,
        });
      });

      // Include index for blog list to avoid 404 on listing anchor
      routes.push({
        path: '/BlogHome',
        title: 'Blog CJM Group | Tendencias y guías',
        description: baseMeta['/BlogHome/:newsId'].description,
        robots: 'index,follow',
        type: 'standard',
      });
      return;
    }

    const meta = getRouteMeta(routePath, dynamicData);
    routes.push({
      path: routePath,
      ...meta,
      robots: 'index,follow',
    });
  });

  // evitar rutas que no se pueden prerenderizar por falta de datos
  return routes.filter((route) => !route.path.includes('/:'));
};

const saveHtml = async (routePath, html) => {
  const cleaned = routePath === '/' ? [] : routePath.replace(/^\//, '').split('/');
  const filePath = path.join(OUTPUT_DIR, ...cleaned, 'index.html');
  const dirName = path.dirname(filePath);
  await mkdir(dirName, { recursive: true });
  await writeFile(filePath, html, 'utf8');
  return filePath;
};

const generateSitemap = async (routes) => {
  const urls = routes
    .filter((route) => !(route.robots || '').startsWith('noindex'))
    .map(
      (route) => `  <url>\n    <loc>${buildCanonical(route.path)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route.path === '/' ? '1.0' : '0.7'
        }</priority>\n  </url>`
    );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
    '\n'
  )}\n</urlset>`;
  await writeFile(path.join(OUTPUT_DIR, 'sitemap.xml'), xml, 'utf8');
};

const generateRobots = async () => {
  const robotsContent = `User-agent: *\nAllow: /\nSitemap: ${SITE_BASE_URL}/sitemap.xml\n`;
  await writeFile(path.join(OUTPUT_DIR, 'robots.txt'), robotsContent, 'utf8');
};

const writeManifest = async (entries) => {
  const manifest = entries.map(({ path: routePath, title, description, filePath }) => ({
    path: routePath,
    title,
    description,
    filePath,
  }));
  await writeFile(
    path.join(OUTPUT_DIR, 'prerender-manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
};

const main = async () => {
  const baseHtml = await readBaseTemplate();
  const routes = await buildRouteList();
  const outputs = [];

  for (const route of routes) {
    const schemas = buildSchemas(route, {});
    const html = injectHeadAndContent(baseHtml, route, schemas);
    const filePath = await saveHtml(route.path, html);
    outputs.push({ ...route, filePath });
  }

  await generateSitemap(routes);
  await generateRobots();
  await writeManifest(outputs);
  console.log(`Prerender generado para ${routes.length} rutas en ${OUTPUT_DIR}.`);
};

try {
  await access(path.join(__dirname, '..', OUTPUT_DIR));
  await main();
} catch (error) {
  console.error('Error durante el prerender:', error);
  process.exit(1);
}
