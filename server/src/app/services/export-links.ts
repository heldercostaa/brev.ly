import { PassThrough, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { stringify } from 'csv-stringify';
import { desc } from 'drizzle-orm';
import { db, pg } from '@/db/index.ts';
import { schema } from '@/db/schemas/index.ts';
import { uploadFile } from '@/storage/upload-file.ts';

export async function exportLinksService() {
  const { sql, params: queryParams } = db
    .select({
      id: schema.links.id,
      shortCode: schema.links.shortCode,
      originalUrl: schema.links.originalUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .orderBy(desc(schema.links.createdAt))
    .toSQL();

  const cursor = pg.unsafe(sql, queryParams as string[]).cursor(2);

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'short_code', header: 'Short Code' },
      { key: 'original_url', header: 'Original URL' },
      { key: 'access_count', header: 'Access Count' },
      { key: 'created_at', header: 'Created At' },
    ],
  });

  const uploadToStorageStream = new PassThrough();

  const convertToCsvPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], _encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk);
        }
        callback();
      },
    }),
    csv,
    uploadToStorageStream
  );

  const uploadToStorage = uploadFile({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream,
  });

  const [{ url }] = await Promise.all([uploadToStorage, convertToCsvPipeline]);

  await convertToCsvPipeline;

  return { reportUrl: url };
}
