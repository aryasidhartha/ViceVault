import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS } from '../utils/theme';
import { VillainHPBar, HeroPowerBar } from '../components/UIComponents';
import { getVillainById } from '../data/villains';
import { getVillainStates } from '../utils/db';
import { useAuth } from '../hooks/useAuth';

export default function SquadScreen({ navigation }) {
  const { user } = useAuth();
  const [tab, setTab] = useState('villains');
  const [villainStates, setVillainStates] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      getVillainStates(user.id).then(r => setVillainStates(r.data || []));
    }, [user])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>YOUR SQUAD</Text>
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, tab === 'villains' && styles.tabActive]} onPress={() => setTab('villains')}>
            <Text style={[styles.tabText, tab === 'villains' && styles.tabTextActive]}>VILLAINS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'heroes' && styles.tabActive]} onPress={() => setTab('heroes')}>
            <Text style={[styles.tabText, tab === 'heroes' && styles.tabTextActive]}>HEROES</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.list}>
          {villainStates.length === 0 && (
            <Text style={styles.empty}>No villains active yet.</Text>
          )}
          {villainStates.map(state => {
            const villain = getVillainById(state.villain_id);
            if (!villain) return null;
            const hero = villain.hero;

            if (tab === 'villains') {
              return (
                <TouchableOpacity
                  key={state.villain_id}
                  style={styles.card}
                  onPress={() => navigation.navigate('VillainDetail', { villainId: state.villain_id })}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardEmoji}>{villain.emoji}</Text>
                    <View>
                      <Text style={[styles.cardName, { color: COLORS.accent }]}>{villain.name}</Text>
                      <Text style={styles.cardDesc}>{villain.type}</Text>
                    </View>
                  </View>
                  <VillainHPBar hp={state.hp} />
                  <Text style={styles.tapHint}>Tap for stats</Text>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={state.villain_id}
                style={styles.card}
                onPress={() => navigation.navigate('HeroDetail', { villainId: state.villain_id })}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>{hero.emoji}</Text>
                  <View>
                    <Text style={[styles.cardName, { color: COLORS.hero }]}>{hero.name}</Text>
                    <Text style={styles.cardDesc}>{hero.desc}</Text>
                  </View>
                </View>
                <HeroPowerBar power={state.hero_power} />
                {state.hero_power >= hero.unlockPower && (
                  <View style={styles.unlockBadge}>
                    <Text style={styles.unlockText}>Unlocked: {hero.unlockReward}</Text>
                  </View>
                )}
                <Text style={styles.tapHint}>Tap for details</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 28, paddingBottom: 60 },
  title: { fontSize: 40, fontWeight: '900', color: COLORS.text, paddingTop: 32, marginBottom: 20 },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.bg1, borderRadius: 8, padding: 3, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabActive: { backgroundColor: COLORS.bg2 },
  tabText: { fontFamily: FONTS.dmMono, fontSize: 10, letterSpacing: 1.5, color: COLORS.textGhost },
  tabTextActive: { color: COLORS.text },
  list: { gap: 8 },
  empty: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textGhost, textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: COLORS.bg1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardEmoji: { fontSize: 28 },
  cardName: { fontFamily: FONTS.dmSansMedium, fontSize: 17, fontWeight: '700' },
  cardDesc: { fontFamily: FONTS.dmSans, fontSize: 12, color: COLORS.textGhost, marginTop: 1 },
  tapHint: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textDeep, marginTop: 10, letterSpacing: 1 },
  unlockBadge: { marginTop: 10, backgroundColor: COLORS.heroDark, borderWidth: 1, borderColor: COLORS.heroBorder, borderRadius: 6, padding: 8 },
  unlockText: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.hero, letterSpacing: 1 },
});
