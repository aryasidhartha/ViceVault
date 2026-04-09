# ViceVault v2

Full Supabase backend — auth, profiles, synced data, streak system, progression.

## Setup (3 steps)

### Step 1 — Supabase project
1. Go to https://supabase.com and create a free project
2. Go to SQL Editor and paste the contents of `supabase/schema.sql` and run it
3. Go to Settings → API and copy your Project URL and anon key

### Step 2 — Add your keys
Open `src/utils/supabase.js` and replace:
```js
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### Step 3 — Install and run
```bash
npm install
npx expo start --tunnel
```

## What's new in v2

- Supabase auth (email + password sign up / sign in)
- Profile screen with war record (XD-day. XW - XL. Still standing.)
- All data synced to cloud — works across devices
- Honest streak system (slips count, only misses break the streak)
- Vice progression — new villains suggested after 7-day streaks
- Achievements system
- Profile tab in bottom navigation

## File structure

```
src/
├── hooks/
│   └── useAuth.js          ← Global auth context
├── utils/
│   ├── supabase.js         ← Supabase client + auth helpers
│   ├── db.js               ← All database operations
│   ├── theme.js            ← Colors, fonts, levels
│   └── notifications.js    ← Villain taunts
├── screens/
│   ├── SignUpScreen.js
│   ├── SignInScreen.js
│   ├── CreateProfileScreen.js
│   ├── ProfileScreen.js    ← War record, stats, achievements
│   ├── HomeScreen.js       ← Updated with Supabase data
│   ├── WinScreen.js        ← Saves to Supabase
│   └── SlipScreen.js       ← Saves to Supabase
supabase/
└── schema.sql              ← Run this in Supabase SQL editor first
```

## Streak rules
- Checked in today (win OR slip) → streak continues
- Missed a full day → streak resets to 1
- Every 7 days → +200 XP bonus
- Slipping and admitting it keeps the streak alive — honesty wins
