export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') return '';

  // 1. Remove control characters and OS-reserved characters
  let sanitized = filename
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Control characters
    .replace(/[\/\\?%*:|"<>\s]/g, '_') // Reserved chars and whitespace to underscores
    .replace(/^\.+|\.+$/g, ''); // Leading and trailing periods

  // 2. Prevent Windows reserved device names (case-insensitive)
  const windowsReserved = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i;
  if (windowsReserved.test(sanitized)) {
    sanitized = 'file_' + sanitized;
  }

  // 3. Truncate to maximum filesystem length (255 characters)
  return sanitized.substring(0, 255) || 'unnamed_file';
}
