import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { PrimaryButton, GhostButton } from '../components/UIComponents';
import { signInWithEmail } from '../utils/supabase';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert('Invalid email', 'Enter a valid email address.');
      return;
    }
    if (!password) {
      Alert.alert('Missing password', 'Enter your password.');
      return;
    }
    setLoading(true);
    const { data, error } = await signInWithEmail(cleanEmail, password);
    setLoading(false);
    if (error) {
      console.error('Sign in failed', error);
      Alert.alert('Sign in failed', error.message || 'Network request failed');
      return;
    }
    if (!data?.user) {
      Alert.alert('Check your email', 'A confirmation email has been sent. Confirm your account and sign in again.');
      return;
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.top}>
            <Text style={styles.logo}>VICEVAULT</Text>
            <Text style={styles.title}>Welcome{'\n'}back.</Text>
            <Text style={styles.sub}>Your villains missed you.</Text>
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
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textGhost}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />

            <PrimaryButton
              title={loading ? 'Signing in...' : 'Sign in →'}
              onPress={handleSignIn}
              style={{ marginTop: 8 }}
            />
            <GhostButton
              title="CREATE AN ACCOUNT"
              onPress={() => navigation.navigate('SignUp')}
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
