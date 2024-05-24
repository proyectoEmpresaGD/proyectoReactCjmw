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
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');

// Sirve archivos estáticos desde el directorio 'web'
app.use(express.static(join(__dirname, 'web')));

app.use('/api/products', createProductRouter({ pool }));

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Serving static files from ${join(__dirname, 'web')}`);
});

export const createApp = () => app;

if (import.meta.url === `file://${process.argv[1]}`) {
  createApp();
}
