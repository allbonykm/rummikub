import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * 60초 타이머 커스텀 훅
 * - start: 타이머 시작
 * - reset: 타이머 리셋 후 자동 시작 (Re-count)
 * - stop: 타이머 정지
 */
export default function useTimer(initialSeconds = 60) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isAlarm, setIsAlarm] = useState(false);
  const intervalRef = useRef(null);
  const alarmRef = useRef(null);
  const countdownAudioRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopAlarm = useCallback(() => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
      alarmRef.current = null;
    }
    setIsAlarm(false);
  }, []);

  const playCountdownSound = useCallback((sec) => {
    const names = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    if (sec >= 1 && sec <= 10) {
      try {
        if (countdownAudioRef.current) {
          countdownAudioRef.current.pause();
        }
        const audio = new Audio(`/assets/audio/${names[sec - 1]}.mp3`);
        audio.volume = 0.8;
        audio.play().catch(() => {});
        countdownAudioRef.current = audio;
      } catch (e) {
        // 음성 파일이 없을 시 무시
      }
    }
  }, []);

  const startAlarm = useCallback(() => {
    try {
      const alarm = new Audio('/assets/audio/alarm.mp3');
      alarm.loop = true;
      alarm.volume = 1.0;
      alarm.play().catch(() => {});
      alarmRef.current = alarm;
      setIsAlarm(true);
    } catch (e) {
      setIsAlarm(true);
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    stopAlarm();
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          startAlarm();
          return 0;
        }
        // 카운트다운 음성
        if (prev - 1 <= 10 && prev - 1 >= 1) {
          playCountdownSound(prev - 1);
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, stopAlarm, startAlarm, playCountdownSound]);

  const reset = useCallback(() => {
    clearTimer();
    stopAlarm();
    setSeconds(initialSeconds);
    setIsRunning(false);
    setIsAlarm(false);
    // 리셋 후 자동 시작
    setTimeout(() => {
      start();
    }, 100);
  }, [initialSeconds, clearTimer, stopAlarm, start]);

  const stop = useCallback(() => {
    clearTimer();
    stopAlarm();
    setIsRunning(false);
    setIsAlarm(false);
    setSeconds(initialSeconds);
  }, [initialSeconds, clearTimer, stopAlarm]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimer();
      stopAlarm();
    };
  }, [clearTimer, stopAlarm]);

  return {
    seconds,
    isRunning,
    isAlarm,
    start,
    reset,
    stop,
    progress: seconds / initialSeconds,
  };
}
