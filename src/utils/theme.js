export const COLORS = {
  bg: '#0a0a0a',
  bg1: '#111111',
  bg2: '#161616',
  border: '#1e1e1e',
  borderHover: '#2a2a2a',
  accent: '#e8462a',
  accentDark: '#150f0e',
  accentBorder: '#2a1210',
  text: '#f0ece4',
  textMuted: '#c8c4bc',
  textDim: '#888888',
  textGhost: '#555555',
  textDeep: '#333333',
  hero: '#4caf78',
  heroDark: '#0f130f',
  heroBorder: '#1a221a',
};

// Bebas Neue is loaded via a CDN fallback — use system bold as fallback
export const FONTS = {
  bebas: 'BebasNeue_400Regular',
  dmSans: 'DMSans_400Regular',
  dmSansMedium: 'DMSans_500Medium',
  dmMono: 'DMMono_400Regular',
  dmMonoMedium: 'DMMono_500Medium',
};

export const LEVELS = [
  { name: 'Civilian',    minXP: 0 },
  { name: 'Aware',       minXP: 200 },
  { name: 'Resisting',   minXP: 500 },
  { name: 'Unbothered',  minXP: 1000 },
  { name: 'Untouchable', minXP: 2000 },
];

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }
  const progress = next
    ? (xp - current.minXP) / (next.minXP - current.minXP)
    : 1;
  return { current, next, progress };
}
