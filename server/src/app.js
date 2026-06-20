import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import initFirebaseAdmin from './config/firebaseAdmin.js';
import { handleWebhook } from './controllers/payment.controller.js';

const app = express();

initFirebaseAdmin();

app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});

app.use('/api/auth', authLimiter);
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;
