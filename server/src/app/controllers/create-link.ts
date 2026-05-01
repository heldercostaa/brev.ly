import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  SHORT_CODE_EXISTS_ERROR_CODE,
  SHORT_CODE_EXISTS_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '@/errors/error-responses.ts';
import { shortCodeSchema } from '../schemas/link-schemas.ts';
import { createLinkService } from '../services/create-link.ts';

export const createLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/links',
    {
      schema: {
        summary: 'Create a new link',
        tags: ['Links'],
        body: z.object({
          shortCode: shortCodeSchema,
          originalUrl: z.url(),
        }),
        response: {
          201: z.object({
            id: z.string(),
            shortCode: z.string(),
            originalUrl: z.string(),
            createdAt: z.iso.datetime(),
          }),
          400: z.object({
            message: z.literal(VALIDATION_ERROR_MESSAGE),
            errors: z.array(z.unknown()),
          }),
          409: z.object({
            message: z.literal(SHORT_CODE_EXISTS_ERROR_MESSAGE),
            code: z.literal(SHORT_CODE_EXISTS_ERROR_CODE),
          }),
        },
      },
    },
    async (request, reply) => {
      const { shortCode, originalUrl } = request.body;

      const link = await createLinkService({ shortCode, originalUrl });

      return reply.status(201).send({ ...link, createdAt: link.createdAt.toISOString() });
    }
  );
};
