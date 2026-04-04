import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopNav, BottomNav } from './components/Layout/Navigation';
import ArenaPage from './components/Arena/ArenaPage';
import PlayerSelection from './components/Arena/PlayerSelection';
import WinModal from './components/Arena/WinModal';
import StatsPage from './components/Stats/StatsPage';
import VaultPage from './components/Vault/VaultPage';
import useTimer from './hooks/useTimer';
import useWakeLock from './hooks/useWakeLock';
import useGameState from './hooks/useGameState';
import { PLAYERS } from './utils/players';

function App() {
  const [activeTab, setActiveTab] = useState('arena');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [orderedPlayers, setOrderedPlayers] = useState([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const timer = useTimer(60);
  const wakeLock = useWakeLock();
  const gameState = useGameState();

  // 플레이어 차례 및 턴 관리 (ArenaPage에서 사용)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [turnCount, setTurnCount] = useState(1);
  const [hasGameStarted, setHasGameStarted] = useState(false);

  // 승리 모달 상태
  const [winModal, setWinModal] = useState({
    isOpen: false,
    winner: '',
    duration: 0,
    turnCount: 0,
  });

  // Wake Lock 자동 요청
  useEffect(() => {
    if (wakeLock.isSupported && !wakeLock.isActive) {
      wakeLock.request();
    }
  }, [wakeLock.isSupported]);

  // 플레이어 선택 토글
  const handleTogglePlayer = (id) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // 게임 시작
  const handleStartGame = () => {
    if (selectedPlayerIds.length >= 2) {
      if (orderedPlayers.length === 0 || orderedPlayers.length !== selectedPlayerIds.length) {
        const initialOrdered = PLAYERS.filter((p) => selectedPlayerIds.includes(p.id));
        setOrderedPlayers(initialOrdered);
      }
      setIsGameActive(true);
      // 턴 관련 상태 초기화
      setCurrentPlayerIndex(0);
      setTurnCount(1);
      setHasGameStarted(false);
    }
  };

  // 플레이어 재선택 (리셋)
  const handleResetPlayers = () => {
    setIsGameActive(false);
    timer.stop();
    setCurrentPlayerIndex(0);
    setTurnCount(1);
    setHasGameStarted(false);
    setWinModal((prev) => ({ ...prev, isOpen: false }));
  };

  const selectedPlayers = PLAYERS.filter((p) => selectedPlayerIds.includes(p.id));

  // 등록 처리
  const handleRegister = (playerName) => {
    gameState.registerFirst(playerName);
  };

  // 승리 처리
  const handleWin = async (playerName) => {
    // 타이머 정지
    timer.stop();

    // 게임 시간 계산
    const now = new Date();
    const duration = gameState.currentGame.startTime
      ? Math.round((now - new Date(gameState.currentGame.startTime)) / 1000)
      : 0;

    // 1. 승리 축포 애니메이션
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#E6192E', '#E9C400', '#111114', '#FFFFFF', '#FFD700'],
        zIndex: 9999
      });
    });

    // 2. 커스텀 모달 표시 (window.confirm 대체)
    setTimeout(() => {
      setWinModal({
        isOpen: true,
        winner: playerName,
        duration,
        turnCount,
      });
    }, 400);

    // 3. 승리 기록 저장 (API 및 로컬) - gameTurn 포함
    await gameState.recordWin(playerName, selectedPlayers, turnCount);
  };

  // 새 게임 시작 (같은 멤버)
  const handleNewGame = () => {
    const winnerName = winModal.winner;
    setWinModal((prev) => ({ ...prev, isOpen: false }));

    // 승리자를 맨 위(1번) 자리로 스와핑
    setOrderedPlayers((prev) => {
      const winnerIndex = prev.findIndex((p) => p.name === winnerName);
      if (winnerIndex <= 0) return prev;
      const newOrder = [...prev];
      const [winnerItem] = newOrder.splice(winnerIndex, 1);
      newOrder.unshift(winnerItem);
      return newOrder;
    });

    // 턴 관련 상태 초기화
    setCurrentPlayerIndex(0);
    setTurnCount(1);
    setHasGameStarted(false);
  };

  // Undo 처리
  const handleUndo = async () => {
    await gameState.undoLast();
  };

  const stats = gameState.getStats();

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 },
  };

  return (
    <div className="min-h-dvh bg-surface text-on-surface font-body selection:bg-primary/30">
      {/* Top Navigation */}
      <TopNav
        onUndo={handleUndo}
        canUndo={gameState.history.length > 0}
        onReset={handleResetPlayers}
        isGameActive={isGameActive}
      />

      {/* Page Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'arena' && (
          <motion.div
            key="arena"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center"
          >
            {!isGameActive ? (
              <PlayerSelection
                selectedIds={selectedPlayerIds}
                onToggle={handleTogglePlayer}
                onStart={handleStartGame}
              />
            ) : (
              <ArenaPage
                timer={timer}
                players={orderedPlayers}
                setPlayers={setOrderedPlayers}
                currentGame={gameState.currentGame}
                history={gameState.history}
                onRegister={handleRegister}
                onWin={handleWin}
                turnCount={turnCount}
                setTurnCount={setTurnCount}
                currentPlayerIndex={currentPlayerIndex}
                setCurrentPlayerIndex={setCurrentPlayerIndex}
                hasGameStarted={hasGameStarted}
                setHasGameStarted={setHasGameStarted}
              />
            )}
          </motion.div>
        )}
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center"
          >
            <StatsPage stats={stats} />
          </motion.div>
        )}
        {activeTab === 'vault' && (
          <motion.div
            key="vault"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center"
          >
            <VaultPage history={gameState.history} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 승리 커스텀 모달 */}
      <WinModal
        isOpen={winModal.isOpen}
        winner={winModal.winner}
        duration={winModal.duration}
        turnCount={winModal.turnCount}
        onNewGame={handleNewGame}
        onReset={handleResetPlayers}
      />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
