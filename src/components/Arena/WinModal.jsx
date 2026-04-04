import { motion, AnimatePresence } from 'framer-motion';

/**
 * 승리 모달 컴포넌트
 * - 승리자 정보, 게임 시간, 턴 수 표시
 * - 새 게임 / 멤버 재선택 옵션
 */
export default function WinModal({ isOpen, winner, duration, turnCount, onNewGame, onReset }) {
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
        >
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* 모달 카드 */}
          <motion.div
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-surface-container-low rounded-3xl border border-white/10 shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* 상단 골드 그라데이션 헤더 */}
            <div className="bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FF8C00] p-8 text-center">
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="text-3xl font-black font-headline text-[#1a1400] tracking-tight">
                {winner}
              </h2>
              <p className="text-[#4a3800] font-bold text-sm mt-1 uppercase tracking-widest">
                Winner!
              </p>
            </div>

            {/* 게임 요약 */}
            <div className="p-6 space-y-4">
              <h3 className="text-xs font-label uppercase tracking-widest text-on-surface-variant text-center mb-4">
                📊 게임 요약
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* 게임 시간 */}
                <div className="bg-surface-container-highest/30 rounded-2xl p-4 text-center border border-white/5">
                  <span className="material-symbols-outlined text-on-surface-variant mb-1 block" style={{ fontSize: '24px' }}>timer</span>
                  <div className="text-2xl font-black font-headline text-on-surface">
                    {formatDuration(duration)}
                  </div>
                  <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">
                    게임 시간
                  </div>
                </div>

                {/* 턴 수 */}
                <div className="bg-surface-container-highest/30 rounded-2xl p-4 text-center border border-white/5">
                  <span className="material-symbols-outlined text-on-surface-variant mb-1 block" style={{ fontSize: '24px' }}>replay</span>
                  <div className="text-2xl font-black font-headline text-on-surface">
                    {turnCount}<span className="text-base font-bold text-on-surface-variant ml-1">턴</span>
                  </div>
                  <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">
                    총 턴 수
                  </div>
                </div>
              </div>

              {/* 버튼 영역 */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={onReset}
                  className="py-4 rounded-2xl text-sm font-black font-label tracking-widest bg-surface-container-highest text-on-surface-variant border-2 border-white/10 hover:bg-surface-bright active:scale-95 transition-all"
                >
                  멤버 재선택
                </button>
                <button
                  onClick={onNewGame}
                  className="py-4 rounded-2xl text-sm font-black font-label tracking-widest bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-[#1a1400] border-2 border-[#FFD700]/30 hover:brightness-110 active:scale-95 transition-all shadow-lg"
                >
                  새 게임 시작
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
