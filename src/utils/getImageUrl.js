/**
 * Returns a fully-qualified image URL.
 *
 * - If `path` is already an absolute URL (S3, CDN, http/https) → return as-is.
 * - If `path` is a relative local path (uploads/...) → prepend the API base URL.
 * - If `path` is falsy → return null (caller can fall back to a default image).
 *
 * @param {string|null|undefined} path - The image path/URL stored in the DB
 * @returns {string|null}
 */
export function getImageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = (process.env.REACT_APP_API_URL_FOR_IMAGE || "").replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
