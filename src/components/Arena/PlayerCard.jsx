import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

/**
 * 개별 플레이어 카드 컴포넌트
 */
export default function PlayerCard({
  player,
  index,
  isFirstRegistered,
  isWinner,
  onRegister,
  onWin,
  disabled,
  dragHandleProps,
  playerStats,
}) {
  const [imgError, setImgError] = useState(false);
  const borderColors = [
    'border-primary',
    'border-secondary',
    'border-tertiary',
    'border-surface-container-highest',
    'border-primary-fixed-dim',
  ];

  const initials = player.name.charAt(0);
  const colorIndex = index % borderColors.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`bg-surface-container-low p-6 sm:p-8 rounded-3xl border flex flex-col gap-4 relative transition-all duration-300 w-full ${
        isWinner
          ? 'border-tertiary/60 shadow-[0_0_50px_rgba(233,196,0,0.15)] ring-1 ring-tertiary/20'
          : isFirstRegistered
          ? 'border-primary-container/60 shadow-[0_0_50px_rgba(230,25,46,0.1)] ring-1 ring-primary-container/20'
          : 'border-white/5 hover:border-white/20'
      }`}
    >
      {/* 턴 순번 뱃지 (카드 밖 좌측 상단 모서리에 걸침) */}
      {dragHandleProps && (
        <div className="absolute -top-4 -left-4 z-30 bg-primary/90 text-on-primary font-black text-xl w-12 h-12 flex items-center justify-center rounded-full shadow-lg border-[3px] border-surface">
          {index + 1}
        </div>
      )}

      {/* 상단 프로필 및 핸들 영역 */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {/* 프로필 이미지 또는 이니셜 아바타 */}
          {!imgError ? (
            <img
              src={`/assets/profiles/${player.name}.webp`}
              alt={player.name}
              onError={() => setImgError(true)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 ${borderColors[colorIndex]} bg-surface-container-highest shadow-xl`}
            />
          ) : (
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-black font-headline border-2 ${borderColors[colorIndex]} bg-surface-container-highest text-on-surface shadow-xl`}
            >
              {initials}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-headline font-black text-2xl sm:text-3xl text-on-surface tracking-tight truncate">{player.name}</h3>
        </div>

        {/* 우측 인디케이터 및 드래그 핸들 */}
        <div className="ml-auto flex flex-col items-end gap-3 shrink-0">
          {dragHandleProps && (
            <div 
              className="w-12 h-10 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none text-on-surface-variant hover:bg-surface-bright rounded-xl bg-surface-container-high shadow-md border border-white/10 transition-colors"
              {...dragHandleProps}
            >
              <span className="material-symbols-outlined pointer-events-none" style={{ fontSize: '28px' }}>drag_handle</span>
            </div>
          )}
          {isFirstRegistered && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary-container text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg"
            >
              등록됨
            </motion.div>
          )}
          {isWinner && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-tertiary text-on-tertiary text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg"
            >
              🏆 WINNER
            </motion.div>
          )}
        </div>
      </div>

      {/* 실시간 승리 전적 표시 영역 */}
      {playerStats && (
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-surface-container-highest/10 to-surface-container-lowest/30 rounded-3xl py-6 my-2 border border-white/5 shadow-inner">
          <div className="text-[11px] font-label font-bold tracking-widest uppercase text-on-surface-variant mb-1 opacity-80">오늘의 승리</div>
          <div className="text-7xl font-black font-headline tracking-tighter text-primary-fixed leading-none drop-shadow-md">
            {playerStats.todayWins}
          </div>
          <div className="text-xs font-medium text-on-surface-variant mt-4 pt-3 border-t border-white/5 w-4/5 text-center flex items-center justify-center gap-2">
            <span>역대 통산 승리</span>
            <span className="text-on-surface font-black text-sm bg-surface-container-highest px-2 py-0.5 rounded-md">{playerStats.allTime}</span>
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="grid grid-cols-2 gap-5 mt-4">
        <button
          onClick={() => onRegister(player.name)}
          disabled={disabled || isFirstRegistered}
          className={`font-label py-6 rounded-full text-lg font-black tracking-widest transition-all active:scale-95 shadow-sm border-2 ${
            isFirstRegistered
              ? 'bg-primary-container/10 text-primary-container/30 border-primary-container/20 cursor-default'
              : 'bg-surface-container-highest text-secondary border-secondary/20 hover:bg-surface-bright hover:shadow-xl'
          }`}
        >
          등록
        </button>
        <button
          onClick={() => onWin(player.name)}
          disabled={disabled}
          className={`font-label py-6 rounded-full text-lg font-black tracking-widest shadow-2xl active:scale-95 transition-all border-2 ${
            isWinner
              ? 'bg-tertiary text-on-tertiary border-tertiary/50'
              : 'bg-gradient-to-br from-primary-container to-[#930016] text-white border-primary-container/30 hover:brightness-110'
          }`}
        >
          승리
        </button>
      </div>
    </motion.div>
  );
}

/**
 * 빈 슬롯 (플레이어 추가)
 */
export function EmptySlot() {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:bg-surface-container-low transition-colors min-h-[180px]">
      <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform">
        <UserPlus size={20} className="text-on-surface-variant" />
      </div>
      <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
        플레이어 추가
      </p>
    </div>
  );
}
