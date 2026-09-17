import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import claimRoutes from './routes/claim.routes.js';
import referenceRoutes from './routes/references.routes.js';
import { initDb } from './repositories/db.js';
import { seedDemo } from './scripts/seed-demo.js';

initDb();

if (process.env.SEED_DEMO === 'true') {
  await seedDemo();
}

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api', referenceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});