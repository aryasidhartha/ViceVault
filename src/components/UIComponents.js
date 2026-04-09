import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../utils/theme';

// ── XP Bar ──────────────────────────────────────────────────────────────────
export function XPBar({ xp, progress, levelName }) {
  return (
    <View style={xpStyles.wrap}>
      <View style={xpStyles.row}>
        <View style={xpStyles.badge}>
          <Text style={xpStyles.badgeText}>{levelName.toUpperCase()}</Text>
        </View>
        <Text style={xpStyles.xpLabel}>{xp} XP</Text>
      </View>
      <View style={xpStyles.track}>
        <View style={[xpStyles.fill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const xpStyles = StyleSheet.create({
  wrap: { marginTop: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  badge: { backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4 },
  badgeText: { fontFamily: FONTS.dmMonoMedium, fontSize: 10, letterSpacing: 2, color: COLORS.bg },
  xpLabel: { fontFamily: FONTS.dmMono, fontSize: 11, color: COLORS.textGhost, letterSpacing: 1 },
  track: { height: 3, backgroundColor: COLORS.bg2, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 2 },
});

// ── Primary Button ───────────────────────────────────────────────────────────
export function PrimaryButton({ title, onPress, style }) {
  return (
    <TouchableOpacity style={[btnStyles.primary, style]} onPress={onPress} activeOpacity={0.85}>
      <Text style={btnStyles.primaryText}>{title}</Text>
    </TouchableOpacity>
  );
}

// ── Ghost Button ─────────────────────────────────────────────────────────────
export function GhostButton({ title, onPress, style }) {
  return (
    <TouchableOpacity style={[btnStyles.ghost, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={btnStyles.ghostText}>{title}</Text>
    </TouchableOpacity>
  );
}

const btnStyles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: FONTS.dmSansMedium,
    fontSize: 15,
    color: COLORS.bg,
    letterSpacing: 0.3,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  ghostText: {
    fontFamily: FONTS.dmMono,
    fontSize: 11,
    letterSpacing: 2,
    color: COLORS.textGhost,
  },
});

// ── Villain HP Bar ───────────────────────────────────────────────────────────
export function VillainHPBar({ hp, label = true }) {
  return (
    <View>
      {label && (
        <View style={hpStyles.labelRow}>
          <Text style={hpStyles.label}>VILLAIN HP</Text>
          <Text style={hpStyles.value}>{hp}%</Text>
        </View>
      )}
      <View style={hpStyles.track}>
        <View style={[hpStyles.fill, { width: `${hp}%` }]} />
      </View>
    </View>
  );
}

const hpStyles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontFamily: FONTS.dmMono, fontSize: 9, letterSpacing: 2, color: COLORS.textDeep },
  value: { fontFamily: FONTS.dmMono, fontSize: 9, color: COLORS.accent },
  track: { height: 6, backgroundColor: COLORS.bg2, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 4 },
});

// ── Hero Power Bar ───────────────────────────────────────────────────────────
export function HeroPowerBar({ power, label = true }) {
  return (
    <View>
      {label && (
        <View style={heroStyles.labelRow}>
          <Text style={heroStyles.label}>HERO POWER</Text>
          <Text style={heroStyles.value}>{power}%</Text>
        </View>
      )}
      <View style={heroStyles.track}>
        <View style={[heroStyles.fill, { width: `${power}%` }]} />
      </View>
    </View>
  );
}

const heroStyles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontFamily: FONTS.dmMono, fontSize: 9, letterSpacing: 2, color: COLORS.textDeep },
  value: { fontFamily: FONTS.dmMono, fontSize: 9, color: COLORS.hero },
  track: { height: 4, backgroundColor: COLORS.bg2, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.hero, borderRadius: 2 },
});

// ── XP Pop Badge ─────────────────────────────────────────────────────────────
export function XPPop({ amount, sub }) {
  return (
    <View style={popStyles.wrap}>
      <Text style={popStyles.amount}>+ {amount} XP</Text>
      {sub && <Text style={popStyles.sub}>{sub}</Text>}
    </View>
  );
}

const popStyles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 20 },
  amount: { fontFamily: FONTS.dmMonoMedium, fontSize: 22, color: COLORS.accent },
  sub: { fontFamily: FONTS.dmSans, fontSize: 12, color: COLORS.textGhost, marginTop: 4 },
});

// ── Science Card ─────────────────────────────────────────────────────────────
export function ScienceCard({ text }) {
  return (
    <View style={cardStyles.sciWrap}>
      <Text style={cardStyles.tag}>WHAT JUST HAPPENED</Text>
      <Text style={cardStyles.text}>{text}</Text>
    </View>
  );
}

// ── Tip Card ─────────────────────────────────────────────────────────────────
export function TipCard({ text }) {
  return (
    <View style={cardStyles.tipWrap}>
      <Text style={cardStyles.tipTag}>ONE THING</Text>
      <Text style={cardStyles.text}>{text}</Text>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  sciWrap: {
    backgroundColor: COLORS.bg1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 18,
    marginBottom: 10,
  },
  tipWrap: {
    backgroundColor: COLORS.heroDark,
    borderWidth: 1,
    borderColor: COLORS.heroBorder,
    borderRadius: 10,
    padding: 18,
    marginBottom: 10,
  },
  tag: { fontFamily: FONTS.dmMono, fontSize: 9, letterSpacing: 2, color: COLORS.accent, marginBottom: 8 },
  tipTag: { fontFamily: FONTS.dmMono, fontSize: 9, letterSpacing: 2, color: COLORS.hero, marginBottom: 8 },
  text: { fontFamily: FONTS.dmSans, fontSize: 14, color: COLORS.textMuted, lineHeight: 22 },
});

// ── Section Label ────────────────────────────────────────────────────────────
export function SectionLabel({ text }) {
  return <Text style={secStyles.label}>{text}</Text>;
}

const secStyles = StyleSheet.create({
  label: {
    fontFamily: FONTS.dmMono,
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.textDeep,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
});

// ── Back Button ──────────────────────────────────────────────────────────────
export function BackButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={backStyles.btn}>
      <Text style={backStyles.text}>← BACK</Text>
    </TouchableOpacity>
  );
}

const backStyles = StyleSheet.create({
  btn: { paddingBottom: 20 },
  text: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textDeep, letterSpacing: 2 },
});
