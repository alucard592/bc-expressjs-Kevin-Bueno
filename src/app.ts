import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

import authRouter from './routes/auth.routes';
import donanteRouter from './routes/donante.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { globalLimiter, corsOptions } from './config/security';

export const app = express();

// Security layers — order matters
app.use(helmet());
app.use(globalLimiter);
app.use(cors(corsOptions)); // cors middleware handles OPTIONS preflight automatically in Express

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sanitize inputs AFTER parsing, BEFORE routes (OWASP Injection Protection compatible with Express 5)
app.use((req, _res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// Health check endpoint
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de autenticación
app.use('/api/v1/auth', authRouter);

// Rutas del recurso principal: Donantes (Banco de Sangre)
app.use('/api/v1/donantes', donanteRouter);

// Middlewares de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);
