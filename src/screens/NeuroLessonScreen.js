import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { COLORS, FONTS, getLevelInfo } from '../utils/theme';
import { useAuth } from '../hooks/useAuth';
import { addXP, unlockAchievement } from '../utils/db';
import { getCuratedIntel, BIO_DICTIONARY } from '../utils/aiGenerator';

// Helper function to automatically link complex biological terms
function renderBioText(text, baseStyle) {
  if (!text) return null;
  // Sort by length so longer phrases like "prefrontal cortex" match before "cortex"
  const terms = Object.keys(BIO_DICTIONARY).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');
  const parts = text.split(regex);
  
  return (
    <Text style={baseStyle}>
      {parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        if (BIO_DICTIONARY[lowerPart]) {
          return (
            <Text 
              key={index} 
              style={{ color: COLORS.accent, fontWeight: 'bold', textDecorationLine: 'underline' }}
              onPress={() => Alert.alert('🧠 ' + part.toUpperCase(), BIO_DICTIONARY[lowerPart])}
            >
              {part}
            </Text>
          );
        }
        return part; // Return plain text if not a dictionary term
      })}
    </Text>
  );
}

export default function NeuroLessonScreen({ navigation }) {
  const { user, profile, refreshProfile } = useAuth();
  
  const [lessonData, setLessonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  useEffect(() => {
    async function initLesson() {
      if (!user) return;
      const dynamicData = await getCuratedIntel(user.id, 5);
      setLessonData(dynamicData);
      setLoading(false);
    }
    initLesson();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.hero} />
        <Text style={styles.loadingText}>CURATING NEURO-DATA...</Text>
        <Text style={styles.loadingSub}>Analyzing your active villains</Text>
      </SafeAreaView>
    );
  }

  const currentFact = lessonData[currentIndex];
  const progress = (currentIndex / lessonData.length) * 100;

  const handleCheck = () => {
    if (selectedOpt === null) return;
    setChecked(true);
    if (selectedOpt === currentFact.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < lessonData.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOpt(null);
      setChecked(false);
    } else {
      // Lesson Complete Logic
      const totalEarned = score * 20; // 20 XP per correct answer
      setEarnedXP(totalEarned);
      setIsComplete(true);

      if (user && totalEarned > 0) {
        await addXP(user.id, totalEarned);
        if (score === lessonData.length) {
          await unlockAchievement(user.id, 'flawless_intel');
        }
        refreshProfile();
      }
    }
  };

  if (isComplete) {
    const totalXP = (profile?.total_xp || 0) + earnedXP;
    const levelInfo = getLevelInfo(totalXP);

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.completeScreen}>
          <Text style={styles.completeEmoji}>🎓</Text>
          <Text style={styles.completeTitle}>LESSON CLEARED</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{score}/{lessonData.length}</Text>
              <Text style={styles.statLabel}>CORRECT</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: COLORS.hero }]}>+{earnedXP}</Text>
              <Text style={styles.statLabel}>XP EARNED</Text>
            </View>
          </View>

          <View style={styles.rankBox}>
             <Text style={styles.rankLabel}>CURRENT RANK</Text>
             <Text style={styles.rankValue}>{levelInfo.current.name.toUpperCase()}</Text>
             <Text style={styles.rankSub}>{levelInfo.next ? `${Math.round(levelInfo.progress * 100)}% to ${levelInfo.next.name}` : 'Max Rank Reached'}</Text>
          </View>

          <TouchableOpacity style={[styles.actionBtn, styles.nextBtn, { marginTop: 40, width: '100%' }]} onPress={() => navigation.goBack()}>
             <Text style={styles.actionBtnText}>BACK TO LAB</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar - Duolingo Style Progress */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtnWrapper}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* The Intel Fact */}
        <View style={styles.factCard}>
          <Text style={styles.emoji}>{currentFact.emoji}</Text>
          <Text style={styles.factTitle}>{currentFact.title.toUpperCase()}</Text>
        </View>

        {/* The Question */}
        <Text style={styles.questionText}>{currentFact.q}</Text>

        {/* The Options */}
        <View style={styles.optionsList}>
          {currentFact.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = checked && currentFact.correct === i;
            const isWrong = checked && isSelected && currentFact.correct !== i;

            let optStyle = styles.optionBtn;
            let textStyle = styles.optionText;
            
            if (isSelected) optStyle = [optStyle, styles.optionSelected];
            if (isCorrect) {
              optStyle = [optStyle, styles.optionCorrect];
              textStyle = [textStyle, styles.textCorrect];
            }
            if (isWrong) {
              optStyle = [optStyle, styles.optionWrong];
              textStyle = [textStyle, styles.textWrong];
            }

            return (
              <TouchableOpacity
                key={i}
                style={optStyle}
                onPress={() => !checked && setSelectedOpt(i)}
                activeOpacity={0.8}
              >
                <Text style={textStyle}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* The Explanation (Only shows after checking) */}
        {checked && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationLabel}>THE SCIENCE</Text>
            {renderBioText(currentFact.fact, styles.explanationText)}
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        {checked ? (
          <View>
            <Text style={[styles.feedbackText, selectedOpt === currentFact.correct ? styles.textCorrect : styles.textWrong]}>
              {selectedOpt === currentFact.correct 
                ? '🎯 Exactly right!' 
                : `❌ Correct answer: ${currentFact.options[currentFact.correct]}`}
            </Text>
            <TouchableOpacity style={[styles.actionBtn, styles.nextBtn]} onPress={handleNext}>
              <Text style={styles.actionBtnText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.actionBtn, selectedOpt !== null ? styles.checkBtnReady : styles.actionBtnDisabled]}
            onPress={handleCheck}
            disabled={selectedOpt === null}
          >
            <Text style={styles.actionBtnText}>CHECK ANSWER</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: FONTS.dmMono, fontSize: 12, color: COLORS.hero, letterSpacing: 2, marginTop: 20 },
  loadingSub: { fontFamily: FONTS.dmSans, fontSize: 13, color: COLORS.textGhost, marginTop: 8 },
  
  // Top Bar
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  closeBtnWrapper: { paddingRight: 15, paddingVertical: 5 },
  closeBtn: { fontSize: 18, color: COLORS.textGhost, fontWeight: 'bold' },
  progressTrack: { height: 12, backgroundColor: COLORS.bg2, borderRadius: 6, flex: 1, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  progressFill: { height: '100%', backgroundColor: COLORS.hero, borderRadius: 6 },

  content: { flex: 1, paddingHorizontal: 28, paddingTop: 10 },
  
  // Fact Card
  factCard: { alignItems: 'center', marginBottom: 40 },
  emoji: { fontSize: 64, marginBottom: 15 },
  factTitle: { fontFamily: FONTS.dmSansMedium, fontSize: 22, color: COLORS.text, marginBottom: 12, textAlign: 'center' },
  
  // Question & Options
  questionText: { fontFamily: FONTS.dmSansMedium, fontSize: 18, color: COLORS.text, marginBottom: 20 },
  optionsList: { gap: 12, paddingBottom: 30 },
  optionBtn: { backgroundColor: COLORS.bg1, borderWidth: 2, borderColor: COLORS.border, borderRadius: 12, padding: 18 },
  optionSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.accentDark },
  optionCorrect: { borderColor: COLORS.hero, backgroundColor: COLORS.heroDark },
  optionWrong: { borderColor: COLORS.accent, backgroundColor: COLORS.accentDark, opacity: 0.6 },
  optionText: { fontFamily: FONTS.dmSansMedium, fontSize: 15, color: COLORS.textMuted },
  textCorrect: { color: COLORS.hero },
  textWrong: { color: COLORS.accent },

  // Explanation
  explanationBox: { backgroundColor: COLORS.bg1, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 30 },
  explanationLabel: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.hero, letterSpacing: 2, marginBottom: 8 },
  explanationText: { fontFamily: FONTS.dmSans, fontSize: 14, color: COLORS.textMuted, lineHeight: 22 },

  // Bottom Bar
  bottomBar: { padding: 20, borderTopWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg },
  feedbackText: { fontFamily: FONTS.dmSansMedium, fontSize: 16, marginBottom: 15, marginLeft: 5 },
  actionBtn: { paddingVertical: 18, borderRadius: 12, alignItems: 'center', backgroundColor: COLORS.bg2 },
  actionBtnDisabled: { opacity: 0.5 },
  checkBtnReady: { backgroundColor: COLORS.accent },
  nextBtn: { backgroundColor: COLORS.hero },
  actionBtnText: { fontFamily: FONTS.dmSansMedium, fontSize: 16, color: COLORS.text, letterSpacing: 1 },

  // Complete Screen
  completeScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 },
  completeEmoji: { fontSize: 80, marginBottom: 20 },
  completeTitle: { fontFamily: FONTS.bebas, fontSize: 40, color: COLORS.hero, marginBottom: 40, letterSpacing: 2 },
  
  statsRow: { flexDirection: 'row', gap: 15, width: '100%', marginBottom: 30 },
  statBox: { flex: 1, backgroundColor: COLORS.bg1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingVertical: 20, alignItems: 'center' },
  statValue: { fontFamily: FONTS.dmSansMedium, fontSize: 28, color: COLORS.text, marginBottom: 5 },
  statLabel: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textGhost, letterSpacing: 1 },
  
  rankBox: { width: '100%', backgroundColor: COLORS.heroDark, borderWidth: 1, borderColor: COLORS.heroBorder, borderRadius: 12, padding: 20, alignItems: 'center' },
  rankLabel: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textGhost, letterSpacing: 2, marginBottom: 8 },
  rankValue: { fontFamily: FONTS.bebas, fontSize: 28, color: COLORS.hero, marginBottom: 4 },
  rankSub: { fontFamily: FONTS.dmSans, fontSize: 12, color: COLORS.textMuted },
});