import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { PrimaryButton, GhostButton } from '../components/UIComponents';
import { verifyOtp, createProfile } from '../utils/supabase';

export default function VerifyOTPScreen({ route, navigation }) {
  const { phone, isSignUp } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    const cleanCode = code.trim();
    if (!cleanCode) {
      Alert.alert('Missing code', 'Enter the verification code.');
      return;
    }
    setLoading(true);
    const { data, error } = await verifyOtp(phone, cleanCode);
    setLoading(false);
    if (error) {
      console.error('Verify OTP failed', error);
      Alert.alert('Verification failed', error.message || 'Invalid code');
      return;
    }

    const userId = data?.user?.id;
    if (!userId) {
      Alert.alert('Error', 'Could not retrieve user after verification');
      return;
    }

    if (isSignUp) {
      // Create profile for new signups
      const { error: profileError } = await createProfile(userId);
      if (profileError) {
        Alert.alert('Profile creation failed', profileError.message);
      } else {
        navigation.navigate('CreateProfile');
      }
    } else {
      // Sign in - let AuthContext handle navigation
      navigation.navigate('HomeScreen');
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
            <Text style={styles.title}>Verify{'\n'}your number.</Text>
            <Text style={styles.sub}>We sent a code to {phone}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>VERIFICATION CODE</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="000000"
              placeholderTextColor={COLORS.textGhost}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              maxLength={6}
            />

            <PrimaryButton
              title={loading ? 'Verifying...' : 'Verify code →'}
              onPress={handleVerify}
              style={{ marginTop: 8 }}
            />

            <GhostButton
              title="DIDN'T GET A CODE"
              onPress={() => navigation.goBack()}
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
