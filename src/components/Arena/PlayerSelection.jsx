import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PLAYERS } from '../../utils/players';

/**
 * 게임 시작 전 참여 플레이어를 선택하는 화면
 */
export default function PlayerSelection({ selectedIds, onToggle, onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-20 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <div style={{ marginBottom: '16px' }}>
          <h2 className="text-6xl font-black font-headline text-on-background tracking-tighter" style={{ marginBottom: '16px' }}>루미큐브 할 사람</h2>
          <p className="text-on-surface-variant text-lg font-medium opacity-70 decoration-primary/20 underline-offset-10 underline decoration-2">함께 루미큐브할 사람을 선택해 주세요 (2~5명)</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3" style={{ rowGap: '16px', columnGap: '40px', marginBottom: '40px' }}>
          {PLAYERS.map((player) => {
            const isSelected = selectedIds.includes(player.id);
            return (
              <motion.button
                key={player.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggle(player.id)}
                className={`relative rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${isSelected
                  ? 'border-primary-container bg-primary-container/10 shadow-[0_20px_50px_rgba(230,25,46,0.2)] ring-4 ring-primary-container/10'
                  : 'border-white/5 bg-surface-container-low hover:border-white/20 hover:bg-surface-container-highest/30'
                  }`}
                style={{ padding: '16px' }}
              >
                <div className="relative">
                  <div className={`w-28 h-28 rounded-full bg-surface-container-highest flex items-center justify-center text-5xl font-black overflow-hidden border-2 ${isSelected ? 'border-primary-container' : 'border-transparent'} shadow-2xl transition-transform group-hover:scale-105 duration-500`}>
                    <img
                      src={`/assets/profiles/${player.name}.webp`}
                      alt={player.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div style={{ display: 'none' }} className="w-full h-full items-center justify-center font-headline">
                      {player.name.charAt(0)}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-primary-container text-white w-9 h-9 rounded-full flex items-center justify-center shadow-xl border-4 border-surface ring-2 ring-primary-container/50">
                      <Check size={20} strokeWidth={4} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <div className={`text-2xl font-black font-headline transition-colors ${isSelected ? 'text-primary-container' : 'text-on-surface'}`}>
                    {player.name}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          disabled={selectedIds.length < 2}
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full max-w-sm py-7 rounded-full font-black text-2xl tracking-[0.1em] transition-all shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${selectedIds.length >= 2
            ? 'bg-gradient-to-r from-primary-container to-[#930016] text-white'
            : 'bg-surface-container-highest text-on-surface/20 cursor-not-allowed shadow-none border border-white/5'
            }`}
        >
          {selectedIds.length >= 2 ? `루미큐브 시작 (${selectedIds.length}명)` : '루미큐브 할 사람 선택'}
        </motion.button>
      </motion.div>
    </div>
  );
}
