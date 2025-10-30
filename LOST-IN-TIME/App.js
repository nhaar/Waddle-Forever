import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TableScreen from './src/screens/TableScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import IdRoomSettingsScreen from './src/screens/IdRoomSettingsScreen';
import PartiesSettingsScreen from './src/screens/PartiesSettingsScreen';
import ChecklistSettingsScreen from './src/screens/ChecklistSettingsScreen';
import CalendarIconsSettingsScreen from './src/screens/CalendarIconsSettingsScreen';
import CalendarHolidaysSettingsScreen from './src/screens/CalendarHolidaysSettingsScreen';
import RoomFilterScreen from './src/screens/RoomFilterScreen';
import PreferencesScreen from './src/screens/PreferencesScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import AccessControlScreen from './src/screens/AccessControlScreen';
import { RoomRecordsProvider } from './src/context/RoomRecordsContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { CalendarStatusProvider } from './src/context/CalendarStatusContext';
import { AccessControlProvider } from './src/context/AccessControlContext';
import { useTranslation } from './src/hooks/useTranslation';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: t('nav.home') }} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: t('nav.register') }}
      />
      <Stack.Screen
        name="Table"
        component={TableScreen}
        options={{ title: t('nav.table') }}
      />
      <Stack.Screen
        name="RoomFilters"
        component={RoomFilterScreen}
        options={{ title: t('nav.roomFilters') }}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: t('nav.calendar') }}
      />
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{ title: t('nav.preferences') }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('nav.settings') }}
      />
      <Stack.Screen
        name="IdRoomSettings"
        component={IdRoomSettingsScreen}
        options={{ title: t('nav.idRoomSettings') }}
      />
      <Stack.Screen
        name="PartiesSettings"
        component={PartiesSettingsScreen}
        options={{ title: t('nav.partiesSettings') }}
      />
      <Stack.Screen
        name="ChecklistSettings"
        component={ChecklistSettingsScreen}
        options={{ title: t('nav.checklistSettings') }}
      />
      <Stack.Screen
        name="CalendarIconsSettings"
        component={CalendarIconsSettingsScreen}
        options={{ title: t('nav.calendarIconsSettings') }}
      />
      <Stack.Screen
        name="CalendarHolidaysSettings"
        component={CalendarHolidaysSettingsScreen}
        options={{ title: t('nav.calendarHolidaysSettings') }}
      />
      <Stack.Screen
        name="AccessControl"
        component={AccessControlScreen}
        options={{ title: t('nav.accessControl') }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AccessControlProvider>
      <RoomRecordsProvider>
        <SettingsProvider>
          <CalendarStatusProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </CalendarStatusProvider>
        </SettingsProvider>
      </RoomRecordsProvider>
    </AccessControlProvider>
  );
}
