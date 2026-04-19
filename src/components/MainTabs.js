import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SquadScreen from '../screens/SquadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BrainFactsScreen from '../screens/BrainFactsScreen';
import { COLORS, FONTS } from '../utils/theme';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'HomeTab', label: 'HOME', component: HomeScreen },
  { name: 'SquadTab', label: 'SQUAD', component: SquadScreen },
  { name: 'LabTab', label: 'LAB', component: BrainFactsScreen },
  { name: 'ProfileTab', label: 'PROFILE', component: ProfileScreen },
];

function TabBar({ state, navigation }) {
  return (
    <View style={barStyles.bar}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = TABS[index];
        return (
          <TouchableOpacity
            key={route.key}
            style={barStyles.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Text style={[barStyles.label, focused && barStyles.labelActive]}>
              {tab?.label}
            </Text>
            {focused && <View style={barStyles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const barStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 28,
    paddingTop: 12,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontFamily: FONTS.dmMono, fontSize: 10, letterSpacing: 2, color: COLORS.textDeep },
  labelActive: { color: COLORS.accent },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.accent },
});

export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TABS.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}
