import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../utils/theme';
import { GhostButton, ScienceCard, TipCard, XPPop } from '../components/UIComponents';
import { getVillainById } from '../data/villains';
import { useAuth } from '../hooks/useAuth';
import { saveCheckin, upsertVillainState, getVillainStates } from '../utils/db';
import { supabase } from '../utils/supabase';

export default function SlipScreen({ navigation, route }) {
  const { villainId } = route.params;
  const { user, profile, refreshProfile } = useAuth();
  const villain = getVillainById(villainId);

  useEffect(() => {
    async function record() {
      if (!user) return;
      const { data: states } = await getVillainStates(user.id);
      const current = states?.find(s => s.villain_id === villainId);
      const newHP = Math.min(100, (current?.hp ?? 80) + 3);
      const newPower = Math.max(0, (current?.hero_power ?? 20) - 2);

      await upsertVillainState(user.id, villainId, { hp: newHP, hero_power: newPower });
      await saveCheckin(user.id, villainId, 'slip', 150);
      await supabase
        .from('profiles')
        .update({ total_xp: (profile?.total_xp || 0) + 150 })
        .eq('id', user.id);

      // Still update streak — showing up honest counts
      await import('../utils/db').then(m => m.updateStreak(user.id));
      refreshProfile();
    }
    record();
  }, []);

  if (!villain) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topSection}>
          <XPPop amount={150} sub="That took guts. Respect." />
        </View>
        <ScienceCard text={villain.science} />
        <TipCard text={villain.tip} />
        <GhostButton
          title="GOT IT. SEE YOU TOMORROW."
          onPress={() => navigation.navigate('Main')}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 28, paddingTop: 48, paddingBottom: 60 },
  topSection: { marginBottom: 20 },
});
