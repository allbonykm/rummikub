import { Reorder, useDragControls } from 'framer-motion';
import Timer from './Timer';
import PlayerCard from './PlayerCard';

/**
 * 드래그 핸들을 분리하여 모바일 스크롤 간섭을 막는 커스텀 Reorder 아이템
 */
function DraggablePlayerCard({ player, index, currentGame, onRegister, onWin }) {
  const controls = useDragControls();

  return (
    <Reorder.Item value={player} dragListener={false} dragControls={controls}>
      <PlayerCard
        player={player}
        index={index}
        isFirstRegistered={currentGame.firstRegister === player.name}
        isWinner={currentGame.winner === player.name}
        onRegister={onRegister}
        onWin={onWin}
        disabled={false}
        dragHandleProps={{ onPointerDown: (e) => controls.start(e) }}
      />
    </Reorder.Item>
  );
}

/**
 * Arena 페이지 - 메인 게임 화면
 */
export default function ArenaPage({
  timer,
  players,
  setPlayers,
  currentGame,
  onRegister,
  onWin,
}) {
  const handleTimerToggle = () => {
    timer.reset();
  };

  return (
    <main className="max-w-4xl mx-auto px-6 pt-12 pb-32">
      {/* Timer Section */}
      <Timer
        seconds={timer.seconds}
        isRunning={timer.isRunning}
        isAlarm={timer.isAlarm}
        progress={timer.progress}
        onToggle={handleTimerToggle}
      />

      {/* Player List (Drag & Drop Reorder) */}
      <Reorder.Group 
        axis="y" 
        values={players} 
        onReorder={setPlayers} 
        className="flex flex-col gap-10 mt-20"
      >
        {players.map((player, index) => (
          <DraggablePlayerCard
            key={player.id}
            player={player}
            index={index}
            currentGame={currentGame}
            onRegister={onRegister}
            onWin={onWin}
          />
        ))}
      </Reorder.Group>
    </main>
  );
}
