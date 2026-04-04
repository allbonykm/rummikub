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
          className={`absolute top-3 right-8 md:right-12 z-30 px-8 py-4 rounded-2xl text-lg font-bold font-label tracking-wider transition-all duration-200 active:scale-95 shadow-lg border-2 flex items-center gap-3 ${
            timer.isPaused
              ? 'bg-primary-container/90 text-white border-primary-container/50 hover:bg-primary-container shadow-primary-container/20'
              : 'bg-surface-container-high/80 text-yellow-400 border-yellow-500/30 hover:bg-surface-container-highest backdrop-blur-sm shadow-yellow-500/10'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
            {timer.isPaused ? 'play_arrow' : 'pause'}
          </span>
          {timer.isPaused ? 'Resume' : 'Pause'}
        </button>
      )}

      {/* Turn 카운트 표시 */}
      {hasGameStarted && (
        <div className="absolute top-3 left-8 md:left-12 z-30 flex items-center gap-3 bg-surface-container-high/60 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/10">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '24px' }}>replay</span>
          <span className="text-base font-bold font-label tracking-wider text-on-surface-variant">
            Turn <span className="text-on-surface text-2xl font-black">{turnCount}</span>
          </span>
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
