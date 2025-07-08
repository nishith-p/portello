import { useState, useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

export function useActivities(initialActivities: string[]) {
  const { user } = useKindeBrowserClient();
  const [clickedSquares, setClickedSquares] = useState<boolean[]>(
    new Array(initialActivities.length).fill(false)
  );

  // Load saved activities on mount
  useEffect(() => {
    if (!user) return;

    const loadActivities = async () => {
      try {
        const response = await fetch('/api/bingo/load');
        const data = await response.json();
        
        if (response.ok) {
          const savedActivities = new Array(initialActivities.length).fill(false);
          data.forEach((item: { activity_id: number, completed: boolean }) => {
            if (item.activity_id >= 0 && item.activity_id < initialActivities.length) {
              savedActivities[item.activity_id] = item.completed;
            }
          });
          setClickedSquares(savedActivities);
        }
      } catch (error) {
        console.error('Failed to load bingo:', error);
      }
    };

    loadActivities();
  }, [user, initialActivities.length]);

  const toggleSquare = async (index: number) => {
    if (!user) return;

    const newClickedSquares = [...clickedSquares];
    newClickedSquares[index] = !newClickedSquares[index];
    setClickedSquares(newClickedSquares);

    try {
      await fetch('/api/bingo/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId: index,
          completed: newClickedSquares[index]
        }),
      });
    } catch (error) {
      console.error('Failed to save activity:', error);
      // Revert if save fails
      setClickedSquares(clickedSquares);
    }
  };

  return { clickedSquares, toggleSquare };
}
