import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from './hooks/useAuth';
import * as Sentry from "@sentry/react";
import Constants from 'expo-constants';



export default function App() {

  const { sentryId } = Constants.expoConfig.extra

  Sentry.init({
    dsn: sentryId,
    enableInExpoDevelopment: false,
    debug: false, // If using `expo start`, turn this off.
  });


  return (
  
      <NavigationContainer>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
      </NavigationContainer>
  );
}
