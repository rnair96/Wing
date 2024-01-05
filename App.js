import React, {useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from './hooks/useAuth';
import * as Sentry from "@sentry/react";
import Constants from 'expo-constants';
// import * as Font from 'expo-font';
// import { useFonts } from 'expo-font';



export default function App() {
  // const [fontsLoaded, setFontsLoaded] = useState(false);

  const { sentryId } = Constants.expoConfig.extra

  Sentry.init({
    dsn: sentryId,
    enableInExpoDevelopment: false,
    debug: false, // If using `expo start`, turn this off.
  });

  // useEffect(() => {
  //   async function loadFonts() {
  //     await Font.loadAsync({
  //       'TimesNewRoman': require('./assets/fonts/times_new_roman.ttf'),
  //       // Add other fonts here as needed
  //     });
  //     setFontsLoaded(true);
  //   }

  //   loadFonts();
  // }, []);

  // if (!fontsLoaded) {
  //   return null; // Or some loading component
  // }

  // const [fontsLoaded] = useFonts({
  //   'TimesNewRoman': require('./assets/fonts/times_new_roman.ttf'),
  // });

  // if (!fontsLoaded) {
  //     return null; // Or some loading component
  //   } else {
  //     console.log("font is loaded", fontsLoaded)
  //   }


  return (
  
      <NavigationContainer>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
      </NavigationContainer>
  );
}
