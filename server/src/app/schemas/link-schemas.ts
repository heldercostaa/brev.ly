import z from 'zod';

export const shortCodeSchema = z.string().regex(/^[a-zA-Z0-9_-]+$/);
