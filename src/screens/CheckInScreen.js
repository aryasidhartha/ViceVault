import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { BackButton, VillainHPBar } from '../components/UIComponents';
import { getVillainById } from '../data/villains';
import { getVillainStates } from '../utils/db';
import { useAuth } from '../hooks/useAuth';

export default function CheckInScreen({ navigation, route }) {
  const { villainId } = route.params;
  const { user } = useAuth();
  const villain = getVillainById(villainId);
  const [hp, setHP] = useState(villain?.defaultHP ?? 70);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await getVillainStates(user.id);
      const state = data?.find(s => s.villain_id === villainId);
      if (state?.hp !== undefined) setHP(state.hp);
    }
    load();
  }, []);

  if (!villain) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.spotlight}>
          <Text style={styles.emoji}>{villain.emoji}</Text>
          <Text style={styles.villainName}>{villain.name.toUpperCase()}</Text>
          <Text style={styles.taunt}>"{villain.taunts[0]}"</Text>
        </View>
        <View style={styles.hpSection}>
          <VillainHPBar hp={hp} />
        </View>
        <Text style={styles.question}>
          Did <Text style={styles.questionBold}>{villain.name}</Text> win today?
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.btnNo}
            onPress={() => navigation.navigate('Win', { villainId })}
            activeOpacity={0.85}
          >
            <Text style={styles.btnNoText}>No, I won.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnYes}
            onPress={() => navigation.navigate('Slip', { villainId })}
            activeOpacity={0.85}
          >
            <Text style={styles.btnYesText}>Yeah, they did.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 28, paddingBottom: 60 },
  spotlight: { alignItems: 'center', paddingVertical: 28 },
  emoji: { fontSize: 80, marginBottom: 12 },
  villainName: { fontSize: 48, fontWeight: '900', letterSpacing: 2, color: COLORS.accent, marginBottom: 8 },
  taunt: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textGhost, fontStyle: 'italic', textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 },
  hpSection: { marginBottom: 32 },
  question: { fontFamily: FONTS.dmSans, fontSize: 20, color: COLORS.textMuted, textAlign: 'center', marginBottom: 28, lineHeight: 28 },
  questionBold: { color: COLORS.text, fontFamily: FONTS.dmSansMedium },
  buttons: { flexDirection: 'row', gap: 10 },
  btnNo: { flex: 1, backgroundColor: COLORS.bg2, borderWidth: 1, borderColor: COLORS.borderHover, borderRadius: 10, paddingVertical: 18, alignItems: 'center' },
  btnNoText: { fontFamily: FONTS.dmSansMedium, fontSize: 14, color: COLORS.text },
  btnYes: { flex: 1, backgroundColor: COLORS.accentDark, borderWidth: 1, borderColor: COLORS.accentBorder, borderRadius: 10, paddingVertical: 18, alignItems: 'center' },
  btnYesText: { fontFamily: FONTS.dmSansMedium, fontSize: 14, color: COLORS.accent },
});
