import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/env.ts';
import { logger } from '@/infra/logger.ts';
import { schema } from './schemas/index.ts';

export const pg = postgres(env.DB_URL);
export const db = drizzle(pg, { schema });

export async function connectToDatabase() {
  try {
    await pg`select 1`;
  } catch (error) {
    logger.error({ err: error }, '❌ Database connection failed');
    process.exit(1);
  }
}
