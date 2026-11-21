/**
 * Utility for combining Tailwind CSS class strings cleanly.
 */
export function cn(...inputs: unknown[]): string {
  return inputs.filter(Boolean).join(' ').trim();
}
