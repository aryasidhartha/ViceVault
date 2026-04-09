import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { PrimaryButton, GhostButton } from '../components/UIComponents';
import { signIn } from '../utils/supabase';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await signIn(email.trim().toLowerCase(), password);
    setLoading(false);
    if (error) Alert.alert('Sign in failed', error.message);
    // On success, AuthContext detects the session and App.js navigates automatically
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
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textGhost}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={COLORS.textGhost}
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
