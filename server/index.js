import express, { json } from 'express';
import { urlencoded } from 'express'; // Asegúrate de importar urlencoded
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
app.use(express.urlencoded({ extended: true })); // Por si envías datos como formularios

// Sirve archivos estáticos desde el directorio 'web'
app.use(express.static(join(__dirname, '../src')));

// Redirige todas las rutas al archivo index.html para que React maneje las rutas
app.get('/*', function (req, res) {
  res.sendFile(join(__dirname, '../src', 'index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.use('/api/products', createProductRouter({ pool }));
app.use('/api/images', createImagenRouter({ pool })); // Nuevas rutas para las imágenes

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Serving static files from ${join(__dirname, 'web')}`);
});

export default app;
