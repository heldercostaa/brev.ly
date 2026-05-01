import { z } from 'zod';

const envSchema = z.object({
  // Backend
  VITE_BACKEND_URL: z.url(),
});

export const env = envSchema.parse(import.meta.env);
