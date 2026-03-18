import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * Convert UTC string to relative time (e.g. 2 hours ago)
 */
export function getRelativeTime(dateString: string) {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: ja,
  });
}

/**
 * Format date string for display
 */
export function displayDate(
  dateString: string,
  pattern: string = "yyyy/MM/dd HH:mm",
) {
  return format(new Date(dateString), pattern, { locale: ja });
}

/**
 * Get current UTC ISO string
 */
export function getCurrentUTC() {
  return new Date().toISOString();
}
