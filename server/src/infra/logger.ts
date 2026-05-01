import pino from 'pino';
import { env } from '../env.ts';

const level = env.LOG_LEVEL;

export const logger = pino({
  level,
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level,
        options: {
          levelFirst: true,
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'yyyy-mm-dd HH:MM:ss Z',
        },
      },
    ],
  },
});
