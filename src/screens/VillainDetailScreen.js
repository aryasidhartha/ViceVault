import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BackButton, SectionLabel, VillainHPBar } from '../components/UIComponents';
import { COLORS, FONTS } from '../utils/theme';
import { getVillainById } from '../data/villains';
import { getCheckinHistory, getVillainStates } from '../utils/db';
import { useAuth } from '../hooks/useAuth';

export default function VillainDetailScreen({ navigation, route }) {
  const { villainId } = route.params;
  const { user } = useAuth();
  const villain = getVillainById(villainId);
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

  if (!villain) return null;

  const hp = villainState?.hp ?? villain.defaultHP;
  const wins = history.filter(checkin => checkin.result === 'win').length;
  const slips = history.filter(checkin => checkin.result === 'slip').length;
  const lastFight = history[0];
  const lastResultText = lastFight
    ? lastFight.result === 'win'
      ? `You hit ${villain.name} on ${lastFight.date}.`
      : `${villain.name} hit back on ${lastFight.date}.`
    : `No fights logged against ${villain.name} yet.`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <BackButton onPress={() => navigation.goBack()} />

        <View style={styles.villainCard}>
          <Text style={styles.villainEmoji}>{villain.emoji}</Text>
          <Text style={styles.villainName}>{villain.name.toUpperCase()}</Text>
          <Text style={styles.villainType}>{villain.type}</Text>
          <Text style={styles.taunt}>"{villain.taunts[0]}"</Text>
        </View>

        <View style={styles.section}>
          <SectionLabel text="Threat Level" />
          <View style={styles.panel}>
            <VillainHPBar hp={hp} />
            <Text style={styles.panelText}>
              {hp === 0
                ? `${villain.name} is defeated. Keep checking in so it stays that way.`
                : `${villain.name} is still at ${hp}% HP. A few more wins will start to hurt it.`}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel text="Stats" />
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{wins}</Text>
              <Text style={styles.statLabel}>You Won</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: COLORS.accent }]}>{slips}</Text>
              <Text style={styles.statLabel}>It Won</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>Encounters</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel text="Pattern" />
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{lastResultText}</Text>
            <Text style={styles.panelText}>{villain.science}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel text="Counter Move" />
          <View style={[styles.panel, styles.tipPanel]}>
            <Text style={styles.panelTitle}>One thing for the next round</Text>
            <Text style={styles.panelText}>{villain.tip}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 28, paddingBottom: 60 },
  villainCard: {
    alignItems: 'center',
    backgroundColor: COLORS.accentDark,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
    borderRadius: 14,
    padding: 24,
    marginBottom: 20,
  },
  villainEmoji: { fontSize: 64, marginBottom: 12 },
  villainName: { fontFamily: FONTS.dmSansMedium, fontSize: 30, color: COLORS.text, fontWeight: '700', textAlign: 'center' },
  villainType: { fontFamily: FONTS.dmMono, fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginTop: 6, textAlign: 'center' },
  taunt: {
    fontFamily: FONTS.dmSans,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 14,
  },
  section: { marginBottom: 18 },
  panel: {
    backgroundColor: COLORS.bg1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  tipPanel: {
    backgroundColor: COLORS.heroDark,
    borderColor: COLORS.heroBorder,
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
  statValue: { fontFamily: FONTS.dmSansMedium, fontSize: 24, color: COLORS.text },
  statLabel: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textGhost, letterSpacing: 1, marginTop: 4 },
});
