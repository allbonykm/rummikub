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
      className={`bg-surface-container-low p-8 rounded-2xl border flex flex-col gap-8 relative overflow-hidden group transition-all ${
        isWinner
          ? 'border-tertiary/40 shadow-[0_0_30px_rgba(233,196,0,0.1)]'
          : isFirstRegistered
          ? 'border-primary-container/40'
          : 'border-outline-variant/15 hover:border-outline-variant/40'
      }`}
    >
      {/* 꼭짓점 장식 */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${accentBg[colorIndex]}/10 rounded-bl-3xl pointer-events-none`} />

      <div className="flex items-center gap-6">
        <div className="relative">
          {/* 프로필 이미지 또는 이니셜 아바타 */}
          {!imgError ? (
            <img
              src={`/assets/profiles/${player.name}.webp`}
              alt={player.name}
              onError={() => setImgError(true)}
              className={`w-20 h-20 rounded-full object-cover border-2 ${borderColors[colorIndex]} bg-surface-container-highest shadow-xl`}
            />
          ) : (
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black font-headline border-2 ${borderColors[colorIndex]} bg-surface-container-highest text-on-surface shadow-xl`}
            >
              {initials}
            </div>
          )}
          {/* 번호 뱃지 */}
          <div
            className={`absolute -bottom-1 -right-1 ${accentBg[colorIndex]} text-on-primary-fixed w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-lg`}
          >
            {index + 1}
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="font-headline font-black text-3xl text-on-surface tracking-tight">{player.name}</h3>
        </div>

        {/* 상태 인디케이터 */}
        <div className="ml-auto flex flex-col items-end gap-2">
          {isFirstRegistered && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary-container text-white text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-lg"
            >
              등록됨
            </motion.div>
          )}
          {isWinner && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-tertiary text-on-tertiary text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-lg"
            >
              🏆 WINNER
            </motion.div>
          )}
        </div>
      </div>

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
