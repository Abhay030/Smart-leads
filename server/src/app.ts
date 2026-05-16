import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { seedDemoWorkspace } from './utils/seedDemo';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';

// ─── App Setup ────────────────────────────────────────────────────────────────

const app: Application = express();

// Security headers
app.use(helmet());

// CORS — restrict in production
app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? process.env['CLIENT_URL'] ?? false : '*',
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (dev only)
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────

// 404 — must come after all valid routes
app.use(notFound);

// Global error handler — must be last middleware (4-arg signature)
app.use(errorHandler);

// ─── Server Bootstrap ─────────────────────────────────────────────────────────

async function start(): Promise<void> {
  await connectDB();
  
  if (env.NODE_ENV !== 'test') {
    await seedDemoWorkspace();
  }

  const server = app.listen(env.PORT, () => {
    console.log(`\n🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    console.log(`   Health: http://localhost:${env.PORT}/api/health\n`);
  });

  // ─── Graceful Shutdown ──────────────────────────────────────────────────────

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[Server] ${signal} received — shutting down gracefully...`);

    server.close(async () => {
      await disconnectDB();
      console.log('[Server] Closed. Goodbye.');
      process.exit(0);
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      console.error('[Server] Shutdown timeout — forcing exit');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
  process.on('SIGINT', () => { void shutdown('SIGINT'); });

  // Catch unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('[Server] Unhandled rejection:', reason);
    void shutdown('unhandledRejection');
  });
}

start().catch((err: unknown) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});

export default app;
