import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, FlatList, Alert,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { PrimaryButton } from '../components/UIComponents';
import { VILLAINS } from '../data/villains';
import { activateVillains, updateProfile } from '../utils/db';
import { useAuth } from '../hooks/useAuth';
import { scheduleDailyReminder, requestNotificationPermission } from '../utils/notifications';

export default function VillainPickerScreen({ navigation, route }) {
  const { user, refreshProfile } = useAuth();
  const fromSuggestion = route?.params?.fromSuggestion;
  const [selected, setSelected] = useState([]);

  function toggle(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function confirm() {
    if (selected.length === 0) return;
    const { error } = await activateVillains(user.id, selected);
    if (error) { Alert.alert('Error', error.message); return; }
    await updateProfile(user.id, { onboarded: true });
    const granted = await requestNotificationPermission();
    if (granted) await scheduleDailyReminder(21, 0);
    await refreshProfile();
    navigation.replace('Main');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.step}>{fromSuggestion ? 'NEW VILLAIN UNLOCKED' : 'STEP 1 OF 1'}</Text>
          <Text style={styles.title}>Who's been{'\n'}winning?</Text>
          <Text style={styles.sub}>
            {fromSuggestion
              ? 'You earned this. Pick your next enemy.'
              : 'Pick your villains. Be honest.'}
          </Text>
        </View>

        <FlatList
          data={VILLAINS}
          keyExtractor={v => v.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => {
            const isSelected = selected.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggle(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.villainName}>{item.name}</Text>
                <Text style={styles.villainType}>{item.type}</Text>
                {isSelected && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          }}
        />

        <PrimaryButton
          title="Start fighting →"
          onPress={confirm}
          style={{ opacity: selected.length > 0 ? 1 : 0.35 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: 28, paddingBottom: 40 },
  header: { paddingTop: 32, marginBottom: 20 },
  step: { fontFamily: FONTS.dmMono, fontSize: 10, letterSpacing: 3, color: COLORS.accent, marginBottom: 8 },
  title: { fontSize: 44, fontWeight: '900', lineHeight: 42, color: COLORS.text, marginBottom: 6 },
  sub: { fontFamily: FONTS.dmMono, fontSize: 11, color: COLORS.textGhost, letterSpacing: 1 },
  grid: { paddingBottom: 20 },
  row: { gap: 10, marginBottom: 10 },
  card: {
    flex: 1, backgroundColor: COLORS.bg1, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, padding: 14, position: 'relative',
  },
  cardSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.accentDark },
  emoji: { fontSize: 28, marginBottom: 8 },
  villainName: { fontFamily: FONTS.dmSansMedium, fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  villainType: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textGhost },
  check: { position: 'absolute', top: 10, right: 12, color: COLORS.accent, fontSize: 14, fontWeight: '600' },
});
