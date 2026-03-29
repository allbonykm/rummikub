import { motion } from 'framer-motion';
import { Clock, Trophy, User } from 'lucide-react';

/**
 * Vault 페이지 - 경기 기록 보관함
 */
export default function VaultPage({ history }) {
  const formatDate = (ts) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '-';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <main className="pt-4 pb-32 px-4 md:px-6 max-w-4xl mx-auto space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tighter">
          경기 기록
        </h2>
        <p className="text-sm text-on-surface-variant">
          총 {history.length}경기의 기록이 보관되어 있습니다.
        </p>
      </header>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="material-symbols-outlined text-5xl text-surface-container-highest">
            inventory_2
          </span>
          <p className="text-on-surface-variant text-sm">아직 기록된 경기가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record, index) => (
            <motion.div
              key={record.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 flex items-center gap-4"
            >
              {/* 순서 */}
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface-variant flex-shrink-0">
                {history.length - index}
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy size={14} className="text-tertiary flex-shrink-0" />
                  <span className="font-bold font-headline text-sm truncate">
                    {record.winner} 승리
                  </span>
                  {record.offline && (
                    <span className="text-[9px] bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-bold">
                      OFFLINE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
                  {record.firstRegister && (
                    <span className="flex items-center gap-1">
                      <User size={10} />
                      등록: {record.firstRegister}
                    </span>
                  )}
                  {record.duration > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {formatDuration(record.duration)}
                    </span>
                  )}
                </div>
              </div>

              {/* 시간 */}
              <span className="text-[10px] text-on-surface-variant/50 flex-shrink-0">
                {formatDate(record.timestamp)}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
