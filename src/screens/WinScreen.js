import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { GhostButton, HeroPowerBar } from '../components/UIComponents';
import { getVillainById } from '../data/villains';
import { useAuth } from '../hooks/useAuth';
import {
  saveCheckin, upsertVillainState, updateStreak,
  getVillainStates, checkProgressionTriggers, unlockAchievement,
} from '../utils/db';
import { supabase } from '../utils/supabase';

export default function WinScreen({ navigation, route }) {
  const { villainId } = route.params;
  const { user, profile, refreshProfile } = useAuth();
  const villain = getVillainById(villainId);
  const [heroPower, setHeroPower] = useState(26);
  const [newXP] = useState(100);

  useEffect(() => {
    async function record() {
      if (!user) return;
      // Get current state
      const { data: states } = await getVillainStates(user.id);
      const current = states?.find(s => s.villain_id === villainId);
      const newHP = Math.max(0, (current?.hp ?? 80) - 8);
      const newPower = Math.min(100, (current?.hero_power ?? 20) + 6);

      // Save villain state
      await upsertVillainState(user.id, villainId, {
        hp: newHP,
        hero_power: newPower,
        is_defeated: newHP === 0,
        defeated_at: newHP === 0 ? new Date().toISOString() : null,
      });

      // Save check-in + add XP
      await saveCheckin(user.id, villainId, 'win', 100);
      await supabase
        .from('profiles')
        .update({ total_xp: (profile?.total_xp || 0) + 100 })
        .eq('id', user.id);

      // Update streak
      const { data: streakData } = await updateStreak(user.id);

      // First win achievement
      await unlockAchievement(user.id, 'first_win');

      // Check progression triggers
      await checkProgressionTriggers(
        user.id,
        villainId,
        streakData?.streak_count || 0,
        newPower
      );

      // Villain defeated achievement
      if (newHP === 0) {
        await unlockAchievement(user.id, 'villain_defeated');
      }

      setHeroPower(newPower);
      refreshProfile();
    }
    record();
  }, []);

  if (!villain) return null;
  const hero = villain.hero;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <Text style={styles.icon}>🛡️</Text>
          <Text style={styles.title}>Nice.</Text>
          <Text style={styles.sub}>
            You logged today.{'\n'}Honestly didn't think you would. Respect.
          </Text>
          <View style={styles.xpPop}>
            <Text style={styles.xpText}>+ {newXP} XP</Text>
          </View>
          <View style={styles.heroCard}>
            <Text style={styles.heroEmoji}>{hero.emoji}</Text>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{hero.name.toUpperCase()}</Text>
              <Text style={styles.heroDesc}>{hero.desc}</Text>
              <HeroPowerBar power={heroPower} />
            </View>
          </View>
        </View>
        <GhostButton title="GOT IT. SEE YOU TOMORROW." onPress={() => navigation.navigate('Main')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 28, paddingBottom: 60, flexGrow: 1, justifyContent: 'space-between' },
  content: { alignItems: 'center', paddingTop: 48, paddingBottom: 32 },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontFamily: FONTS.dmSansMedium, fontSize: 52, fontWeight: '900', color: COLORS.text, marginBottom: 8 },
  sub: { fontFamily: FONTS.dmSans, fontSize: 14, color: COLORS.textDim, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  xpPop: { backgroundColor: COLORS.accentDark, borderWidth: 1, borderColor: COLORS.accentBorder, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 8, marginBottom: 28 },
  xpText: { fontFamily: FONTS.dmMonoMedium, fontSize: 18, color: COLORS.accent },
  heroCard: { backgroundColor: COLORS.bg1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, width: '100%' },
  heroEmoji: { fontSize: 36 },
  heroInfo: { flex: 1 },
  heroName: { fontFamily: FONTS.dmSansMedium, fontSize: 18, fontWeight: '700', color: COLORS.text },
  heroDesc: { fontFamily: FONTS.dmSans, fontSize: 12, color: COLORS.textGhost, marginBottom: 8 },
});
