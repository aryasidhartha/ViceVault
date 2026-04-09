import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, getLevelInfo } from '../utils/theme';
import { XPBar, SectionLabel } from '../components/UIComponents';
import { useAuth } from '../hooks/useAuth';
import {
  getVillainStates, getTodayCheckins, getSuggestions,
} from '../utils/db';
import { VILLAINS, getVillainById } from '../data/villains';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'MORNING';
  if (h < 18) return 'AFTERNOON';
  return 'EVENING';
}

export default function HomeScreen({ navigation }) {
  const { user, profile, refreshProfile } = useAuth();
  const [villainStates, setVillainStates] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      refreshProfile();
      loadData();
    }, [user])
  );

  async function loadData() {
    const [statesRes, checkinsRes, suggestionsRes] = await Promise.all([
      getVillainStates(user.id),
      getTodayCheckins(user.id),
      getSuggestions(user.id),
    ]);
    setVillainStates(statesRes.data || []);
    setCheckins(checkinsRes.data || []);
    setSuggestions(suggestionsRes.data || []);
  }

  if (!profile) return null;

  const levelInfo = getLevelInfo(profile.total_xp || 0);
  const checkedInIds = checkins.map(c => c.villain_id);
  const allDone = villainStates.length > 0 && villainStates.every(v => checkedInIds.includes(v.villain_id));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            GOOD{'\n'}<Text style={styles.greetingAccent}>{getGreeting()}</Text>
          </Text>
          {profile.streak_count > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {profile.streak_count}</Text>
            </View>
          )}
          <XPBar
            xp={profile.total_xp || 0}
            progress={levelInfo.progress}
            levelName={levelInfo.current.name}
          />
        </View>

        {/* Suggestion banner */}
        {suggestions.length > 0 && (
          <TouchableOpacity
            style={styles.suggestionBanner}
            onPress={() => navigation.navigate('VillainPicker', { fromSuggestion: true })}
          >
            <Text style={styles.suggestionText}>
              New villain unlocked — ready to add one?
            </Text>
            <Text style={styles.suggestionArrow}>›</Text>
          </TouchableOpacity>
        )}

        <SectionLabel text="Today's check-ins" />

        {/* Villain cards */}
        <View style={styles.cards}>
          {villainStates.map(state => {
            const villain = getVillainById(state.villain_id);
            if (!villain) return null;
            const done = checkedInIds.includes(state.villain_id);
            return (
              <TouchableOpacity
                key={state.villain_id}
                style={[styles.card, done && styles.cardDone]}
                onPress={() => !done && navigation.navigate('CheckIn', { villainId: state.villain_id })}
                activeOpacity={done ? 1 : 0.8}
              >
                <Text style={styles.cardEmoji}>{villain.emoji}</Text>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardName, done && styles.cardNameDone]}>{villain.name}</Text>
                  <Text style={styles.cardType}>{villain.type}</Text>
                </View>
                {done ? (
                  <Text style={styles.doneBadge}>✓ DONE</Text>
                ) : (
                  <View style={styles.hpCol}>
                    <View style={styles.hpTrack}>
                      <View style={[styles.hpFill, { width: `${state.hp}%` }]} />
                    </View>
                    <Text style={styles.hpLabel}>HP {state.hp}%</Text>
                    <Text style={styles.arrow}>›</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {villainStates.length === 0 && (
            <TouchableOpacity
              style={styles.emptyCard}
              onPress={() => navigation.navigate('VillainPicker')}
            >
              <Text style={styles.emptyText}>No villains selected. Pick your enemies →</Text>
            </TouchableOpacity>
          )}
        </View>

        {allDone && (
          <View style={styles.allDoneBanner}>
            <Text style={styles.allDoneText}>YOU'RE DONE FOR TODAY. GO LIVE.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 28, paddingBottom: 60 },
  header: { paddingTop: 32, marginBottom: 28 },
  greeting: { fontFamily: FONTS.dmSansMedium, fontSize: 44, lineHeight: 46, color: COLORS.text, fontWeight: '900' },
  greetingAccent: { color: COLORS.accent },
  streakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.bg1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  streakText: { fontFamily: FONTS.dmMonoMedium, fontSize: 12, color: COLORS.text },
  suggestionBanner: {
    backgroundColor: COLORS.accentDark,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestionText: { flex: 1, fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.accent },
  suggestionArrow: { color: COLORS.accent, fontSize: 18 },
  cards: { gap: 8 },
  card: {
    backgroundColor: COLORS.bg1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cardDone: { opacity: 0.45 },
  cardEmoji: { fontSize: 28, width: 44, textAlign: 'center' },
  cardInfo: { flex: 1 },
  cardName: { fontFamily: FONTS.dmSansMedium, fontSize: 17, fontWeight: '700', color: COLORS.text },
  cardNameDone: { color: COLORS.textGhost },
  cardType: { fontFamily: FONTS.dmSans, fontSize: 11, color: COLORS.textGhost, marginTop: 1 },
  hpCol: { alignItems: 'flex-end', gap: 4 },
  hpTrack: { width: 48, height: 3, backgroundColor: COLORS.bg2, borderRadius: 2, overflow: 'hidden' },
  hpFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 2 },
  hpLabel: { fontFamily: FONTS.dmMono, fontSize: 9, color: COLORS.textDeep },
  arrow: { color: COLORS.textDeep, fontSize: 16 },
  doneBadge: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.accent, letterSpacing: 1 },
  emptyCard: {
    backgroundColor: COLORS.bg1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: { fontFamily: FONTS.dmSans, fontSize: 14, color: COLORS.textGhost },
  allDoneBanner: { marginTop: 32, alignItems: 'center' },
  allDoneText: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textDeep, letterSpacing: 2 },
});
