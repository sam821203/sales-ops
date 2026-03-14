import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { Readable } from 'node:stream';
import { fileTypeFromBuffer } from 'file-type';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/index.js';

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return null;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

function uploadBufferToCloudinary(buffer: Buffer): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result || !result.secure_url) {
          reject(new Error('Cloudinary returned no URL'));
          return;
        }
        resolve({ secure_url: result.secure_url });
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function uploadHandler(c: Context) {
  const config = configureCloudinary();
  if (!config) {
    throw new HTTPException(503, {
      message: 'Upload not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.',
    });
  }

  const body = await c.req.parseBody();
  const file = body['file'] ?? body['image'];
  if (!file || typeof file === 'string') {
    throw new HTTPException(400, { message: 'Missing or invalid file. Use form field "file" or "image".' });
  }

  const blob = file as Blob;
  if (blob.size > MAX_SIZE_BYTES) {
    throw new HTTPException(400, { message: `File too large. Max size: ${MAX_SIZE_BYTES / 1024 / 1024}MB` });
  }

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const detected = await fileTypeFromBuffer(buffer);
  if (!detected) {
    throw new HTTPException(400, { message: 'Invalid or unsupported file type' });
  }
  if (!ALLOWED_TYPES.has(detected.mime)) {
    throw new HTTPException(400, {
      message: `Invalid file type. Allowed: ${[...ALLOWED_TYPES].join(', ')}`,
    });
  }

  try {
    const { secure_url } = await uploadBufferToCloudinary(buffer);
    return c.json({ url: secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw new HTTPException(502, { message: 'Upload failed' });
  }
}
