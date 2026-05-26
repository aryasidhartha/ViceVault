import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { PrimaryButton, GhostButton } from '../components/UIComponents';
import { signUpWithEmail } from '../utils/supabase';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert('Invalid email', 'Enter a valid email address.');
      return;
    }
    if (!password) {
      Alert.alert('Missing password', 'Enter a password.');
      return;
    }
    setLoading(true);
    const { data, error } = await signUpWithEmail(cleanEmail, password);
    setLoading(false);
    if (error) {
      console.error('Sign up failed', error);
      Alert.alert('Sign up failed', error.message || 'Network request failed');
      return;
    }

    if (data?.session) {
      navigation.navigate('CreateProfile');
    } else {
      Alert.alert('Check your email', 'A confirmation email has been sent. Confirm your account then sign in.');
      navigation.navigate('SignIn');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.top}>
            <Text style={styles.logo}>VICEVAULT</Text>
            <Text style={styles.title}>Create{'\n'}your account.</Text>
            <Text style={styles.sub}>Your data stays yours. No tracking. No ads.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@domain.com"
              placeholderTextColor={COLORS.textGhost}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter a password"
              placeholderTextColor={COLORS.textGhost}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />

            <PrimaryButton
              title={loading ? 'Signing up...' : 'Create account →'}
              onPress={handleSignUp}
              style={{ marginTop: 8 }}
            />

            <GhostButton
              title="ALREADY HAVE AN ACCOUNT"
              onPress={() => navigation.navigate('SignIn')}
              style={{ marginTop: 10 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 28, paddingBottom: 60, flexGrow: 1, justifyContent: 'space-between' },
  top: { paddingTop: 40 },
  logo: { fontFamily: FONTS.dmMonoMedium, fontSize: 13, letterSpacing: 4, color: COLORS.accent, marginBottom: 16 },
  title: { fontSize: 44, fontWeight: '900', lineHeight: 44, color: COLORS.text, marginBottom: 8 },
  sub: { fontFamily: FONTS.dmSans, fontSize: 14, color: COLORS.textGhost, marginBottom: 40 },
  form: { gap: 8 },
  label: { fontFamily: FONTS.dmMono, fontSize: 10, letterSpacing: 2, color: COLORS.textGhost, marginBottom: 4, marginTop: 8 },
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
});
