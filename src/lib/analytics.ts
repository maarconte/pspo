declare function gtag(command: 'event', eventName: string, params?: Record<string, unknown>): void;

export const trackEvent = (name: string, params?: Record<string, unknown>): void => {
  if (import.meta.env.DEV) {
    console.log('[Analytics]', name, params ?? {});
  }
  if (typeof gtag === 'undefined') return;
  gtag('event', name, params);
};
