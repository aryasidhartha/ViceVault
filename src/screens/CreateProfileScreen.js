import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { PrimaryButton } from '../components/UIComponents';
import { updateProfile, isUsernameTaken } from '../utils/db';
import { useAuth } from '../hooks/useAuth';

const AGE_RANGES = ['16-18', '19-22', '23-25', '25+'];
const WHY_OPTIONS = [
  'I want more control over my habits',
  'I feel like my vices are winning',
  'Someone I trust suggested it',
  'Just curious — no pressure',
];

export default function CreateProfileScreen({ navigation }) {
  const { user, refreshProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [whyHere, setWhyHere] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!username.trim()) {
      Alert.alert('Username required', 'Pick a username for your fighter card.');
      return;
    }
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (clean.length < 3) {
      Alert.alert('Too short', 'Username needs at least 3 characters.');
      return;
    }
    setLoading(true);
    const taken = await isUsernameTaken(clean);
    if (taken) {
      setLoading(false);
      Alert.alert('Username taken', 'Try a different one.');
      return;
    }
    const { error } = await updateProfile(user.id, {
      username: clean,
      display_name: displayName.trim() || clean,
      age_range: ageRange || null,
      why_here: whyHere || null,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      await refreshProfile();
      navigation.navigate('Manifesto');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.step}>YOUR FIGHTER CARD</Text>
          <Text style={styles.title}>Who are{'\n'}you?</Text>
          <Text style={styles.sub}>This is how your war record gets signed.</Text>

          <Text style={styles.label}>USERNAME</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="lowercase, no spaces"
            placeholderTextColor={COLORS.textGhost}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>DISPLAY NAME (optional)</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="How you want to be called"
            placeholderTextColor={COLORS.textGhost}
          />

          <Text style={styles.label}>AGE RANGE (optional)</Text>
          <View style={styles.optionRow}>
            {AGE_RANGES.map(r => (
              <TouchableOpacity
                key={r}
                style={[styles.optionBtn, ageRange === r && styles.optionBtnActive]}
                onPress={() => setAgeRange(r === ageRange ? '' : r)}
              >
                <Text style={[styles.optionText, ageRange === r && styles.optionTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>WHY ARE YOU HERE? (optional)</Text>
          {WHY_OPTIONS.map(w => (
            <TouchableOpacity
              key={w}
              style={[styles.whyBtn, whyHere === w && styles.whyBtnActive]}
              onPress={() => setWhyHere(w === whyHere ? '' : w)}
            >
              <Text style={[styles.whyText, whyHere === w && styles.whyTextActive]}>{w}</Text>
            </TouchableOpacity>
          ))}

          <PrimaryButton
            title={loading ? 'Creating profile...' : "Let's go →"}
            onPress={handleCreate}
            style={{ marginTop: 24 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 28, paddingBottom: 60 },
  step: { fontFamily: FONTS.dmMono, fontSize: 10, letterSpacing: 3, color: COLORS.accent, marginTop: 32, marginBottom: 8 },
  title: { fontSize: 44, fontWeight: '900', lineHeight: 44, color: COLORS.text, marginBottom: 8 },
  sub: { fontFamily: FONTS.dmSans, fontSize: 14, color: COLORS.textGhost, marginBottom: 28 },
  label: { fontFamily: FONTS.dmMono, fontSize: 10, letterSpacing: 2, color: COLORS.textGhost, marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: COLORS.bg1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.text,
    fontFamily: FONTS.dmSans,
    fontSize: 15,
  },
  optionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg1,
  },
  optionBtnActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accentDark },
  optionText: { fontFamily: FONTS.dmMono, fontSize: 12, color: COLORS.textGhost },
  optionTextActive: { color: COLORS.accent },
  whyBtn: {
    marginTop: 8,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg1,
  },
  whyBtnActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accentDark },
  whyText: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textMuted },
  whyTextActive: { color: COLORS.accent },
});
