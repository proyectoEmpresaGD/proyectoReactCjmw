import express, { json } from 'express';
import { createProductRouter } from './routes/productos.js';
import { corsMiddleware } from './middlewares/cors.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,  // Asegúrate de que el puerto está correcto
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === "production"  // Solo rechaza conexiones no autorizadas en producción
  }
});

export const createApp = () => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable('x-powered-by');

  app.use(express.static(join(__dirname, 'web')));

  // Asegúrate de pasar el pool de conexiones a tu router
  app.use('/products', createProductRouter({ pool }));

  const PORT = process.env.PORT || 1234;
  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
    console.log(`Serving static files from ${join(__dirname, 'web')}`);
  });
};

if (import.meta.url === `file://${process.argv[1]}`) {
  createApp();
}
