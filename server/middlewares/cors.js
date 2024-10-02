import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'https://movies.com',
  'https://midu.dev',
  'http://localhost:5173',
  'https://translate.google.com',
  'https://proyecto-react-cjmw-neon.vercel.app',
  'https://cjmw-worldwide.vercel.app',
  'https://cjmw.eu',
  'https://www.cjmw.eu',
  'https://bassari.eu',
  'https://www.bassari.eu'
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (!origin || acceptedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,  // Permitir cookies si es necesario
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Permitir estos encabezados
  preflightContinue: false, // Detener el manejo preflight aquí
  optionsSuccessStatus: 204, // Estado de respuesta exitoso para solicitudes preflight
});
