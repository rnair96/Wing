import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from './hooks/useAuth';
import * as Sentry from "@sentry/react";
import { ErrorBoundary } from '@sentry/react';
import Constants from 'expo-constants';
import { Text, View} from 'react-native'



export default function App() {

  const { sentryId } = Constants.expoConfig.extra

  Sentry.init({
    dsn: sentryId,
    enableInExpoDevelopment: false,
    debug: false, // If using `expo start`, turn this off.
  });


  return (
    <ErrorBoundary fallback={({ error, resetError }) => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Something went wrong:</Text>
    <Button title="Try again" onPress={() => resetError()} />
  </View>
    )}>
      <NavigationContainer>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
