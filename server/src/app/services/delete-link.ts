import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '@/db/index.ts';
import { schema } from '@/db/schemas/index.ts';
import { LinkNotFound } from './errors/LinkNotFound.ts';

const deleteLinkParams = z.object({
  id: z.uuid(),
});

type DeleteLinkParams = z.input<typeof deleteLinkParams>;

export async function deleteLinkService(params: DeleteLinkParams) {
  const { id } = deleteLinkParams.parse(params);

  const [deletedLink] = await db
    .delete(schema.links)
    .where(eq(schema.links.id, id))
    .returning({ id: schema.links.id });

  if (!deletedLink) {
    throw new LinkNotFound();
  }
}
