import { useState, useEffect, useCallback } from 'react';

export function useServiceHealth(url, intervalMs = 30000) {
  const [status, setStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);
  const [error, setError] = useState(null);

  const check = useCallback(async () => {
    if (!url) return;
    try {
      // no-cors lets us probe cross-origin; opaque response = host responded
      await fetch(url, { method: 'GET', mode: 'no-cors', cache: 'no-store' });
      setStatus('online');
      setError(null);
    } catch (e) {
      setStatus('offline');
      setError(e.message);
    }
    setLastChecked(new Date());
  }, [url]);

  useEffect(() => {
    check();
    const id = setInterval(check, intervalMs);
    return () => clearInterval(id);
  }, [check, intervalMs]);

  return { status, lastChecked, error };
}
