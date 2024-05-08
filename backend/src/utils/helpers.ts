// Utility function to format file size
export function formatFileSize(
  bytes: number,
  decimalPoint: number = 2
): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024,
    dm = decimalPoint <= 0 ? 0 : decimalPoint,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
