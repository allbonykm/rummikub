import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopNav, BottomNav } from './components/Layout/Navigation';
import ArenaPage from './components/Arena/ArenaPage';
import StatsPage from './components/Stats/StatsPage';
import VaultPage from './components/Vault/VaultPage';
import useTimer from './hooks/useTimer';
import useWakeLock from './hooks/useWakeLock';
import useGameState from './hooks/useGameState';
import { PLAYERS } from './utils/players';

function App() {
  const [activeTab, setActiveTab] = useState('arena');
  const timer = useTimer(60);
  const wakeLock = useWakeLock();
  const gameState = useGameState();

  // Wake Lock 자동 요청
  useEffect(() => {
    if (wakeLock.isSupported && !wakeLock.isActive) {
      wakeLock.request();
    }
  }, [wakeLock.isSupported]);

  // 등록 처리
  const handleRegister = (playerName) => {
    gameState.registerFirst(playerName);
  };

  // 승리 처리
  const handleWin = async (playerName) => {
    await gameState.recordWin(playerName, PLAYERS);
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
      <TopNav onUndo={handleUndo} canUndo={gameState.history.length > 0} />

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
          >
            <ArenaPage
              timer={timer}
              currentGame={gameState.currentGame}
              onRegister={handleRegister}
              onWin={handleWin}
            />
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
