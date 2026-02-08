import { useState, useEffect, useCallback } from 'react';

interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  isLowTime: boolean;
  formattedTime: string;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (newTime: number) => void;
}

export const useTimer = (initialTime: number, onTimeUp?: () => void): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  // Format time as MM:SS
  const formattedTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  // Low time warning (5 minutes = 300 seconds)
  const isLowTime = timeLeft <= 300 && timeLeft > 0;

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setIsRunning(false);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeUp]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback((newTime: number) => {
    setTimeLeft(newTime);
    setIsRunning(false);
  }, []);

  return {
    timeLeft,
    isRunning,
    isLowTime,
    formattedTime: formattedTime(),
    startTimer,
    pauseTimer,
    resetTimer,
  };
};
