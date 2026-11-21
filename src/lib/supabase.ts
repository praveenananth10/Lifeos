import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Sanitizes and normalizes the Supabase URL:
 * - Handles raw project references (e.g. "abcdefghijklmnopqrst") -> "https://abcdefghijklmnopqrst.supabase.co"
 * - Handles missing protocol (e.g. "xyz.supabase.co") -> "https://xyz.supabase.co"
 * - Ignores placeholder values
 */
export function normalizeSupabaseUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();
  if (
    !trimmed ||
    trimmed === 'your_supabase_project_url' ||
    trimmed === 'your_supabase_url'
  ) {
    return '';
  }

  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    if (!trimmed.includes('.')) {
      // User provided just the project ref
      trimmed = `https://${trimmed}.supabase.co`;
    } else {
      trimmed = `https://${trimmed}`;
    }
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return '';
  }
}

const normalizedUrl = normalizeSupabaseUrl(rawUrl);
const cleanKey =
  rawKey &&
    rawKey !== 'your_supabase_anon_key' &&
    rawKey.trim() !== ''
    ? rawKey.trim()
    : '';

export const isSupabaseConfigured = Boolean(normalizedUrl && cleanKey);

// Syntactically valid dummy fallback URL so createClient never throws on startup
const clientUrl = isSupabaseConfigured ? normalizedUrl : 'https://placeholder.supabase.co';
const clientKey = isSupabaseConfigured ? cleanKey : 'placeholder-anon-key';

export const supabase = createClient(clientUrl, clientKey);
