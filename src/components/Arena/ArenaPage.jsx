import { useState, useEffect } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import Timer from './Timer';
import PlayerCard from './PlayerCard';

/**
 * 드래그 핸들을 분리하여 모바일 스크롤 간섭을 막는 커스텀 Reorder 아이템
 */
function DraggablePlayerCard({ player, index, currentGame, playerStats, onRegister, onWin, className, isCurrentTurn }) {
  const controls = useDragControls();

  return (
    <Reorder.Item value={player} dragListener={false} dragControls={controls} className={className}>
      <PlayerCard
        player={player}
        index={index}
        isFirstRegistered={currentGame.firstRegister === player.name}
        isWinner={currentGame.winner === player.name}
        isCurrentTurn={isCurrentTurn}
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
 * - Pause/Resume 버튼
 * - 현재 플레이어 차례 표시 (currentPlayerIndex)
 * - Turn 카운트 (모든 플레이어 1바퀴 = 1 Turn)
 */
export default function ArenaPage({
  timer,
  players,
  setPlayers,
  currentGame,
  history,
  onRegister,
  onWin,
  turnCount,
  setTurnCount,
  currentPlayerIndex,
  setCurrentPlayerIndex,
  hasGameStarted,
  setHasGameStarted,
}) {
  // 타이머 토글 (RE-COUNT → 다음 플레이어)
  const handleTimerToggle = () => {
    timer.reset();

    if (!hasGameStarted) {
      // 첫 START: 0번 플레이어 차례, Turn 1
      setHasGameStarted(true);
      setCurrentPlayerIndex(0);
      setTurnCount(1);
    } else {
      // RE-COUNT: 다음 플레이어로
      const nextIndex = (currentPlayerIndex + 1) % players.length;
      setCurrentPlayerIndex(nextIndex);

      // 1번 플레이어(index 0)로 돌아오면 새 Turn
      if (nextIndex === 0) {
        setTurnCount((prev) => prev + 1);
      }
    }
  };

  // Pause / Resume 핸들러
  const handlePauseResume = () => {
    if (timer.isPaused) {
      timer.resume();
    } else {
      timer.pause();
    }
  };

  // Pause 버튼 표시 조건: 타이머가 진행 중이거나 일시정지 중일 때
  const showPauseButton = timer.isRunning || timer.isPaused;

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
        // GAS에서 isDeleted가 문자열 'TRUE'/'FALSE'로 내려올 수 있으므로 방어 코드 작성
        const isDeleted = record.isDeleted === true || String(record.isDeleted).toUpperCase() === 'TRUE';

        if (record.winner === playerName && !isDeleted) {
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
    <main className="max-w-[1400px] w-full mx-auto px-8 md:px-12 pt-12 relative" style={{ paddingBottom: 'calc(180px + env(safe-area-inset-bottom))' }}>
      {/* Pause / Resume 버튼 (우측 상단) */}
      {showPauseButton && (
        <button
          onClick={handlePauseResume}
          className={`absolute top-[216px] -translate-y-1/2 right-8 md:right-16 z-30 w-32 h-32 rounded-full text-lg font-bold font-label tracking-wider transition-all duration-200 active:scale-95 shadow-2xl border-4 flex flex-col items-center justify-center gap-1 ${timer.isPaused
            ? 'bg-primary-container text-white border-primary-container/50 hover:bg-primary-container/90 shadow-primary-container/30'
            : 'bg-surface-container-high/90 text-yellow-400 border-yellow-500/40 hover:bg-surface-container-highest backdrop-blur-md shadow-yellow-500/20'
            }`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
            {timer.isPaused ? 'play_arrow' : 'pause'}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.1em] mt-1">
            {timer.isPaused ? 'RESUME' : 'PAUSE'}
          </span>
        </button>
      )}

      {/* Turn 카운트 표시 */}
      {hasGameStarted && (
        <div className="absolute top-[220px] -translate-y-1/2 left-8 md:left-12 z-30 flex flex-row items-center justify-center bg-surface-container-high/60 backdrop-blur-md px-8 py-6 rounded-[32px] border-2 border-white/10 shadow-2xl min-w-[140px]">
          <div className="flex flex-col items-center gap-0">
            <span className="text-[11px] font-black font-label uppercase tracking-[0.2em] text-on-surface-variant/60 leading-none mb-1 text-center">Turn</span>
            <span className="text-5xl font-black font-headline text-on-surface leading-none text-center">
              {turnCount}
            </span>
          </div>
        </div>
      )}

      {/* Timer Section */}
      <Timer
        seconds={timer.seconds}
        isRunning={timer.isRunning}
        isPaused={timer.isPaused}
        isAlarm={timer.isAlarm}
        progress={timer.progress}
        onToggle={handleTimerToggle}
      />

      {/* spacer to force gap */}
      <div className="h-8" aria-hidden="true"></div>

      {/* Player List (Drag & Drop Reorder) */}
      <Reorder.Group
        axis={isLandscape ? "x" : "y"}
        values={players}
        onReorder={setPlayers}
        className={`flex mt-20 pt-40 md:pt-32 w-full ${isLandscape
          ? "flex-row justify-center items-stretch gap-6"
          : "flex-col items-center gap-10"
          }`}
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
            isCurrentTurn={hasGameStarted && index === currentPlayerIndex}
            className={isLandscape ? "w-[280px] lg:w-[320px] shrink-0" : "w-[88%] max-w-[340px]"}
          />
        ))}
      </Reorder.Group>
    </main>
  );
}
