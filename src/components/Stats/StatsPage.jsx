import { motion } from 'framer-motion';
import { PLAYERS } from '../../utils/players';

/**
 * Stats 페이지 - MVP 단상 + 통계 시각화
 */
export default function StatsPage({ stats }) {
  const { mvpRanking, registerRate, totalGames } = stats;

  const podiumOrder = [1, 0, 2]; // 2등, 1등, 3등 순서로 배치
  const podiumHeights = ['h-32', 'h-48', 'h-24'];
  const podiumSizes = ['w-20 h-20 md:w-24 md:h-24', 'w-24 h-24 md:w-32 md:h-32', 'w-16 h-16 md:w-20 md:h-20'];
  const podiumColors = ['border-secondary-container', 'border-tertiary', 'border-primary-container'];
  const podiumRingColors = ['ring-secondary-container/20', 'ring-tertiary/10', 'ring-primary-container/20'];
  const podiumLabels = ['2등', '1등', '3등'];
  const podiumLabelBg = ['bg-secondary-container text-on-secondary-container', 'bg-tertiary text-on-tertiary', 'bg-primary-container text-on-primary-container'];
  const podiumTextColors = ['text-secondary', 'text-tertiary', 'text-primary'];
  const podiumBarWidths = ['w-20 md:w-28', 'w-24 md:w-36', 'w-16 md:w-24'];

  const top3 = mvpRanking.slice(0, 3);

  // 등록 승률 평균
  const rates = Object.values(registerRate);
  const avgRate = rates.length > 0 ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;

  // 라이벌 데이터 (상위 2명의 상대 전적)
  const rivalData = [];
  if (top3.length >= 2) {
    const totalBetween = totalGames > 0 ? totalGames : 1;
    rivalData.push({
      name: top3[0].name,
      rate: Math.round((top3[0].wins / totalBetween) * 100),
      player: PLAYERS.find((p) => p.name === top3[0].name),
    });
    if (top3[1]) {
      rivalData.push({
        name: top3[1].name,
        rate: Math.round((top3[1].wins / totalBetween) * 100),
        player: PLAYERS.find((p) => p.name === top3[1].name),
      });
    }
  }

  return (
    <main className="pt-20 pb-40 px-6 md:px-10 max-w-7xl mx-auto space-y-24">
      {/* Header */}
      <header className="space-y-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-surface-container-high rounded-full border border-white/5 shadow-inner">
          <span className="w-3 h-3 rounded-full bg-tertiary animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em] font-label text-tertiary">
            TOTAL {totalGames} BATTLES RECORDED
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black font-headline tracking-tighter italic">
          실시간 랭킹 & 통계
        </h2>
      </header>

      {/* Bento Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Podium */}
        <div className="lg:col-span-7 bg-surface-container-low rounded-[3rem] p-12 md:p-16 relative overflow-hidden flex flex-col items-center justify-end min-h-[500px] border border-white/5 shadow-2xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-tertiary/20 via-surface-container-low to-primary/20" />
          </div>

          {top3.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-6xl text-tertiary/40">
                  emoji_events
                </span>
              </div>
              <p className="text-on-surface-variant text-xl font-medium opacity-50">아직 새겨진 기록이 없습니다</p>
            </div>
          ) : (
            <div className="w-full flex items-end justify-center gap-6 md:gap-12 mb-6">
              {podiumOrder.map((orderIdx, displayIdx) => {
                const entry = top3[orderIdx];
                if (!entry) return <div key={displayIdx} className={podiumBarWidths[displayIdx]} />;

                const initials = entry.name.charAt(0);

                return (
                  <motion.div
                    key={entry.name}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: displayIdx * 0.2, type: 'spring', stiffness: 80 }}
                    className={`flex flex-col items-center group ${orderIdx === 0 ? '-mb-6' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="mb-6 relative">
                      <div className={`${podiumSizes[displayIdx]} rounded-full border-4 ${podiumColors[displayIdx]} overflow-hidden ring-8 ${podiumRingColors[displayIdx]} bg-surface-container-highest flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.4)]`}>
                        <span className="text-2xl md:text-4xl font-black font-headline text-on-surface">
                          {initials}
                        </span>
                      </div>
                      {/* Rank label */}
                      <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 ${podiumLabelBg[displayIdx]} px-4 py-1 rounded-full text-xs font-black shadow-xl border-2 border-surface`}>
                        {podiumLabels[displayIdx]}
                      </div>
                    </div>

                    {/* Podium bar */}
                    <div className={`${podiumHeights[displayIdx]} ${podiumBarWidths[displayIdx]} bg-gradient-to-b from-surface-container-highest to-surface-container-low rounded-t-[2rem] flex flex-col items-center justify-start pt-6 md:pt-10 shadow-3xl transition-all duration-500 group-hover:-translate-y-4`}>
                      <span className={`text-3xl md:text-5xl font-black font-headline ${podiumTextColors[displayIdx]}`}>
                        {entry.wins}
                      </span>
                      <span className={`text-xs uppercase font-black tracking-[0.3em] mt-2 ${podiumTextColors[displayIdx]}/50`}>
                        WINS
                      </span>
                      <div className="mt-4 text-xs font-black text-white/40 tracking-tighter">{entry.name}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Stats Cards */}
        <div className="lg:col-span-5 flex flex-col gap-12">
          {/* Efficiency Metric */}
          <div className="bg-surface-container-low rounded-[2.5rem] p-12 flex flex-col justify-between border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary-container" />
            <div className="space-y-4">
              <h3 className="text-xs font-black font-label tracking-[0.3em] text-primary-container/70 uppercase">
                EFFICIENCY METRIC
              </h3>
              <p className="text-3xl font-black font-headline italic tracking-tighter">첫 등록시 승리 비율</p>
            </div>
            <div className="flex items-center gap-10 mt-10">
              {/* Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="54" fill="transparent" stroke="var(--color-surface-container-highest)" strokeWidth="12" />
                  <circle
                    cx="64" cy="64" r="54"
                    fill="transparent"
                    stroke="var(--color-primary-container)"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - avgRate / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black font-headline tracking-tighter">{avgRate}%</span>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <p className="text-base text-on-surface-variant/70 leading-relaxed font-medium italic">
                  "첫 등록이 빠를수록 전장 지배력이 수직 상승합니다."
                </p>
              </div>
            </div>
          </div>

          {/* Rivalry Analysis */}
          <div className="bg-surface-container-low rounded-[2.5rem] p-12 space-y-10 border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-secondary-container" />
            <div className="space-y-4">
              <h3 className="text-xs font-black font-label tracking-[0.3em] text-secondary-container/70 uppercase">
                RIVALRY ANALYSIS
              </h3>
              <p className="text-3xl font-black font-headline italic tracking-tighter">승률 분포</p>
            </div>
            <div className="space-y-8">
              {mvpRanking.slice(0, 4).map((entry, idx) => {
                const rate = totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : 0;
                return (
                  <div key={entry.name} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-black font-headline text-on-surface italic">
                        {idx + 1}. {entry.name}
                      </span>
                      <span className="text-secondary font-black text-sm tracking-widest">{rate}% WIN RATE</span>
                    </div>
                    <div className="h-4 bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${rate}%` }}
                        transition={{ duration: 1, delay: idx * 0.15, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-secondary-container to-secondary rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
              {mvpRanking.length === 0 && (
                <div className="py-10 text-center italic opacity-30">
                  데이터 수집 중...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
