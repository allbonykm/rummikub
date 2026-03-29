import { motion } from 'framer-motion';
import Timer from './Timer';
import PlayerCard, { EmptySlot } from './PlayerCard';
import { PLAYERS } from '../../utils/players';

/**
 * Arena 페이지 - 메인 게임 화면
 */
export default function ArenaPage({
  timer,
  currentGame,
  onRegister,
  onWin,
}) {
  const handleTimerToggle = () => {
    if (timer.isAlarm || !timer.isRunning) {
      timer.reset();
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 pt-4 pb-32">
      {/* Timer Section */}
      <Timer
        seconds={timer.seconds}
        isRunning={timer.isRunning}
        isAlarm={timer.isAlarm}
        progress={timer.progress}
        onToggle={handleTimerToggle}
      />

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PLAYERS.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            index={index}
            isFirstRegistered={currentGame.firstRegister === player.name}
            isWinner={currentGame.winner === player.name}
            onRegister={onRegister}
            onWin={onWin}
            disabled={false}
          />
        ))}
        <EmptySlot />
      </div>
    </main>
  );
}
