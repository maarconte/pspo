declare function gtag(command: 'event', eventName: string, params?: Record<string, unknown>): void;

export const trackEvent = (name: string, params?: Record<string, unknown>): void => {
  if (typeof gtag === 'undefined') return;
  gtag('event', name, params);
};
