import { motion } from 'framer-motion';

/**
 * 원형 타이머 컴포넌트
 * - 원형 프로그레스 바 + 남은 시간 표시
 * - 클릭 시 start / re-count 동작
 * - isPaused 상태 시 깜빡임 시각 피드백
 */
export default function Timer({ seconds, isRunning, isPaused, isAlarm, progress, onToggle }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const getTimerColor = () => {
    if (isAlarm) return '#E6192E';
    if (isPaused) return '#E9C400';
    if (seconds <= 10) return '#E6192E';
    if (seconds <= 30) return '#E9C400';
    return '#E6192E';
  };

  const getLabel = () => {
    if (isAlarm) return 'TIME UP!';
    if (isPaused) return 'PAUSED';
    if (!isRunning && seconds === 60) return 'START';
    return 'RE-COUNT';
  };

  const playPing = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // 가벼운 A5 음 (라)
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio not supported or blocked
    }
  };

  const handleToggle = () => {
    if (!isPaused) {
      playPing();
    }
    onToggle();
  };

  return (
    <section className="mb-6 text-center relative">
      <div className="inline-block relative">
        {/* Glow background */}
        <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity ${isAlarm ? 'bg-primary-container/30 opacity-100' : 'bg-primary/10 opacity-60'}`} />

        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xs font-label uppercase tracking-widest text-primary mb-3">
            남은 시간
          </span>

          {/* Timer Circle */}
          <div className="w-72 h-72 rounded-full border-4 border-surface-container-highest flex items-center justify-center bg-surface-container-low shadow-2xl">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleToggle}
              className={`group relative flex flex-col items-center justify-center w-64 h-64 rounded-full shadow-lg transition-all duration-200 ${
                isAlarm
                  ? 'bg-gradient-to-br from-primary-container to-[#930016] timer-glow'
                  : isPaused
                  ? 'bg-gradient-to-br from-[#3a3500] to-[#1a1700]'
                  : 'bg-gradient-to-br from-primary-container to-[#930016]'
              }`}
            >
              {/* SVG Progress Ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 200 200"
              >
                {/* Background ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                />
                {/* Progress ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={getTimerColor()}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ease-linear ${isPaused ? 'animate-pulse' : ''}`}
                />
              </svg>

              {/* Timer text */}
              <motion.span
                key={`${seconds}-${isPaused}`}
                initial={seconds <= 10 && isRunning ? { scale: 1.3 } : {}}
                animate={{ scale: 1 }}
                className={`text-6xl font-extrabold font-headline text-on-primary-container ${
                  isAlarm ? 'animate-pulse' : ''
                } ${isPaused ? 'animate-pulse' : ''}`}
              >
                {isAlarm ? '🔔' : `${seconds}초`}
              </motion.span>
              <span className={`text-xs font-label uppercase tracking-widest opacity-80 mt-1 text-on-primary-container ${isPaused ? 'text-yellow-400 opacity-100' : ''}`}>
                {getLabel()}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
