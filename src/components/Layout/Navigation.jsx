import { Undo2, History, Menu, X, Users } from 'lucide-react';

/**
 * 상단 네비게이션 바
 */
export function TopNav({ onUndo, canUndo, onReset, isGameActive }) {
  return (
    <nav className="bg-surface grid grid-cols-3 items-center w-full px-6 py-4 sticky top-0 z-50 max-w-5xl mx-auto">
      <div></div>
      <div className="flex justify-center whitespace-nowrap">
        <h1 className="text-2xl font-bold tracking-tight font-headline text-on-background">
          우리끼리 루미큐브
        </h1>
      </div>
      <div className="flex justify-end items-center gap-6">
        {isGameActive && (
          <button
            onClick={onReset}
            className="text-on-surface-variant hover:text-secondary transition-colors"
            title="멤버 재선택"
          >
            <Users size={22} />
          </button>
        )}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`transition-colors ${canUndo ? 'text-on-surface-variant hover:text-primary-container' : 'text-surface-container-highest'}`}
          title="실행 취소"
        >
          <Undo2 size={22} />
        </button>
      </div>
    </nav>
  );
}

/**
 * 하단 탭 네비게이션
 */
export function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'arena', icon: 'sports_esports', label: 'Arena' },
    { id: 'stats', icon: 'leaderboard', label: 'Stats' },
    { id: 'vault', icon: 'inventory_2', label: 'Vault' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 bg-surface-container-low/80 glass-effect border-t border-surface-container-highest/15 shadow-[0_-4px_20px_0_rgba(0,0,0,0.5)] rounded-t-2xl" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center justify-center px-6 py-3 transition-all ${activeTab === tab.id
            ? 'text-primary-container bg-surface-container-highest rounded-xl translate-y-[-2px]'
            : 'text-on-surface/50 hover:text-secondary'
            }`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              // 직접 크기(px 단위) 지정
              fontSize: '40px',
              // 'wght' 600~700 사이로 하면 선이 두꺼워집니다.
              fontVariationSettings: activeTab === tab.id
                ? "'FILL' 1, 'wght' 600"
                : "'FILL' 0, 'wght' 600"
            }}
          >
            {tab.icon}
          </span>
        </button>
      ))}
    </nav>
  );
}
