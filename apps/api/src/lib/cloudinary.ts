/**
 * Cloudinary delivery URL transforms for outbound image URLs.
 * All Cloudinary image URLs must include format optimization (f_auto),
 * quality adjustment (q_auto), and explicit dimensions with crop mode.
 */

const CLOUDINARY_UPLOAD_PREFIX = 'res.cloudinary.com/';
const UPLOAD_PATH = '/image/upload/';
const TRANSFORMS = 'f_auto,q_auto,w_800,h_600,c_fill';

/**
 * Applies standard delivery transforms to a Cloudinary image URL.
 * Inserts f_auto, q_auto, and explicit dimensions (w_800, h_600, c_fill).
 * Non-Cloudinary URLs are returned unchanged.
 */
export const toOptimizedImageUrl = (url: string | null | undefined): string | undefined => {
  if (url == null || url === '') return undefined;
  if (!url.includes(CLOUDINARY_UPLOAD_PREFIX) || !url.includes(UPLOAD_PATH)) return url;
  const insert = `${UPLOAD_PATH}${TRANSFORMS}/`;
  const afterUpload = url.indexOf(UPLOAD_PATH) + UPLOAD_PATH.length;
  const alreadyHasTransforms = url.slice(afterUpload, afterUpload + 20).includes('f_auto');
  if (alreadyHasTransforms) return url;
  return url.replace(UPLOAD_PATH, insert);
};
