import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  LINK_NOT_FOUND_ERROR_CODE,
  LINK_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '@/errors/error-responses.ts';
import { shortCodeSchema } from '../schemas/link-schemas.ts';
import { getOriginalUrlService } from '../services/get-original-url.ts';

export const getOriginalUrlRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/:shortCode',
    {
      schema: {
        summary: 'Open a shortened URL',
        tags: ['Links'],
        params: z.object({
          shortCode: shortCodeSchema,
        }),
        response: {
          302: z.null(),
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

      const { originalUrl } = await getOriginalUrlService({ shortCode });

      return reply.redirect(originalUrl);
    }
  );
};
