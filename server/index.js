import express, { json, urlencoded } from 'express';
import { createProductRouter } from './routes/productos.js';
import { createImagenRouter } from './routes/imagenes.js';
import { corsMiddleware } from './middlewares/cors.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

// Obtener la ruta de archivo y directorio actual (__dirname y __filename)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inicialización del servidor Express
const app = express();
app.use(json());
app.use(corsMiddleware());
app.use(urlencoded({ extended: true })); // Manejar formularios

// Desactivar cabecera 'x-powered-by'
app.disable('x-powered-by');

// Servir archivos estáticos desde el directorio 'web'
app.use(express.static(join(__dirname, 'web')));

// Configuración de las rutas para productos e imágenes
app.use('/api/products', createProductRouter());
app.use('/api/images', createImagenRouter());

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Configuración del puerto
const PORT = process.env.PORT || 1234;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Serving static files from ${join(__dirname, 'web')}`);
});

export default app;
