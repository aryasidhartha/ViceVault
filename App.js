import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';

import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { COLORS } from './src/utils/theme';
import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';
import CreateProfileScreen from './src/screens/CreateProfileScreen';
import IntroScreen from './src/screens/IntroScreen';
import ManifestoScreen from './src/screens/ManifestoScreen';
import VillainPickerScreen from './src/screens/VillainPickerScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import WinScreen from './src/screens/WinScreen';
import SlipScreen from './src/screens/SlipScreen';
import MainTabs from './src/components/MainTabs';
import HeroDetailScreen from './src/screens/HeroDetailScreen';
import VillainDetailScreen from './src/screens/VillainDetailScreen';
import NeuroLessonScreen from './src/screens/NeuroLessonScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();
const screenOpts = { headerShown: false, cardStyle: { backgroundColor: COLORS.bg }, gestureEnabled: true };

function RootNavigator() {
  const { user, profile, loading } = useAuth();
  if (loading) return null;

  if (!user) {
    return (
      <Stack.Navigator screenOptions={screenOpts}>
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Manifesto" component={ManifestoScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
      </Stack.Navigator>
    );
  }

  if (!profile?.username) {
    return (
      <Stack.Navigator screenOptions={screenOpts}>
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        <Stack.Screen name="Manifesto" component={ManifestoScreen} />
        <Stack.Screen name="VillainPicker" component={VillainPickerScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="CheckIn" component={CheckInScreen} />
        <Stack.Screen name="Win" component={WinScreen} />
        <Stack.Screen name="Slip" component={SlipScreen} />
        <Stack.Screen name="HeroDetail" component={HeroDetailScreen} />
        <Stack.Screen name="VillainDetail" component={VillainDetailScreen} />
        <Stack.Screen name="NeuroLesson" component={NeuroLessonScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="CheckIn" component={CheckInScreen} />
      <Stack.Screen name="Win" component={WinScreen} />
      <Stack.Screen name="Slip" component={SlipScreen} />
      <Stack.Screen name="VillainPicker" component={VillainPickerScreen} />
      <Stack.Screen name="Manifesto" component={ManifestoScreen} />
      <Stack.Screen name="HeroDetail" component={HeroDetailScreen} />
      <Stack.Screen name="VillainDetail" component={VillainDetailScreen} />
      <Stack.Screen name="NeuroLesson" component={NeuroLessonScreen} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { loading } = useAuth();
  const [fontsLoaded] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMMono_400Regular, DMMono_500Medium });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !loading) await SplashScreen.hideAsync();
  }, [fontsLoaded, loading]);

  if (!fontsLoaded || loading) return null;

  return (
    <View style={styles.root} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: COLORS.bg } });
