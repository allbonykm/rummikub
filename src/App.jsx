import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopNav, BottomNav } from './components/Layout/Navigation';
import ArenaPage from './components/Arena/ArenaPage';
import PlayerSelection from './components/Arena/PlayerSelection';
import StatsPage from './components/Stats/StatsPage';
import VaultPage from './components/Vault/VaultPage';
import useTimer from './hooks/useTimer';
import useWakeLock from './hooks/useWakeLock';
import useGameState from './hooks/useGameState';
import { PLAYERS } from './utils/players';

function App() {
  const [activeTab, setActiveTab] = useState('arena');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const timer = useTimer(60);
  const wakeLock = useWakeLock();
  const gameState = useGameState();

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
      setIsGameActive(true);
    }
  };

  // 플레이어 재선택 (리셋)
  const handleResetPlayers = () => {
    setIsGameActive(false);
    timer.stop();
  };

  const selectedPlayers = PLAYERS.filter((p) => selectedPlayerIds.includes(p.id));

  // 등록 처리
  const handleRegister = (playerName) => {
    gameState.registerFirst(playerName);
  };

  // 승리 처리
  const handleWin = async (playerName) => {
    await gameState.recordWin(playerName, selectedPlayers);
    timer.stop();
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
                players={selectedPlayers}
                currentGame={gameState.currentGame}
                onRegister={handleRegister}
                onWin={handleWin}
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

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
