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

export function sizeToBytes(sizeStr: string): number {
  const units: { [key: string]: number } = {
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };
  const pattern = /^(\d+(?:\.\d+)?)\s*(KB|MB|GB)$/i;
  const match = sizeStr.match(pattern);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  if (unit in units) {
    return value * units[unit];
  }
  return 0;
}
