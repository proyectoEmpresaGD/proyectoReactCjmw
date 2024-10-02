import express, { json, urlencoded } from 'express';
import { createProductRouter } from './routes/productos.js';
import { createImagenRouter } from './routes/imagenes.js';
import { corsMiddleware } from './middlewares/cors.js'; // Importar el middleware CORS personalizado
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config'; // Importar variables de entorno desde .env

// Obtener la ruta de archivo y directorio actual (__dirname y __filename)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inicialización del servidor Express
const app = express();
app.use(json()); // Middleware para manejar JSON
app.use(corsMiddleware()); // Aplicar el middleware de CORS personalizado
app.use(urlencoded({ extended: true })); // Middleware para manejar formularios codificados

// Desactivar cabecera 'x-powered-by' por seguridad
app.disable('x-powered-by');

// Servir archivos estáticos desde el directorio 'web'
app.use(express.static(join(__dirname, 'web')));

// Rutas para productos e imágenes
app.use('/api/products', createProductRouter()); // Rutas para productos
app.use('/api/images', createImagenRouter());    // Rutas para imágenes

// Middleware para manejar errores generales
app.use((err, req, res, next) => {
  console.error(err.stack); // Imprimir el stack de errores
  res.status(500).send('Something broke!'); // Responder con error 500
});

// Configuración del puerto
const PORT = process.env.PORT || 1234;

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Serving static files from ${join(__dirname, 'web')}`);
});

export default app;
