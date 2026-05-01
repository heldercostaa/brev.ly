import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

export const links = pgTable(
  'links',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    originalUrl: text('original_url').notNull(),
    shortCode: text('short_code').notNull().unique(),
    accessCount: integer('access_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('short_code_idx').on(table.shortCode),
    index('created_at_idx').on(table.createdAt),
    check('short_code_check', sql`${table.shortCode} ~ '^[a-zA-Z0-9_-]+$'`),
  ]
);
