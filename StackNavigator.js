import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { Component } from 'react'
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';
import MatchScreen from './screens/MatchScreen';
import useAuth from './hooks/useAuth';
import MessageScreen from './screens/MessageScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ProfileSwipeScreen from './screens/ProfileSwipeScreen';
import MissionControlScreen from './screens/MissionControlScreen';
import MatchingPreferences from './screens/MatchingPreferences';
import SettingsScreen from './screens/SettingsScreen';
import ProfileViewScreen from './screens/ProfileViewScreen';
import PolicyScreen from './screens/PolicyScreen';
import TermsScreen from './screens/TermsScreen';
import GuideScreen from './screens/GuideScreen';

const Stack = createNativeStackNavigator();


const StackNavigator = () => {
    const { user } = useAuth();

    return (
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        {user ? (
            <>
            <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Chat" component={ChatScreen}/>
            <Stack.Screen name="Message" component={MessageScreen}/>
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="MissionControl" component={MissionControlScreen}/>
            <Stack.Screen name="Preferences" component={MatchingPreferences} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
            <Stack.Screen name="PrivacyPolicy" component={PolicyScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Guidelines" component={GuideScreen} />
            </Stack.Group>
            <Stack.Group screenOptions = {{presentation: "modal" }}>
            <Stack.Screen name="ProfileView" component={ProfileViewScreen} />
            <Stack.Screen name="ProfileSwipe" component={ProfileSwipeScreen}/>
            </Stack.Group>
            <Stack.Group screenOptions = {{presentation: "transparentModal" }}>
              <Stack.Screen name="Match" component={MatchScreen} />
            </Stack.Group>
            </>
        ) : (

            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}}/>
        )}
        
      </Stack.Navigator>
    )
  }

export default StackNavigator
