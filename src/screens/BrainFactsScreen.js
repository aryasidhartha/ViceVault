import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Linking, ActivityIndicator, Alert } from 'react-native';
import { COLORS, FONTS } from '../utils/theme';
import { useAuth } from '../hooks/useAuth';
import { addXP } from '../utils/db';
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

export default function BrainFactsScreen({ navigation }) {
  // We use this state to capture the exact height of the viewing area
  // so our "Reels" snap perfectly regardless of device size or tab bars.
  const [containerHeight, setContainerHeight] = useState(0);
  const [factsData, setFactsData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      // Generate 30 random passive facts for the scroll feed
      const data = await getCuratedIntel(user.id, 30);
      const cutoffCard = {
        isCutoff: true,
        emoji: '🛑',
        title: 'ENOUGH INTEL',
        fact: 'You are scrolling to learn about scrolling. The irony, right? Step away from the feed, or hit the lab to test what you learned.'
      };
      setFactsData([...data, cutoffCard]);
    }
    loadData();
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={[styles.cardContainer, { height: containerHeight }]}>
      {item.isCutoff ? (
        <View style={styles.card}>
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
          <Text style={styles.cardTitle}>{item.title.toUpperCase()}</Text>
          {renderBioText(item.fact, styles.cardFact)}
          <TouchableOpacity 
            style={[styles.trainingBtn, { marginTop: 32, width: '100%' }]} 
            onPress={() => navigation.navigate('NeuroLesson')}
            activeOpacity={0.8}
          >
            <Text style={styles.trainingBtnText}>START DAILY TRAINING 🎯</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
            <Text style={styles.cardTitle}>{item.title.toUpperCase()}</Text>
            {renderBioText(item.fact, styles.cardFact)}
            
            {item.link ? (
              <TouchableOpacity 
                style={styles.deepDiveBtn} 
                onPress={() => Linking.openURL(item.link)}
                activeOpacity={0.8}
              >
                <Text style={styles.deepDiveBtnText}>{item.linkText.toUpperCase()}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>Swipe for next intel</Text>
            <Text style={styles.swipeHintArrow}>↓</Text>
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>THE NEURO-LAB</Text>
        <Text style={styles.headerSub}>Know your enemy. Understand your biology.</Text>
        <TouchableOpacity 
          style={styles.trainingBtn} 
          onPress={() => navigation.navigate('NeuroLesson')}
        >
          <Text style={styles.trainingBtnText}>START DAILY TRAINING 🎯</Text>
        </TouchableOpacity>
      </View>

      <View 
        style={styles.listWrapper} 
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        {containerHeight > 0 && factsData.length > 0 ? (
          <FlatList
            data={factsData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            bounces={false}
            decelerationRate="fast"
          />
        ) : (
          <View style={styles.loadingContainer}>
             <ActivityIndicator size="small" color={COLORS.textGhost} />
             <Text style={styles.loadingText}>Tuning into Neuro-Lab frequencies...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
  headerTitle: { fontFamily: FONTS.dmMono, fontSize: 14, color: COLORS.hero, letterSpacing: 2, marginBottom: 8 },
  headerSub: { fontFamily: FONTS.dmSans, fontSize: 14, color: COLORS.textGhost, textAlign: 'center' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.6 },
  loadingText: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textGhost, marginTop: 12, letterSpacing: 1 },
  
  trainingBtn: {
    marginTop: 16,
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  trainingBtnText: {
    fontFamily: FONTS.dmMonoMedium, fontSize: 12, color: COLORS.bg,
    letterSpacing: 1,
  },

  listWrapper: { flex: 1 },
  cardContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    backgroundColor: COLORS.bg1,
    borderWidth: 1,
    borderColor: COLORS.borderHover,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  cardEmoji: { fontSize: 64, marginBottom: 20 },
  cardTitle: { fontFamily: FONTS.dmSansMedium, fontSize: 24, color: COLORS.text, marginBottom: 16, textAlign: 'center' },
  cardFact: { fontFamily: FONTS.dmSans, fontSize: 15, color: COLORS.textMuted, lineHeight: 24, textAlign: 'center' },
  
  quizBox: { marginTop: 24, width: '100%', borderTopWidth: 1, borderColor: COLORS.border, paddingTop: 20 },
  quizQuestion: { fontFamily: FONTS.dmSansMedium, fontSize: 13, color: COLORS.text, textAlign: 'center', marginBottom: 12 },
  quizOptions: { flexDirection: 'row', gap: 8 },
  quizBtn: {
    flex: 1, backgroundColor: COLORS.bg2,
    paddingVertical: 12, borderRadius: 8,
    borderWidth: 1, borderColor: COLORS.borderHover,
    alignItems: 'center', justifyContent: 'center'
  },
  quizBtnText: { fontFamily: FONTS.dmSansMedium, fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
  
  quizResult: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
  resultCorrect: { backgroundColor: COLORS.heroDark, borderColor: COLORS.heroBorder },
  resultWrong: { backgroundColor: COLORS.accentDark, borderColor: COLORS.accentBorder },
  resultText: { fontFamily: FONTS.dmMonoMedium, fontSize: 12, color: COLORS.text, letterSpacing: 1 },

  deepDiveBtn: {
    marginTop: 32,
    backgroundColor: COLORS.heroDark,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.heroBorder,
  },
  deepDiveBtnText: { fontFamily: FONTS.dmMono, fontSize: 11, color: COLORS.hero, letterSpacing: 1 },
  
  swipeHint: {
    alignItems: 'center',
    marginTop: 40,
    opacity: 0.5,
  },
  swipeHintText: { fontFamily: FONTS.dmMono, fontSize: 10, color: COLORS.textGhost, letterSpacing: 1 },
  swipeHintArrow: { fontFamily: FONTS.dmMono, fontSize: 14, color: COLORS.textGhost, marginTop: 4 },
});