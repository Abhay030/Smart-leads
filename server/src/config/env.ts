import dotenv from 'dotenv';

dotenv.config();

// ─── Env Shape ────────────────────────────────────────────────────────────────

interface EnvConfig {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateEnv(): EnvConfig {
  const required: string[] = ['MONGO_URI', 'JWT_SECRET'];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`[Config] Missing required environment variable: ${key}`);
    }
  }

  const rawNodeEnv = process.env['NODE_ENV'] ?? 'development';
  const validNodeEnvs = ['development', 'production', 'test'] as const;

  if (!validNodeEnvs.includes(rawNodeEnv as (typeof validNodeEnvs)[number])) {
    throw new Error(`[Config] Invalid NODE_ENV: "${rawNodeEnv}". Must be one of: ${validNodeEnvs.join(', ')}`);
  }

  const rawPort = process.env['PORT'] ?? '5000';
  const port = parseInt(rawPort, 10);

  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`[Config] Invalid PORT: "${rawPort}". Must be a number between 1 and 65535.`);
  }

  return {
    PORT: port,
    MONGO_URI: process.env['MONGO_URI'] as string,
    JWT_SECRET: process.env['JWT_SECRET'] as string,
    NODE_ENV: rawNodeEnv as EnvConfig['NODE_ENV'],
  };
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const env = validateEnv();
