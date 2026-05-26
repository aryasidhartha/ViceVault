import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { PrimaryButton, GhostButton } from '../components/UIComponents';

export default function IntroScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.logo}>VICEVAULT</Text>
          <Text style={styles.title}>
            YOUR{'\n'}VICES{'\n'}<Text style={styles.titleAccent}>AREN'T</Text>{'\n'}WINNING.
          </Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.statement}>
            Not through discipline.{'\n'}Not through guilt.{'\n'}
            <Text style={styles.statementBold}>Through honesty.</Text>
          </Text>
          <View>
            <PrimaryButton title="Let's go →" onPress={() => navigation.navigate('Manifesto')} />
            <GhostButton 
              title="ALREADY HAVE AN ACCOUNT" 
              onPress={() => navigation.navigate('SignIn')} 
              style={{ marginTop: 12 }} 
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: 28, paddingBottom: 40, justifyContent: 'space-between' },
  top: { paddingTop: 32 },
  logo: {
    fontFamily: FONTS.dmMonoMedium,
    fontSize: 13,
    letterSpacing: 4,
    color: COLORS.accent,
    opacity: 0.8,
    marginBottom: 16,
  },
  title: {
    fontSize: 72,
    lineHeight: 72,
    color: COLORS.text,
    fontWeight: '900',
    letterSpacing: 2,
  },
  titleAccent: { color: COLORS.accent },
  bottom: { gap: 32 },
  statement: {
    fontFamily: FONTS.dmSans,
    fontSize: 22,
    lineHeight: 32,
    color: COLORS.textMuted,
    fontWeight: '300',
  },
  statementBold: {
    color: COLORS.text,
    fontFamily: FONTS.dmSansMedium,
    fontWeight: '500',
  },
});
