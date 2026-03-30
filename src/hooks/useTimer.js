import { useState, useRef, useCallback, useEffect } from 'react';

// 공유(Share) AudioContext 인스턴스 (브라우저 정책 및 성능 최적화)
let sharedAudioCtx = null;

const getAudioContext = () => {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
};

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

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopAlarm = useCallback(() => {
    if (alarmRef.current) {
      clearInterval(alarmRef.current);
      alarmRef.current = null;
    }
    setIsAlarm(false);
  }, []);

  const playCountdownSound = useCallback((sec) => {
    if (sec >= 1 && sec <= 10) {
      try {
        const audioCtx = getAudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // 3초 이하는 더 높은 톤의 주의 비프음
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(sec <= 3 ? 880 : 440, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // 브라우저 오디오 권한 등의 이슈 시 무시
        console.error("Audio error:", e);
      }
    }
  }, []);

  const startAlarm = useCallback(() => {
    try {
      if (alarmRef.current) return;
      
      const audioCtx = getAudioContext();
      
      const playBeep = () => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      };

      playBeep(); 
      alarmRef.current = setInterval(playBeep, 400); 
      setIsAlarm(true);
    } catch (e) {
      setIsAlarm(true);
      console.error("Alarm error:", e);
    }
  }, []);

  const start = useCallback(() => {
    // 사용자 클릭(User Gesture) 시점에 AudioContext를 미리 활성화 (브라우저 정책 통과)
    getAudioContext();

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
