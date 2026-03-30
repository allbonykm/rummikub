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

  const [isLandscape, setIsLandscape] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => setIsLandscape(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <main className="max-w-[1400px] w-full mx-auto px-4 md:px-8 pt-12 pb-32">
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
        axis={isLandscape ? "x" : "y"} 
        values={players} 
        onReorder={setPlayers} 
        className={`flex mt-20 md:mt-16 w-full ${
          isLandscape 
            ? "flex-row justify-center items-stretch gap-6" 
            : "flex-col items-center gap-10"
        }`}
      >
        {players.map((player, index) => (
          <div key={player.id} className={isLandscape ? "w-[280px] lg:w-[320px] shrink-0" : "w-full max-w-sm"}>
            <DraggablePlayerCard
              player={player}
              index={index}
              currentGame={currentGame}
              playerStats={getPlayerStats(player.name)}
              onRegister={onRegister}
              onWin={onWin}
            />
          </div>
        ))}
      </Reorder.Group>
    </main>
  );
}
