import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BackButton, HeroPowerBar, SectionLabel } from '../components/UIComponents';
import { COLORS, FONTS } from '../utils/theme';
import { getVillainById } from '../data/villains';
import { getCheckinHistory, getVillainStates } from '../utils/db';
import { useAuth } from '../hooks/useAuth';

export default function HeroDetailScreen({ navigation, route }) {
  const { villainId } = route.params;
  const { user } = useAuth();
  const villain = getVillainById(villainId);
  const hero = villain?.hero;
  const [villainState, setVillainState] = useState(null);
  const [history, setHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        if (!user) return;

        const [{ data: states }, { data: checkins }] = await Promise.all([
          getVillainStates(user.id),
          getCheckinHistory(user.id, 30),
        ]);

        setVillainState(states?.find(state => state.villain_id === villainId) || null);
        setHistory((checkins || []).filter(checkin => checkin.villain_id === villainId));
      }

      load();
    }, [user, villainId])
  );

  if (!villain || !hero) return null;

  const heroPower = villainState?.hero_power ?? 0;
  const wins = history.filter(checkin => checkin.result === 'win').length;
  const slips = history.filter(checkin => checkin.result === 'slip').length;
  const lastFight = history[0];
  const powerToUnlock = Math.max(0, hero.unlockPower - heroPower);
  const unlocked = heroPower >= hero.unlockPower;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <BackButton onPress={() => navigation.goBack()} />

        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>{hero.emoji}</Text>
          <Text style={styles.heroName}>{hero.name.toUpperCase()}</Text>
          <Text style={styles.heroDesc}>{hero.desc}</Text>
        </View>

        <View style={styles.section}>
          <SectionLabel text="Hero Power" />
          <View style={styles.panel}>
            <HeroPowerBar power={heroPower} />
            <Text style={styles.panelText}>
              {unlocked
                ? `Unlocked: ${hero.unlockReward}`
                : `${powerToUnlock}% until ${hero.unlockReward}`}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel text="Battle Record" />
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{wins}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: COLORS.accent }]}>{slips}</Text>
              <Text style={styles.statLabel}>Slips</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>Battles</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel text="Current Mission" />
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Take another swing at {villain.name} today.</Text>
            <Text style={styles.panelText}>
              Every honest check-in grows {hero.name}. Wins build power faster, but showing up is the real mechanic.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel text="Last Fight" />
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>
              {lastFight
                ? `${lastFight.result === 'win' ? 'Win' : 'Slip'} on ${lastFight.date}`
                : 'No battles logged yet'}
            </Text>
            <Text style={styles.panelText}>
              {lastFight
                ? `${hero.name} is currently at ${heroPower}% power against ${villain.name}.`
                : `Your first check-in against ${villain.name} will start building ${hero.name}.`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 28, paddingBottom: 60 },
  heroCard: {
    alignItems: 'center',
    backgroundColor: COLORS.heroDark,
    borderWidth: 1,
    borderColor: COLORS.heroBorder,
    borderRadius: 14,
    padding: 24,
    marginBottom: 20,
  },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroName: { fontFamily: FONTS.dmSansMedium, fontSize: 32, color: COLORS.text, fontWeight: '700' },
  heroDesc: {
    fontFamily: FONTS.dmSans,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  section: { marginBottom: 18 },
  panel: {
    backgroundColor: COLORS.bg1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  panelTitle: { fontFamily: FONTS.dmSansMedium, fontSize: 16, color: COLORS.text, marginBottom: 6 },
  panelText: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMuted, lineHeight: 20, marginTop: 10 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bg1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statValue: { fontFamily: FONTS.dmSansMedium, fontSize: 24, color: COLORS.hero },
  statLabel: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textGhost, letterSpacing: 1, marginTop: 4 },
});
