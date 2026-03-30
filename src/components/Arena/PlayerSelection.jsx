import { motion } from 'framer-motion';
import { Users, Check } from 'lucide-react';
import { PLAYERS } from '../../utils/players';

/**
 * 게임 시작 전 참여 플레이어를 선택하는 화면
 */
export default function PlayerSelection({ selectedIds, onToggle, onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-12 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container/10 mb-4">
            <Users className="text-primary-container" size={32} />
          </div>
          <h2 className="text-3xl font-bold font-headline text-on-background mb-2">플레이어 선택</h2>
          <p className="text-on-surface-variant text-sm">함께 루미큐브를 즐길 멤버를 선택해 주세요 (2~5인)</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {PLAYERS.map((player) => {
            const isSelected = selectedIds.includes(player.id);
            return (
              <motion.button
                key={player.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggle(player.id)}
                className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                  isSelected
                    ? 'border-primary-container bg-primary-container/10 shadow-[0_0_20px_rgba(230,25,46,0.1)]'
                    : 'border-outline-variant/20 bg-surface-container-low hover:border-outline-variant/40'
                }`}
              >
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-2xl font-bold overflow-hidden border-2 ${isSelected ? 'border-primary-container' : 'border-transparent'}`}>
                    <img
                      src={`/assets/profiles/${player.name}.webp`}
                      alt={player.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                      {player.name.charAt(0)}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-primary-container text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div>
                  <div className={`font-bold transition-colors ${isSelected ? 'text-primary-container' : 'text-on-surface'}`}>
                    {player.name}
                  </div>
                  <div className="text-[10px] text-on-surface-variant uppercase tracking-tighter opacity-60">
                    {player.title}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          disabled={selectedIds.length < 2}
          onClick={onStart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full max-w-sm py-4 rounded-2xl font-bold text-lg transition-all shadow-xl ${
            selectedIds.length >= 2
              ? 'bg-gradient-to-r from-primary-container to-[#930016] text-white'
              : 'bg-surface-container-highest text-on-surface/30 cursor-not-allowed shadow-none'
          }`}
        >
          {selectedIds.length >= 2 ? `${selectedIds.length}명과 함께 시작하기` : '2명 이상 선택 필요'}
        </motion.button>
      </motion.div>
    </div>
  );
}
