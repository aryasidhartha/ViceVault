import { supabase } from './supabase';

// ─── Profile ─────────────────────────────────────────────────

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates }, { onConflict: 'id' })
    .select()
    .single();
  return { data, error };
}

export async function isUsernameTaken(username) {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase())
    .single();
  return !!data;
}

export async function addXP(userId, amount) {
  const { data, error } = await supabase.rpc('increment_xp', {
    user_id: userId,
    amount,
  });
  if (error) {
    // Fallback: manual update
    const profile = await getProfile(userId);
    if (profile.data) {
      return updateProfile(userId, { total_xp: (profile.data.total_xp || 0) + amount });
    }
  }
  return { data, error };
}

// ─── Streak ───────────────────────────────────────────────────

export async function updateStreak(userId) {
  const { data: profile } = await getProfile(userId);
  if (!profile) return;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newStreak = 1;
  if (profile.streak_last === yesterday) {
    newStreak = (profile.streak_count || 0) + 1;
  } else if (profile.streak_last === today) {
    newStreak = profile.streak_count; // already checked in today
  }

  const updates = { streak_count: newStreak, streak_last: today };

  // 7-day streak bonus XP
  if (newStreak > 0 && newStreak % 7 === 0) {
    updates.total_xp = (profile.total_xp || 0) + 200;
    // Also unlock achievement
    await unlockAchievement(userId, `streak_${newStreak}`);
  }

  return updateProfile(userId, updates);
}

// ─── Villain States ───────────────────────────────────────────

export async function getVillainStates(userId) {
  const { data, error } = await supabase
    .from('villain_states')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);
  return { data: data || [], error };
}

export async function upsertVillainState(userId, villainId, updates) {
  const { data, error } = await supabase
    .from('villain_states')
    .upsert({
      user_id: userId,
      villain_id: villainId,
      ...updates,
    }, { onConflict: 'user_id,villain_id' })
    .select()
    .single();
  return { data, error };
}

export async function activateVillains(userId, villainIds) {
  const rows = villainIds.map(id => ({
    user_id: userId,
    villain_id: id,
    hp: 80,
    hero_power: 20,
    is_active: true,
  }));
  const { data, error } = await supabase
    .from('villain_states')
    .upsert(rows, { onConflict: 'user_id,villain_id' });
  return { data, error };
}

// ─── Custom Villains ──────────────────────────────────────────

export async function getCustomVillains(userId) {
  const { data, error } = await supabase
    .from('custom_villains')
    .select('villain_data')
    .eq('user_id', userId);
    
  if (data) {
    return { data: data.map(row => row.villain_data), error };
  }
  return { data: [], error };
}

export async function createCustomVillain(userId, villainData) {
  const { data, error } = await supabase
    .from('custom_villains')
    .insert({
      user_id: userId,
      id: villainData.id,
      villain_data: villainData, // Stored as a JSONB payload
    })
    .select()
    .single();
  return { data, error };
}

// ─── Villain Evolution (Prestige System) ──────────────────────

export async function evolveVillain(userId, villainId) {
  const { data: state } = await supabase
    .from('villain_states')
    .select('tier, hp')
    .eq('user_id', userId)
    .eq('villain_id', villainId)
    .single();

  const currentTier = state?.tier || 1;
  const newTier = currentTier + 1;
  const newHp = 80 + (currentTier * 40); // HP scales up with each tier

  // Reward massive XP for defeating the current tier
  await addXP(userId, currentTier * 1000);
  await unlockAchievement(userId, `defeat_${villainId}_tier_${currentTier}`);

  const { data, error } = await supabase
    .from('villain_states')
    .update({
      hp: newHp,
      hero_power: 20, // Reset hero advantage for the new fight
      tier: newTier,
    })
    .eq('user_id', userId)
    .eq('villain_id', villainId)
    .select()
    .single();

  return { data, error };
}

// ─── Check-ins ────────────────────────────────────────────────

export async function getTodayCheckins(userId) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today);
  return { data: data || [], error };
}

export async function saveCheckin(userId, villainId, result, xpEarned) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('checkins')
    .upsert({
      user_id: userId,
      villain_id: villainId,
      result,
      xp_earned: xpEarned,
      date: today,
    }, { onConflict: 'user_id,villain_id,date' })
    .select()
    .single();
  return { data, error };
}

export async function getCheckinHistory(userId, days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .gte('date', since)
    .order('date', { ascending: false });
  return { data: data || [], error };
}

// ─── Suggestions ─────────────────────────────────────────────

export async function getSuggestions(userId) {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('user_id', userId)
    .eq('accepted', false)
    .eq('dismissed', false);
  return { data: data || [], error };
}

export async function createSuggestion(userId, villainId, triggerType) {
  const { data, error } = await supabase
    .from('suggestions')
    .insert({ user_id: userId, villain_id: villainId, trigger_type: triggerType })
    .select()
    .single();
  return { data, error };
}

export async function acceptSuggestion(userId, suggestionId, villainId) {
  await supabase
    .from('suggestions')
    .update({ accepted: true })
    .eq('id', suggestionId);
  return activateVillains(userId, [villainId]);
}

export async function dismissSuggestion(suggestionId) {
  return supabase
    .from('suggestions')
    .update({ dismissed: true })
    .eq('id', suggestionId);
}

// ─── Achievements ─────────────────────────────────────────────

export async function unlockAchievement(userId, achievement) {
  const { data, error } = await supabase
    .from('achievements')
    .upsert({ user_id: userId, achievement }, { onConflict: 'user_id,achievement' })
    .select()
    .single();
  return { data, error };
}

export async function getAchievements(userId) {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });
  return { data: data || [], error };
}

// ─── Progression checks ───────────────────────────────────────

const VILLAIN_SUGGESTIONS = {
  scroller: 'comparotron',
  comparotron: 'scroller',
  sleepthief: 'caffdemon',
  caffdemon: 'sleepthief',
  snackgoblin: 'mirror',
  phantom: 'real_connection',
};

export async function checkProgressionTriggers(userId, villainId, streakCount, heroPower) {
  const suggestions = [];

  // 7-day streak → suggest related villain
  if (streakCount > 0 && streakCount % 7 === 0) {
    const related = VILLAIN_SUGGESTIONS[villainId];
    if (related) {
      const existing = await getSuggestions(userId);
      const alreadySuggested = existing.data?.some(s => s.villain_id === related);
      if (!alreadySuggested) {
        await createSuggestion(userId, related, `streak_${streakCount}`);
        suggestions.push(related);
      }
    }
  }

  // Hero at 80% → unlock challenge mode (achievement)
  if (heroPower >= 80) {
    await unlockAchievement(userId, `hero_80_${villainId}`);
  }

  return suggestions;
}
