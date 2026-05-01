import { fastifyCors } from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import scalarUI from '@scalar/fastify-api-reference';
import { fastify } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { connectToDatabase } from '@/db/index.ts';
import { env } from '@/env.ts';
import {
  INTERNAL_SERVER_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '@/errors/error-responses.ts';
import { createLinkRoute } from './app/controllers/create-link.ts';
import { deleteLinkRoute } from './app/controllers/delete-link.ts';
import { exportLinksRoute } from './app/controllers/export-links.ts';
import { getLinkRoute } from './app/controllers/get-link.ts';
import { getOriginalUrlRoute } from './app/controllers/get-original-url.ts';
import { listLinksRoute } from './app/controllers/list-links.ts';
import { AppError } from './errors/AppError.ts';
import { logger } from './infra/logger.ts';

const server = fastify();

server.addHook('preHandler', async (request, _reply) => {
  logger.trace(`[${request.method}] ${request.url}`);
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const validationErrors = error.validation.map((err) => {
      const field =
        err.instancePath?.replace(/^\//, '').replace(/\//g, '.') ||
        err.params?.missingProperty ||
        'unknown';

      return {
        field,
        message: err.message,
        code: err.keyword,
      };
    });

    return reply.status(400).send({
      message: VALIDATION_ERROR_MESSAGE,
      errors: validationErrors,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
      code: error.code,
    });
  }

  logger.error(
    {
      requestId: request.id,
      method: request.method,
      url: request.url,
      params: request.params,
      query: request.query,
      err: error,
    },
    INTERNAL_SERVER_ERROR_MESSAGE
  );

  return reply.status(500).send({ message: INTERNAL_SERVER_ERROR_MESSAGE });
});

server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'brev.ly API',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

server.register(scalarUI, {
  routePrefix: '/docs',
  configuration: {
    layout: 'modern',
  },
});

server.get('/openapi.json', () => server.swagger());

server.register(createLinkRoute);
server.register(listLinksRoute);
server.register(getLinkRoute);
server.register(deleteLinkRoute);
server.register(getOriginalUrlRoute);
server.register(exportLinksRoute);

await connectToDatabase().then(() => {
  logger.info('✅ Database connection established successfully');
});

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  logger.info('🚀 Server running!');
});
