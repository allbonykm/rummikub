/**
 * 고정 플레이어 데이터
 */
export const PLAYERS = [
  {
    id: 1,
    name: '승희',
    title: 'Grandmaster',
    color: 'var(--color-primary)',
    borderColor: 'border-primary',
    bgGradient: 'from-primary-container to-[#930016]',
  },
  {
    id: 2,
    name: '요한',
    title: 'Challenger',
    color: 'var(--color-secondary)',
    borderColor: 'border-secondary',
    bgGradient: 'from-secondary-container to-[#003061]',
  },
  {
    id: 3,
    name: '혜진',
    title: 'Tactician',
    color: 'var(--color-tertiary)',
    borderColor: 'border-tertiary',
    bgGradient: 'from-tertiary-container to-[#3a3000]',
  },
  {
    id: 4,
    name: '선미',
    title: 'Elite Player',
    color: 'var(--color-surface-container-highest)',
    borderColor: 'border-surface-container-highest',
    bgGradient: 'from-surface-bright to-surface-container-highest',
  },
  {
    id: 5,
    name: '율',
    title: 'Strategist',
    color: 'var(--color-primary-fixed-dim)',
    borderColor: 'border-primary-fixed-dim',
    bgGradient: 'from-primary-fixed-dim to-[#930016]',
  },
];

/**
 * 플레이어 이름으로 ID를 찾기
 */
export function getPlayerByName(name) {
  return PLAYERS.find((p) => p.name === name);
}

/**
 * 플레이어 ID로 데이터를 찾기
 */
export function getPlayerById(id) {
  return PLAYERS.find((p) => p.id === id);
}
