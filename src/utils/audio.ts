/**
 * Web Audio API synthesized focus completion chime
 * Operates offline, zero external asset dependencies, peaceful calm tone
 */

const SOUND_STORAGE_KEY = 'lifeos-focus-sound-enabled';

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(SOUND_STORAGE_KEY);
  return stored !== 'false'; // default to enabled
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false');
}

export function playCompletionChime(): void {
  if (typeof window === 'undefined') return;
  if (!isSoundEnabled()) return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Gentle 2-chord peaceful chime: C5 (523.25Hz) and E5 (659.25Hz) blending into G5 (783.99Hz)
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      // Envelope: gentle attack, peaceful exponential decay
      const startTime = ctx.currentTime + idx * 0.12;
      const duration = 1.6;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('Unable to play audio chime', err);
    }
  }
}
