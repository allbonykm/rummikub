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
        <div className="mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-container/10 mb-8 shadow-inner">
            <Users className="text-primary-container" size={40} />
          </div>
          <h2 className="text-5xl font-black font-headline text-on-background mb-4 tracking-tighter italic">플레이어 선택</h2>
          <p className="text-on-surface-variant text-base font-medium opacity-80 decoration-primary/30 underline-offset-8 underline decoration-2">함께 루미큐브를 즐길 멤버를 선택해 주세요 (2~5인)</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-20">
          {PLAYERS.map((player) => {
            const isSelected = selectedIds.includes(player.id);
            return (
              <motion.button
                key={player.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggle(player.id)}
                className={`relative p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-5 ${
                  isSelected
                    ? 'border-primary-container bg-primary-container/10 shadow-[0_10px_40px_rgba(230,25,46,0.15)] ring-4 ring-primary-container/10'
                    : 'border-outline-variant/15 bg-surface-container-low hover:border-outline-variant/40 hover:bg-surface-container-highest/30'
                }`}
              >
                <div className="relative">
                  <div className={`w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center text-4xl font-black overflow-hidden border-2 ${isSelected ? 'border-primary-container' : 'border-transparent'} shadow-2xl transition-transform group-hover:scale-105 duration-500`}>
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
                    <div className="absolute -top-1 -right-1 bg-primary-container text-white w-8 h-8 rounded-full flex items-center justify-center shadow-xl border-4 border-surface ring-2 ring-primary-container/50">
                      <Check size={18} strokeWidth={4} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <div className={`text-xl font-black font-headline transition-colors ${isSelected ? 'text-primary-container underline decoration-primary/20 underline-offset-4' : 'text-on-surface'}`}>
                    {player.name}
                  </div>
                  <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40">
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
          className={`w-full max-w-sm py-6 rounded-3xl font-black text-xl tracking-[0.2em] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] uppercase ${
            selectedIds.length >= 2
              ? 'bg-gradient-to-r from-primary-container to-[#930016] text-white'
              : 'bg-surface-container-highest text-on-surface/20 cursor-not-allowed shadow-none border border-outline-variant/10'
          }`}
        >
          {selectedIds.length >= 2 ? `GAMES START (${selectedIds.length})` : 'Select Players'}
        </motion.button>
      </motion.div>
    </div>
  );
}
