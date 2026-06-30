import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILES } from "../constants/order";

export function isAllowedFile(file) {
  const name = file.name.toLowerCase();
  const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
  const hasValidMime =
    ALLOWED_MIME_TYPES.includes(file.type) || file.type === "";
  return hasValidExt && (hasValidMime || hasValidExt);
}

export function validateFileCount(currentCount, adding = 1) {
  if (currentCount + adding > MAX_FILES) {
    return `Maximum ${MAX_FILES} files allowed.`;
  }
  return null;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
