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
}) {
  const [imgError, setImgError] = useState(false);
  const borderColors = [
    'border-primary',
    'border-secondary',
    'border-tertiary',
    'border-surface-container-highest',
    'border-primary-fixed-dim',
  ];

  const accentBg = [
    'bg-primary',
    'bg-secondary',
    'bg-tertiary',
    'bg-surface-container-highest',
    'bg-primary-fixed-dim',
  ];

  const initials = player.name.charAt(0);
  const colorIndex = index % borderColors.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`bg-surface-container-low p-5 rounded-xl border flex flex-col gap-5 relative overflow-hidden group transition-all ${
        isWinner
          ? 'border-tertiary/40 ring-2 ring-tertiary/20'
          : isFirstRegistered
          ? 'border-primary-container/40 ring-2 ring-primary-container/20'
          : 'border-outline-variant/15'
      }`}
    >
      {/* 꼭짓점 장식 */}
      <div className={`absolute top-0 right-0 w-14 h-14 ${accentBg[colorIndex]}/5 rounded-bl-full pointer-events-none`} />

      <div className="flex items-center gap-4">
        <div className="relative">
          {/* 프로필 이미지 또는 이니셜 아바타 */}
          {!imgError ? (
            <img
              src={`/assets/profiles/${player.name}.webp`}
              alt={player.name}
              onError={() => setImgError(true)}
              className={`w-14 h-14 rounded-full object-cover border-2 ${borderColors[colorIndex]} bg-surface-container-highest`}
            />
          ) : (
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold font-headline border-2 ${borderColors[colorIndex]} bg-surface-container-highest text-on-surface`}
            >
              {initials}
            </div>
          )}
          {/* 번호 뱃지 */}
          <div
            className={`absolute -bottom-1 -right-1 ${accentBg[colorIndex]} text-on-primary-fixed w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold`}
          >
            {index + 1}
          </div>
        </div>

        <div>
          <h3 className="font-headline font-bold text-lg text-on-surface">{player.name}</h3>
          <p className="text-[10px] font-label text-on-surface-variant tracking-wider uppercase">
            {player.title}
          </p>
        </div>

        {/* 상태 인디케이터 */}
        {isFirstRegistered && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto bg-primary-container/20 text-primary-container text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
          >
            등록
          </motion.div>
        )}
        {isWinner && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto bg-tertiary/20 text-tertiary text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
          >
            🏆 WIN
          </motion.div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button
          onClick={() => onRegister(player.name)}
          disabled={disabled || isFirstRegistered}
          className={`font-label py-3 rounded-lg text-sm font-bold tracking-tight transition-all active:scale-95 ${
            isFirstRegistered
              ? 'bg-primary-container/20 text-primary-container cursor-default'
              : 'bg-surface-container-highest text-secondary hover:bg-surface-bright'
          }`}
        >
          등록
        </button>
        <button
          onClick={() => onWin(player.name)}
          disabled={disabled}
          className={`font-label py-3 rounded-lg text-sm font-bold tracking-tight shadow-md active:scale-95 transition-all ${
            isWinner
              ? 'bg-tertiary text-on-tertiary'
              : 'bg-gradient-to-br from-primary-container to-[#930016] text-on-primary-container hover:brightness-110'
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
