'use client';

import { useEffect, useState } from 'react';
import styles from './Countdown.module.css';
import { Group, Paper, Text } from '@mantine/core';

interface CountdownTimerProps {
  targetDate: string; // Target date in ISO format (e.g., "2025-01-31T23:59:59")
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) {
    return <div className={styles.container}>Time's up!</div>;
  }

  return (
    <div className={styles.container}>
      <Group className={styles.group}>
        {Object.entries(timeLeft).map(([key, value]) => (
          <Paper key={key} className={styles.paper}>
            <Text className={styles.timeValue}>{value}</Text>
            <Text className={styles.timeLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          </Paper>
        ))}
      </Group>
    </div>
  );
};

const calculateTimeLeft = (targetDate: string) => {
  const now = new Date();
  const target = new Date(targetDate);
  const difference = target.getTime() - now.getTime();

  if (difference <= 0) {
    return null;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
};

export default CountdownTimer;
