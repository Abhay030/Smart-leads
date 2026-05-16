import mongoose from 'mongoose';
import { env } from './env';

// ─── Connection State ─────────────────────────────────────────────────────────

let isConnected = false;

// ─── Connect ──────────────────────────────────────────────────────────────────

export async function connectDB(): Promise<void> {
  if (isConnected) {
    console.log('[DB] Reusing existing MongoDB connection');
    return;
  }

  try {
    const connection = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast if mongo is unreachable
    });

    isConnected = true;
    console.log(`[DB] MongoDB connected → ${connection.connection.host}`);

    // Attach lifecycle listeners once
    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('error', (err: Error) => {
      console.error('[DB] MongoDB error:', err.message);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[DB] Connection failed: ${message}`);
    process.exit(1);
  }
}

// ─── Disconnect ───────────────────────────────────────────────────────────────

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[DB] MongoDB disconnected cleanly');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[DB] Error during disconnect: ${message}`);
  }
}

// ─── Status ───────────────────────────────────────────────────────────────────

export function getDBStatus(): string {
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return stateMap[mongoose.connection.readyState] ?? 'unknown';
}
