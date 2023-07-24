import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from './hooks/useAuth';
import * as Sentry from "@sentry/react";
import Constants from 'expo-constants';


export default function App() {

  const {SENTRY_ID} = Constants.manifest.extra

  Sentry.init({
    dsn: SENTRY_ID,
    enableInExpoDevelopment: false,
    debug: true, // If using `expo start`, turn this off.
  });


  return (
    <NavigationContainer>
      <AuthProvider>
      <StackNavigator/>
      </AuthProvider>
    </NavigationContainer>
  );
}
