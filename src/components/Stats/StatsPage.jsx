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
    <main className="pt-4 pb-32 px-4 md:px-6 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/15">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          <span className="text-[10px] font-bold uppercase tracking-tighter font-label text-tertiary">
            총 {totalGames}경기 기록
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tighter">
          실시간 랭킹 & 통계
        </h2>
      </header>

      {/* Bento Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Podium */}
        <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-6 md:p-8 relative overflow-hidden flex flex-col items-center justify-end min-h-[380px]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-tertiary/20 via-transparent to-primary/20" />
          </div>

          {top3.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <span className="material-symbols-outlined text-5xl text-surface-container-highest">
                emoji_events
              </span>
              <p className="text-on-surface-variant text-sm">아직 경기 기록이 없습니다</p>
            </div>
          ) : (
            <div className="w-full flex items-end justify-center gap-4 md:gap-8 mb-4">
              {podiumOrder.map((orderIdx, displayIdx) => {
                const entry = top3[orderIdx];
                if (!entry) return <div key={displayIdx} className={podiumBarWidths[displayIdx]} />;

                const player = PLAYERS.find((p) => p.name === entry.name);
                const initials = entry.name.charAt(0);

                return (
                  <motion.div
                    key={entry.name}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: displayIdx * 0.2, type: 'spring', stiffness: 100 }}
                    className={`flex flex-col items-center group ${orderIdx === 0 ? '-mb-4' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="mb-3 relative">
                      <div className={`${podiumSizes[displayIdx]} rounded-full border-4 ${podiumColors[displayIdx]} overflow-hidden ring-4 ${podiumRingColors[displayIdx]} bg-surface-container-highest flex items-center justify-center`}>
                        <span className="text-xl md:text-2xl font-bold font-headline text-on-surface">
                          {initials}
                        </span>
                      </div>
                      {/* Crown for 1st */}
                      {orderIdx === 0 && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                          <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            workspace_premium
                          </span>
                        </div>
                      )}
                      {/* Rank label */}
                      <div className={`absolute -bottom-2 -right-2 ${podiumLabelBg[displayIdx]} px-2 py-0.5 rounded-lg text-[10px] font-bold`}>
                        {podiumLabels[displayIdx]}
                      </div>
                    </div>

                    {/* Podium bar */}
                    <div className={`${podiumHeights[displayIdx]} ${podiumBarWidths[displayIdx]} bg-surface-container-highest rounded-t-xl flex flex-col items-center justify-start pt-3 md:pt-4 shadow-xl transition-transform group-hover:-translate-y-2`}>
                      <span className={`text-2xl md:text-3xl font-black font-headline ${podiumTextColors[displayIdx]}`}>
                        {entry.wins}
                      </span>
                      <span className={`text-[9px] uppercase font-label tracking-widest ${podiumTextColors[displayIdx]}/70`}>
                        WINS
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Stats Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Efficiency Metric */}
          <div className="bg-surface-container-low rounded-xl p-6 md:p-8 flex flex-col justify-between border-l-4 border-primary-container">
            <div className="space-y-1">
              <h3 className="text-xs font-bold font-label tracking-widest text-on-surface-variant uppercase">
                Efficiency Metric
              </h3>
              <p className="text-lg font-bold font-headline">첫 등록시 승리 비율</p>
            </div>
            <div className="flex items-center gap-6 py-4">
              {/* Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="52" fill="transparent" stroke="var(--color-surface-container-highest)" strokeWidth="8" />
                  <circle
                    cx="64" cy="64" r="52"
                    fill="transparent"
                    stroke="var(--color-primary-container)"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - avgRate / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black font-headline">{avgRate}%</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-xs text-on-surface-variant/60 leading-relaxed">
                  첫 등록이 빠를수록 후반부 타일 운영에서 압도적인 우위를 점하는 경향을 보입니다.
                </p>
              </div>
            </div>
          </div>

          {/* Rivalry Analysis */}
          <div className="bg-surface-container-low rounded-xl p-6 md:p-8 space-y-5 border-l-4 border-secondary-container">
            <div className="space-y-1">
              <h3 className="text-xs font-bold font-label tracking-widest text-on-surface-variant uppercase">
                Rivalry Analysis
              </h3>
              <p className="text-lg font-bold font-headline">승률 분포</p>
            </div>
            <div className="space-y-4">
              {mvpRanking.slice(0, 4).map((entry) => {
                const rate = totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : 0;
                return (
                  <div key={entry.name} className="space-y-1.5">
                    <div className="flex justify-between items-end text-xs font-bold font-label">
                      <span className="text-on-surface uppercase tracking-tighter">
                        {entry.name}
                      </span>
                      <span className="text-secondary">{rate}% 승리</span>
                    </div>
                    <div className="h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${rate}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-secondary-container rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
              {mvpRanking.length === 0 && (
                <p className="text-sm text-on-surface-variant/50">데이터 수집 중...</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
