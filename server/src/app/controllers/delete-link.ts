import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  LINK_NOT_FOUND_ERROR_CODE,
  LINK_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '@/errors/error-responses.ts';
import { deleteLinkService } from '../services/delete-link.ts';

export const deleteLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/links/:id',
    {
      schema: {
        summary: 'Delete a link',
        tags: ['Links'],
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          204: z.null(),
          400: z.object({
            message: z.literal(VALIDATION_ERROR_MESSAGE),
            errors: z.array(z.unknown()),
          }),
          404: z.object({
            message: z.literal(LINK_NOT_FOUND_ERROR_MESSAGE),
            code: z.literal(LINK_NOT_FOUND_ERROR_CODE),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await deleteLinkService({ id });

      return reply.status(204).send(null);
    }
  );
};
