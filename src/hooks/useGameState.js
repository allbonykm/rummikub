import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveGameRecord, undoLastRecord, fetchStats } from '../utils/api';

/**
 * 게임 상태 관리 훅
 * - 등록(firstRegister)과 승리(winner) 기록
 * - 로컬 기록 스택과 구글 시트 연동
 */
export default function useGameState() {
  const [currentGame, setCurrentGame] = useState({
    id: uuidv4(),
    players: [],
    firstRegister: null,
    winner: null,
    startTime: null,
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 서버에서 전체 기록 가져오기 (초기 로딩 및 동기화)
  const syncWithServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const serverData = await fetchStats();
      let records = [];
      
      if (Array.isArray(serverData)) {
        records = serverData;
      } else if (serverData && serverData.data && Array.isArray(serverData.data)) {
        records = serverData.data;
      } else if (serverData && serverData.records && Array.isArray(serverData.records)) {
        records = serverData.records;
      }

      if (records.length > 0) {
        // 서버 데이터는 appendRow로 인해 과거->최신 순이므로 역순(최신순)으로 정렬
        const formattedData = [...records].reverse();
        setHistory(formattedData);
      }
    } catch (e) {
      console.error('[Sync] 서버 동기화 실패:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  // 기록 변경 시 로컬 스토리지 저장 (백업용)
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('elite-tracker-history', JSON.stringify(history));
    }
  }, [history]);

  /**
   * 최초 등록자 기록
   */
  const registerFirst = useCallback((playerName) => {
    setCurrentGame((prev) => ({
      ...prev,
      firstRegister: prev.firstRegister || playerName,
      startTime: prev.startTime || new Date().toISOString(),
    }));
  }, []);

  /**
   * 승리자 기록 및 구글 시트 전송
   */
  const recordWin = useCallback(async (playerName, activePlayers, gameTurn = 0) => {
    setIsLoading(true);
    const now = new Date();

    const record = {
      id: currentGame.id,
      timestamp: now.toISOString(),
      players: activePlayers.map((p) => p.name).join(','),
      firstRegister: currentGame.firstRegister || '',
      winner: playerName,
      duration: currentGame.startTime
        ? Math.round((now - new Date(currentGame.startTime)) / 1000)
        : 0,
      gameTurn: gameTurn,
    };

    try {
      await saveGameRecord(record);
      setHistory((prev) => [record, ...prev]);
    } catch (e) {
      // 오프라인 시에도 로컬에 저장
      setHistory((prev) => [{ ...record, offline: true }, ...prev]);
    }

    // 새 게임 준비
    setCurrentGame({
      id: uuidv4(),
      players: [],
      firstRegister: null,
      winner: null,
      startTime: null,
    });

    setIsLoading(false);
    return record;
  }, [currentGame]);

  /**
   * 최근 기록 Undo
   */
  const undoLast = useCallback(async () => {
    if (history.length === 0) return;
    setIsLoading(true);

    const lastRecord = history[0];
    try {
      await undoLastRecord(lastRecord.id);
    } catch (e) {
      // 무시
    }

    setHistory((prev) => prev.slice(1));
    setIsLoading(false);
  }, [history]);

  /**
   * 통계 계산
   */
  const getStats = useCallback(() => {
    const wins = {};
    const registers = {};
    const registerWins = {};

    history.forEach((record) => {
      // 승수 계산
      if (record.winner) {
        wins[record.winner] = (wins[record.winner] || 0) + 1;
      }
      // 등록 횟수
      if (record.firstRegister) {
        registers[record.firstRegister] = (registers[record.firstRegister] || 0) + 1;
        // 등록 후 승리
        if (record.firstRegister === record.winner) {
          registerWins[record.firstRegister] = (registerWins[record.firstRegister] || 0) + 1;
        }
      }
    });

    // MVP 정렬
    const mvpRanking = Object.entries(wins)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, wins: count }));

    // 등록 승률
    const registerRate = {};
    Object.keys(registers).forEach((name) => {
      registerRate[name] = Math.round(
        ((registerWins[name] || 0) / registers[name]) * 100
      );
    });

    return { wins, mvpRanking, registerRate, totalGames: history.length };
  }, [history]);

  return {
    currentGame,
    history,
    isLoading,
    registerFirst,
    recordWin,
    undoLast,
    getStats,
    refreshStats: syncWithServer,
  };
}
