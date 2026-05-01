import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  LINK_NOT_FOUND_ERROR_CODE,
  LINK_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '@/errors/error-responses.ts';
import { shortCodeSchema } from '../schemas/link-schemas.ts';
import { getLinkService } from '../services/get-link.ts';

export const getLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/links/:shortCode',
    {
      schema: {
        summary: 'Get original URL by short code',
        tags: ['Links'],
        params: z.object({
          shortCode: shortCodeSchema,
        }),
        response: {
          200: z.object({
            originalUrl: z.string(),
          }),
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
      const { shortCode } = request.params;

      const { originalUrl } = await getLinkService({ shortCode });

      return reply.status(200).send({ originalUrl });
    }
  );
};
