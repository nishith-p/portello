import { useState, useEffect } from 'react';
import { Day, Session } from './types';

export const useAgenda = () => {
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agenda');
      if (!response.ok) throw new Error('Failed to fetch agenda');
      const data = await response.json();
      setDays(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  const updateSession = async (sessionId: number, updates: Partial<Session>) => {
    try {
      const response = await fetch(`/api/agenda/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update session');
      
      // Refetch data to ensure UI is in sync
      await fetchAgenda();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update session');
    }
  };

  return { days, loading, error, updateSession };
};
