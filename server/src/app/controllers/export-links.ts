import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { exportLinksService } from '../services/export-links.ts';

export const exportLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/links/export',
    {
      schema: {
        summary: 'Export links',
        tags: ['Links'],
        response: {
          200: z.object({
            reportUrl: z.string(),
          }),
        },
      },
    },
    async (_request, reply) => {
      const { reportUrl } = await exportLinksService();

      return reply.status(200).send({ reportUrl });
    }
  );
};
