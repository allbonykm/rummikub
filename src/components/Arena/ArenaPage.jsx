import { Reorder, useDragControls } from 'framer-motion';
import Timer from './Timer';
import PlayerCard from './PlayerCard';

/**
 * 드래그 핸들을 분리하여 모바일 스크롤 간섭을 막는 커스텀 Reorder 아이템
 */
function DraggablePlayerCard({ player, index, currentGame, playerStats, onRegister, onWin }) {
  const controls = useDragControls();

  return (
    <Reorder.Item value={player} dragListener={false} dragControls={controls}>
      <PlayerCard
        player={player}
        index={index}
        isFirstRegistered={currentGame.firstRegister === player.name}
        isWinner={currentGame.winner === player.name}
        playerStats={playerStats}
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
  history,
  onRegister,
  onWin,
}) {
  const handleTimerToggle = () => {
    timer.reset();
  };

  const todayStr = new Date().toDateString();
  const getPlayerStats = (playerName) => {
    let allTime = 0;
    let todayWins = 0;
    if (history) {
      history.forEach((record) => {
        if (record.winner === playerName && !record.isDeleted) {
          allTime++;
          const recordDate = new Date(record.timestamp).toDateString();
          if (recordDate === todayStr) {
            todayWins++;
          }
        }
      });
    }
    return { allTime, todayWins };
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
            playerStats={getPlayerStats(player.name)}
            onRegister={onRegister}
            onWin={onWin}
          />
        ))}
      </Reorder.Group>
    </main>
  );
}
