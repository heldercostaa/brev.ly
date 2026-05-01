import { count, desc } from 'drizzle-orm';
import z from 'zod';
import { db } from '@/db/index.ts';
import { schema } from '@/db/schemas/index.ts';

const listLinksParams = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

type ListLinksParams = z.input<typeof listLinksParams>;

export async function listLinksService(params: ListLinksParams) {
  const { page, pageSize } = listLinksParams.parse(params);
  const offset = (page - 1) * pageSize;

  const [{ total }] = await db.select({ total: count() }).from(schema.links);

  const links = await db
    .select({
      id: schema.links.id,
      shortCode: schema.links.shortCode,
      originalUrl: schema.links.originalUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .orderBy(desc(schema.links.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    total,
    page,
    pageSize,
    data: links,
  };
}
