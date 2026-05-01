import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { listLinksService } from '../services/list-links.ts';

export const listLinksRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/links',
    {
      schema: {
        summary: 'List all links',
        tags: ['Links'],
        querystring: z.object({
          page: z.coerce.number().int().positive().default(1),
          pageSize: z.coerce.number().int().positive().default(10),
        }),
        response: {
          200: z.object({
            total: z.number().int(),
            page: z.number().int(),
            pageSize: z.number().int(),
            data: z.array(
              z.object({
                id: z.string(),
                shortCode: z.string(),
                originalUrl: z.string(),
                accessCount: z.number().int(),
                createdAt: z.iso.datetime(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, pageSize } = request.query;
      const { data, total } = await listLinksService({ page, pageSize });

      return reply.status(200).send({
        total,
        page,
        pageSize,
        data: data.map((link) => ({
          ...link,
          createdAt: link.createdAt.toISOString(),
        })),
      });
    }
  );
};
