import { eq, sql } from 'drizzle-orm';
import z from 'zod';
import { db } from '@/db/index.ts';
import { schema } from '@/db/schemas/index.ts';
import { shortCodeSchema } from '../schemas/link-schemas.ts';
import { LinkNotFound } from './errors/LinkNotFound.ts';

const getOriginalUrlParams = z.object({
  shortCode: shortCodeSchema,
});

type GetOriginalUrlParams = z.input<typeof getOriginalUrlParams>;

export async function getOriginalUrlService(params: GetOriginalUrlParams) {
  const { shortCode } = getOriginalUrlParams.parse(params);

  const [link] = await db
    .update(schema.links)
    .set({
      accessCount: sql`${schema.links.accessCount} + 1`,
    })
    .where(eq(schema.links.shortCode, shortCode))
    .returning({
      originalUrl: schema.links.originalUrl,
    });

  if (!link) {
    throw new LinkNotFound();
  }

  return link;
}
