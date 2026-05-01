import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '@/db/index.ts';
import { schema } from '@/db/schemas/index.ts';
import { shortCodeSchema } from '../schemas/link-schemas.ts';
import { LinkNotFound } from './errors/LinkNotFound.ts';

const getLinkParams = z.object({
  shortCode: shortCodeSchema,
});

type GetLinkParams = z.input<typeof getLinkParams>;

export async function getLinkService(params: GetLinkParams) {
  const { shortCode } = getLinkParams.parse(params);

  const [link] = await db
    .select({
      originalUrl: schema.links.originalUrl,
    })
    .from(schema.links)
    .where(eq(schema.links.shortCode, shortCode))
    .limit(1);

  if (!link) {
    throw new LinkNotFound();
  }

  return link;
}
