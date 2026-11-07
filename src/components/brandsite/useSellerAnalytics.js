import { useEffect } from 'react';

export default function useSellerAnalytics(storeId, preview, event = 'page_view', channel = 'brandsite') {
  useEffect(() => {
    if (preview || !storeId || navigator.doNotTrack === '1') return;
    try {
      const visitorKey = 'fasta-analytics-visitor';
      const sessionKey = 'fasta-analytics-session';
      let visitor = localStorage.getItem(visitorKey);
      if (!visitor) {
        visitor = crypto.randomUUID();
        localStorage.setItem(visitorKey, visitor);
      }
      let session = JSON.parse(sessionStorage.getItem(sessionKey) || 'null');
      if (!session || Date.now() - session.at > 30 * 60 * 1000) {
        session = { id: crypto.randomUUID(), at: Date.now() };
      }
      session.at = Date.now();
      sessionStorage.setItem(sessionKey, JSON.stringify(session));
      const origin = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/+$/, '');
      fetch(origin + '/api/v1/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          event_id: crypto.randomUUID(),
          store_id: storeId,
          visitor_id: visitor,
          session_id: session.id,
          channel,
          event,
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          referrer: document.referrer || undefined,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Storage can be disabled by the visitor.
    }
  }, [storeId, preview, event, channel]);
}

