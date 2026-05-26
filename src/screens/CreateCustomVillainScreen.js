import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { createCustomVillain, getCustomVillains } from '../utils/db';
import { registerCustomVillains } from '../data/villains';
import { COLORS, FONTS } from '../utils/theme';

export default function CreateCustomVillainScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [emoji, setEmoji] = useState('🚬');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [taunt, setTaunt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !type || !taunt || !emoji) {
      Alert.alert("Missing Fields", "Please fill out all fields so we can bring this villain to life.");
      return;
    }

    setLoading(true);

    // Generate a unique ID for this villain
    const customId = `custom_${Date.now()}`;

    const newVillain = {
      id: customId,
      emoji,
      name: `The ${name}`,
      type,
      defaultHP: 80,
      taunts: [
        taunt, 
        "I knew you couldn't stay away.", 
        "Back again? Typical.", 
        "You can't get rid of me that easily."
      ],
      winResponse: `Defeated the ${name}. You stayed strong.`,
      science: "When you resist this urge, you physically strengthen the neural pathways in your prefrontal cortex. This makes saying 'no' easier next time.",
      tip: "Identify your specific trigger for this habit and create an action plan to avoid or replace it.",
      hero: {
        emoji: '🛡️',
        name: 'The Guardian',
        desc: 'Protects you from your custom vice.',
        unlockPower: 80,
        unlockReward: 'Custom Victory Mode',
      }
    };

    const { error } = await createCustomVillain(user.id, newVillain);

    if (error) {
      console.error('Create villain error:', error);
      Alert.alert("Database Error", `Failed to save: ${error.message || 'Unknown error'}`);
    } else {
      // Refresh the local cache immediately so it shows up in the Picker
      const { data } = await getCustomVillains(user.id);
      if (data) registerCustomVillains(data);
      
      navigation.goBack();
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Villain</Text>
      <Text style={styles.subtitle}>What habit are you trying to defeat?</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Emoji</Text>
        <TextInput style={styles.input} value={emoji} onChangeText={setEmoji} maxLength={2} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name (e.g. Nail Biter)</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nail Biter" placeholderTextColor={COLORS.textDim} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Type / Description</Text>
        <TextInput style={styles.input} value={type} onChangeText={setType} placeholder="Biting nails when stressed" placeholderTextColor={COLORS.textDim} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Signature Taunt</Text>
        <TextInput style={styles.input} value={taunt} onChangeText={setTaunt} placeholder="Just one bite, it'll calm you down..." placeholderTextColor={COLORS.textDim} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color={COLORS.bg} /> : <Text style={styles.buttonText}>Summon Villain</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24, paddingTop: 60 },
  title: { fontFamily: FONTS.dmSansMedium, fontSize: 32, color: COLORS.accent, marginBottom: 8 },
  subtitle: { fontFamily: FONTS.dmSans, fontSize: 16, color: COLORS.textMuted, marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { fontFamily: FONTS.dmMono, fontSize: 12, color: COLORS.textDim, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: COLORS.bg1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 16, color: COLORS.text, fontFamily: FONTS.dmSans, fontSize: 16 },
  button: { backgroundColor: COLORS.accent, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  buttonText: { fontFamily: FONTS.dmSansMedium, color: COLORS.bg, fontSize: 16 },
  cancelButton: { padding: 16, alignItems: 'center', marginTop: 8 },
  cancelText: { fontFamily: FONTS.dmSans, color: COLORS.textDim, fontSize: 16 },
});