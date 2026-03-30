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
    <main className="pt-10 md:pt-20 pb-40 px-4 md:px-10 max-w-7xl mx-auto space-y-16 md:space-y-24">
      {/* Header */}
      <header className="space-y-4 md:space-y-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-1.5 md:px-5 md:py-2 bg-surface-container-high rounded-full border border-white/5 shadow-inner">
          <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-tertiary animate-pulse" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] font-label text-tertiary">
            TOTAL {totalGames} BATTLES RECORDED
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black font-headline tracking-tighter italic">
          실시간 랭킹 & 통계
        </h2>
      </header>

      {/* Bento Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Podium */}
        <div className="lg:col-span-7 bg-surface-container-low rounded-3xl md:rounded-[3rem] lg:rounded-[4rem] p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col items-center justify-end min-h-[400px] md:min-h-[500px] border border-white/5 shadow-2xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-tertiary/20 via-surface-container-low to-primary/20" />
          </div>

          {top3.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 md:gap-8">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-surface-container-highest flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-4xl md:text-6xl text-tertiary/40">
                  emoji_events
                </span>
              </div>
              <p className="text-on-surface-variant text-lg md:text-xl font-medium opacity-50">아직 새겨진 기록이 없습니다</p>
            </div>
          ) : (
            <div className="w-full flex items-end justify-center gap-3 md:gap-6 lg:gap-12 mb-4 md:mb-6">
              {podiumOrder.map((orderIdx, displayIdx) => {
                const entry = top3[orderIdx];
                if (!entry) return <div key={displayIdx} className={podiumBarWidths[displayIdx]} />;

                const initials = entry.name.charAt(0);

                return (
                  <motion.div
                    key={entry.name}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: displayIdx * 0.2, type: 'spring', stiffness: 80 }}
                    className={`flex flex-col items-center group ${orderIdx === 0 ? '-mb-4 md:-mb-6' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="mb-4 md:mb-6 relative">
                      <div className={`${podiumSizes[displayIdx]} rounded-full border-4 ${podiumColors[displayIdx]} overflow-hidden ring-4 md:ring-8 ${podiumRingColors[displayIdx]} bg-surface-container-highest flex items-center justify-center shadow-xl md:shadow-[0_20px_50px_rgba(0,0,0,0.4)]`}>
                        <span className="text-xl md:text-2xl lg:text-4xl font-black font-headline text-on-surface">
                          {initials}
                        </span>
                      </div>
                      {/* Rank label */}
                      <div className={`absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 ${podiumLabelBg[displayIdx]} px-3 md:px-4 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-black shadow-xl border-2 border-surface`}>
                        {podiumLabels[displayIdx]}
                      </div>
                    </div>

                    {/* Podium bar */}
                    <div className={`${podiumHeights[displayIdx]} ${podiumBarWidths[displayIdx]} bg-gradient-to-b from-surface-container-highest to-surface-container-low rounded-t-[1.5rem] md:rounded-t-[2rem] flex flex-col items-center justify-start pt-4 md:pt-6 lg:pt-10 shadow-2xl md:shadow-3xl transition-all duration-500 group-hover:-translate-y-4`}>
                      <span className={`text-2xl md:text-3xl lg:text-5xl font-black font-headline ${podiumTextColors[displayIdx]}`}>
                        {entry.wins}
                      </span>
                      <span className={`text-[10px] md:text-xs uppercase font-black tracking-[0.2em] md:tracking-[0.3em] mt-1 md:mt-2 ${podiumTextColors[displayIdx]}/50`}>
                        WINS
                      </span>
                      <div className="mt-2 md:mt-4 text-[10px] md:text-xs font-black text-white/40 tracking-tighter">{entry.name}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Stats Cards */}
        <div className="lg:col-span-5 flex flex-col gap-8 md:gap-16 lg:gap-24">
          {/* Efficiency Metric */}
          <div className="bg-surface-container-low rounded-3xl md:rounded-[4rem] p-12 md:p-16 lg:p-20 flex flex-col justify-between border-t border-r border-b border-white/5 border-l-8 md:border-l-[16px] lg:border-l-[20px] border-l-primary-container shadow-2xl min-h-[350px] md:min-h-[500px] lg:min-h-[600px] transition-all duration-500 hover:scale-[1.01]">
            <div className="space-y-4 md:space-y-8 text-left">
              <h3 className="text-[10px] md:text-sm font-black font-label tracking-[0.3em] md:tracking-[0.5em] text-primary-container/80 uppercase">
                EFFICIENCY METRIC
              </h3>
              <p className="text-3xl md:text-4xl lg:text-6xl font-black font-headline italic tracking-tighter leading-tight md:leading-[1.1]">첫 등록시<br className="hidden md:block" /> 승리 비율</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-16 mt-8 md:mt-auto">
              {/* Gauge */}
              <div className="relative w-32 h-32 md:w-44 md:h-44 flex items-center justify-center flex-shrink-0">
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
                  <span className="text-3xl md:text-5xl font-black font-headline tracking-tighter">{avgRate}%</span>
                </div>
              </div>
              <div className="space-y-3 md:space-y-8 flex-1 text-center sm:text-left">
                <p className="text-base md:text-xl text-on-surface-variant/80 font-medium italic leading-relaxed">
                  "빠른 등록은 승리로 가는 가장 확실한 전략입니다."
                </p>
              </div>
            </div>
          </div>

          {/* Rivalry Analysis */}
          <div className="bg-surface-container-low rounded-3xl md:rounded-[4rem] p-12 md:p-16 lg:p-20 space-y-8 md:space-y-16 border-t border-r border-b border-white/5 border-l-8 md:border-l-[16px] lg:border-l-[20px] border-l-secondary-container shadow-2xl min-h-[350px] md:min-h-[500px] lg:min-h-[600px] transition-all duration-500 hover:scale-[1.01]">
            <div className="space-y-4 md:space-y-8 text-left">
              <h3 className="text-[10px] md:text-sm font-black font-label tracking-[0.3em] md:tracking-[0.5em] text-secondary-container/80 uppercase">
                RIVALRY ANALYSIS
              </h3>
              <p className="text-3xl md:text-4xl lg:text-6xl font-black font-headline italic tracking-tighter leading-tight md:leading-[1.1]">승률 분포</p>
            </div>
            <div className="space-y-6 md:space-y-12">
              {mvpRanking.slice(0, 4).map((entry, idx) => {
                const rate = totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : 0;
                return (
                  <div key={entry.name} className="space-y-2 md:space-y-5">
                    <div className="flex justify-between items-end">
                      <span className="text-lg md:text-2xl font-black font-headline text-on-surface italic">
                        {idx + 1}. {entry.name}
                      </span>
                      <span className="text-secondary font-black text-[10px] md:text-lg tracking-widest">{rate}% WIN RATE</span>
                    </div>
                    <div className="h-5 md:h-8 bg-surface-container-highest rounded-full overflow-hidden shadow-inner p-1 md:p-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${rate}%` }}
                        transition={{ duration: 1.2, delay: idx * 0.2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-secondary-container to-secondary rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
              {mvpRanking.length === 0 && (
                <div className="py-12 md:py-24 text-center italic text-xl md:text-2xl opacity-20 flex flex-col items-center gap-4 md:gap-6">
                  <div className="w-12 md:w-16 h-1 md:h-1.5 bg-white/10 rounded-full animate-pulse" />
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
