export function isNativePlatform(): boolean {
  try {
    // @ts-ignore
    const { Capacitor } = require('@capacitor/core');
    if (Capacitor && typeof Capacitor.getPlatform === 'function') {
      const p = Capacitor.getPlatform();
      return p !== 'web';
    }
  } catch (e) {
    // fallback to userAgent sniffing
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      if (/Android|iPhone|iPad|iPod|Capacitor/i.test(ua)) return true;
    }
  }
  return false;
}
