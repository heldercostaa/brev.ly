import { DrizzleQueryError } from 'drizzle-orm';
import postgres from 'postgres';
import z from 'zod';
import { db } from '@/db/index.ts';
import { schema } from '@/db/schemas/index.ts';
import { ShortCodeAlreadyExists } from './errors/ShortCodeAlreadyExists.ts';

const createLinkParams = z.object({
  shortCode: z.string(),
  originalUrl: z.string(),
});

type CreateLinkParams = z.input<typeof createLinkParams>;

const UNIQUE_VIOLATION_CODE = '23505';

export async function createLinkService(params: CreateLinkParams) {
  const { shortCode, originalUrl } = createLinkParams.parse(params);

  try {
    const [link] = await db
      .insert(schema.links)
      .values({
        shortCode,
        originalUrl,
      })
      .returning({
        id: schema.links.id,
        shortCode: schema.links.shortCode,
        originalUrl: schema.links.originalUrl,
        createdAt: schema.links.createdAt,
      });

    return link;
  } catch (err: unknown) {
    if (
      err instanceof DrizzleQueryError &&
      err.cause instanceof postgres.PostgresError &&
      err.cause.code === UNIQUE_VIOLATION_CODE
    ) {
      throw new ShortCodeAlreadyExists();
    }

    throw err;
  }
}
