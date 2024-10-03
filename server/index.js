import express, { json, urlencoded } from 'express';
import { createProductRouter } from './routes/productos.js';
import { createImagenRouter } from './routes/imagenes.js';
import { corsMiddleware } from './middlewares/cors.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));

// Sirve archivos estáticos desde el directorio 'web'
app.use(express.static(join(__dirname, 'web')));

// Usar routers para productos e imágenes
app.use('/api/products', createProductRouter({ pool }));
app.use('/api/images', createImagenRouter({ pool }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ error: err.message });
});


// Configuración de caché para Vercel Edge Caching
app.use((req, res, next) => {
  // Caching para respuestas GET
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
