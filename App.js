import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from './hooks/useAuth';
import * as Sentry from "@sentry/react";


export default function App() {

  Sentry.init({
    dsn: "https://0bc9243d142d40c6bf212708414bead3@o4505071482175488.ingest.sentry.io/4505071486435328",
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
