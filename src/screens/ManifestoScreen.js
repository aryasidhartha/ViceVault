import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, Animated, Alert,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { PrimaryButton } from '../components/UIComponents';

const LINES = [
  { tag: 'The rule', text: 'Be honest. ', bold: 'Even when it\'s embarrassing.' },
  { tag: 'Why it pays', text: 'Admitting a slip ', bold: 'earns more XP than faking a win.' },
  { tag: 'Your privacy', text: '', bold: 'Everything stays on your device.', after: ' No account. No server. Nobody watching.' },
  { tag: 'The only way to lose', text: 'Lying to yourself. ', bold: 'Not slipping - everyone slips.' },
];

function ManifestLine({ tag, text, bold, after, delay }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.line, { opacity, transform: [{ translateX }] }]}>
      <View style={styles.lineBar} />
      <View style={styles.lineContent}>
        <Text style={styles.lineTag}>{tag.toUpperCase()}</Text>
        <Text style={styles.lineText}>
          {text}
          <Text style={styles.lineBold}>{bold}</Text>
          {after || ''}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ManifestoScreen({ navigation }) {
  const [ctaVisible, setCtaVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCtaVisible(true), 300 + LINES.length * 500 + 300);
    return () => clearTimeout(t);
  }, []);

  function handleContinue() {
    navigation.navigate('SignUp');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>BEFORE WE START</Text>
          <View style={styles.lines}>
            {LINES.map((line, i) => (
              <ManifestLine key={i} {...line} delay={300 + i * 500} />
            ))}
          </View>
        </View>

        <Animated.View style={{ opacity: ctaVisible ? 1 : 0 }}>
          <PrimaryButton
            title={loading ? 'Getting started...' : "I'll be honest"}
            onPress={handleContinue}
            disabled={loading}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: 28, paddingBottom: 40, justifyContent: 'space-between' },
  header: {
    fontFamily: FONTS.dmMono,
    fontSize: 10,
    letterSpacing: 3,
    color: COLORS.accent,
    marginBottom: 32,
    marginTop: 32,
  },
  lines: { gap: 24 },
  line: { flexDirection: 'row', gap: 16 },
  lineBar: { width: 2, backgroundColor: COLORS.accent, borderRadius: 1 },
  lineContent: { flex: 1 },
  lineTag: {
    fontFamily: FONTS.dmMono,
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.accent,
    marginBottom: 4,
  },
  lineText: { fontFamily: FONTS.dmSans, fontSize: 15, color: COLORS.textMuted, lineHeight: 22 },
  lineBold: { fontFamily: FONTS.dmSansMedium, color: COLORS.text },
});
