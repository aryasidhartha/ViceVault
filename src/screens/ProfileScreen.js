import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, getLevelInfo } from '../utils/theme';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../utils/supabase';
import { getCheckinHistory, getAchievements, getVillainStates } from '../utils/db';

const ACHIEVEMENT_LABELS = {
  first_win: 'First blood',
  streak_7: '7-day warrior',
  streak_14: '14-day warrior',
  streak_30: '30-day legend',
  villain_defeated: 'Villain slayer',
};

export default function ProfileScreen({ navigation }) {
  const { user, profile, refreshProfile } = useAuth();
  const [history, setHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [villainStates, setVillainStates] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      refreshProfile();
      getCheckinHistory(user.id, 30).then(r => setHistory(r.data || []));
      getAchievements(user.id).then(r => setAchievements(r.data || []));
      getVillainStates(user.id).then(r => setVillainStates(r.data || []));
    }, [user])
  );

  if (!profile) return null;

  const wins = history.filter(c => c.result === 'win').length;
  const slips = history.filter(c => c.result === 'slip').length;
  const levelInfo = getLevelInfo(profile.total_xp || 0);
  const initials = (profile.display_name || profile.username || 'VV')
    .slice(0, 2).toUpperCase();

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out', style: 'destructive',
        onPress: async () => { await signOut(); }
      }
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Fighter card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { backgroundColor: profile.avatar_color || COLORS.accent }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.displayName}>{profile.display_name || profile.username}</Text>
              <Text style={styles.username}>@{profile.username}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{levelInfo.current.name.toUpperCase()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{profile.total_xp || 0}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{profile.streak_count || 0}</Text>
              <Text style={styles.statLabel}>Day streak</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statNum, { color: COLORS.hero }]}>{wins}</Text>
              <Text style={styles.statLabel}>Wins (30d)</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statNum, { color: COLORS.accent }]}>{slips}</Text>
              <Text style={styles.statLabel}>Slips (30d)</Text>
            </View>
          </View>

          {/* War record line */}
          <View style={styles.warRecord}>
            <Text style={styles.warRecordText}>
              {profile.streak_count || 0} days.{' '}
              <Text style={{ color: COLORS.hero }}>{wins}W</Text>
              {' - '}
              <Text style={{ color: COLORS.accent }}>{slips}L</Text>
              . Still standing.
            </Text>
          </View>
        </View>

        {/* Active villains */}
        {villainStates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ACTIVE WARS</Text>
            {villainStates.map(v => (
              <View key={v.villain_id} style={styles.villainRow}>
                <View style={styles.villainHPBar}>
                  <View style={[styles.villainHPFill, { width: `${v.hp}%` }]} />
                </View>
                <Text style={styles.villainRowLabel}>{v.villain_id} — {v.hp}% HP</Text>
              </View>
            ))}
          </View>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ACHIEVEMENTS</Text>
            <View style={styles.achievementGrid}>
              {achievements.map(a => (
                <View key={a.id} style={styles.achievementBadge}>
                  <Text style={styles.achievementText}>
                    {ACHIEVEMENT_LABELS[a.achievement] || a.achievement}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>SIGN OUT</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 28, paddingBottom: 60 },
  card: {
    backgroundColor: COLORS.bg1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#fff' },
  displayName: { fontFamily: FONTS.dmSansMedium, fontSize: 18, color: COLORS.text, marginBottom: 2 },
  username: { fontFamily: FONTS.dmMono, fontSize: 11, color: COLORS.textGhost, marginBottom: 6 },
  levelBadge: { backgroundColor: COLORS.accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  levelText: { fontFamily: FONTS.dmMonoMedium, fontSize: 9, color: COLORS.bg, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  stat: { alignItems: 'center' },
  statNum: { fontFamily: FONTS.dmSansMedium, fontSize: 22, color: COLORS.text },
  statLabel: { fontFamily: FONTS.dmMono, fontSize: 9, color: COLORS.textGhost, letterSpacing: 1, marginTop: 2 },
  warRecord: {
    backgroundColor: COLORS.bg2,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  warRecordText: { fontFamily: FONTS.dmSansMedium, fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionLabel: { fontFamily: FONTS.dmMono, fontSize: 9, letterSpacing: 2, color: COLORS.textDeep, marginBottom: 10 },
  villainRow: { marginBottom: 8 },
  villainHPBar: { height: 4, backgroundColor: COLORS.bg2, borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  villainHPFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 2 },
  villainRowLabel: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textGhost },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  achievementBadge: {
    backgroundColor: COLORS.accentDark,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  achievementText: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.accent },
  signOutBtn: {
    marginTop: 12,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  signOutText: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textGhost, letterSpacing: 2 },
});
