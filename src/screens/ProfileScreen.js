import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, getLevelInfo } from '../utils/theme';
import { getAchievements } from '../utils/db';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../utils/supabase';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const { user, profile, refreshProfile } = useAuth();

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        if (!user) return;
        await refreshProfile();
        
        const achievementsRes = await getAchievements(user.id);
        if (achievementsRes.data) setAchievements(achievementsRes.data);
        
        setLoading(false);
      }
      loadData();
    }, [user])
  );

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  const xp = profile?.total_xp || 0;
  const { current: currentLevel, next: nextLevel, progress } = getLevelInfo(xp);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Header / Player Card */}
      <View style={styles.playerCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {profile?.username ? profile.username.charAt(0).toUpperCase() : 'V'}
          </Text>
        </View>
        <Text style={styles.username}>{profile?.username || 'Unknown Hero'}</Text>
        <Text style={styles.title}>Rank: {currentLevel.name}</Text>
      </View>

      {/* XP Progress Bar */}
      <View style={styles.xpSection}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpText}>XP: {xp}</Text>
          {nextLevel && <Text style={styles.xpText}>Next: {nextLevel.name} ({nextLevel.minXP} XP)</Text>}
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min(Math.max(progress * 100, 0), 100)}%` }]} />
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile?.streak_count || 0} 🔥</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{achievements.length} 🏆</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {/* Trophy Case (Achievements) */}
      <Text style={styles.sectionTitle}>Trophy Case</Text>
      {achievements.length === 0 ? (
        <Text style={styles.emptyText}>Defeat villains to earn badges!</Text>
      ) : (
        <View style={styles.achievementsGrid}>
          {achievements.map((ach) => (
            <View key={ach.id} style={styles.badge}>
              <Text style={styles.badgeIcon}>🛡️</Text>
              <Text style={styles.badgeText}>{ach.achievement.replace(/_/g, ' ')}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>SIGN OUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
  
  playerCard: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.bg2,
    borderWidth: 2, borderColor: COLORS.borderHover,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: { fontFamily: FONTS.bebas, fontSize: 36, color: COLORS.accent },
  username: { fontFamily: FONTS.bebas, fontSize: 28, color: COLORS.text, marginBottom: 5 },
  title: { fontFamily: FONTS.dmSansMedium, fontSize: 14, color: COLORS.hero, textTransform: 'uppercase', letterSpacing: 1 },
  
  xpSection: { marginBottom: 30 },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  xpText: { fontFamily: FONTS.dmMono, fontSize: 12, color: COLORS.textMuted },
  progressBarBg: { height: 12, backgroundColor: COLORS.bg2, borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  progressBarFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 6 },
  
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  statBox: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.bg1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { fontFamily: FONTS.bebas, fontSize: 32, color: COLORS.text, marginBottom: 5 },
  statLabel: { fontFamily: FONTS.dmSans, fontSize: 12, color: COLORS.textDim, textTransform: 'uppercase' },
  
  sectionTitle: { fontFamily: FONTS.bebas, fontSize: 24, color: COLORS.text, marginBottom: 15 },
  emptyText: { fontFamily: FONTS.dmSans, fontSize: 14, color: COLORS.textGhost, fontStyle: 'italic' },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  badge: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.bg2,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1, borderColor: COLORS.borderHover,
  },
  badgeIcon: { fontSize: 24, marginBottom: 8 },
  badgeText: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textMuted, textAlign: 'center', textTransform: 'uppercase' },
  
  signOutBtn: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  signOutText: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textGhost, letterSpacing: 2 },
});
