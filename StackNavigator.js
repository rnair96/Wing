import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { Component, useEffect, useRef } from 'react'
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
import SetUp1Screen from './screens/SetUp1Screen';
import SetUp2Screen from './screens/SetUp2Screen';
import SetUp0Screen from './screens/SetUp0Screen';
import HelpScreen from './screens/HelpScreen';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import SignUpScreen from './screens/SignUpScreen';
import FlaggedScreen from './screens/FlaggedScreen';
import ReportOtherScreen from './screens/ReportOtherScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import PromotionScreen from './screens/PromotionScreen';
import ViewProfileScreen from './screens/ViewProfileScreen';
import ToggleProfileScreen from './screens/ToggleProfileScreen';


const Stack = createNativeStackNavigator();


const StackNavigator = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const responseListener = useRef();

    useEffect(() => {
    
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

        if(response.notification.request.content.data.type === "message" || response.notification.request.content.data.type === "rated"){
          const matchedDetails = response.notification.request.content.data.message;
          navigation.navigate("Message", { matchedDetails });
        } else if (response.notification.request.content.data.type === "match"){
          navigation.navigate("Chat");
        } else {
          navigation.navigate("Home");
        }
        
      });
    
      return () => {
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

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
            <Stack.Screen name="ViewProfile" component={ViewProfileScreen}/>
            <Stack.Screen name="PrivacyPolicy" component={PolicyScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Guidelines" component={GuideScreen} />
            <Stack.Screen name="SetUp1" component={SetUp1Screen} />
            <Stack.Screen name="SetUp2" component={SetUp2Screen} />
            <Stack.Screen name="SetUp0" component={SetUp0Screen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}/>
            <Stack.Screen name="ToggleProfile" component={ToggleProfileScreen}/>
            </Stack.Group>
            <Stack.Group screenOptions = {{presentation: "modal" }}>
            <Stack.Screen name="ProfileView" component={ProfileViewScreen} />
            <Stack.Screen name="ProfileSwipe" component={ProfileSwipeScreen}/>
            <Stack.Screen name="Flagged" component={FlaggedScreen}/>
            <Stack.Screen name="ReportOther" component={ReportOtherScreen}/>
            </Stack.Group>
            <Stack.Group screenOptions = {{presentation: "transparentModal" }}>
              <Stack.Screen name="Match" component={MatchScreen} />
              <Stack.Screen name="Promotion" component={PromotionScreen} />
            </Stack.Group>
            </>
        ) : (
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}}/>
        )}
         <Stack.Screen name="SignUp" component={SignUpScreen}/>
         <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}/>


        
      </Stack.Navigator>
    )
  }

export default StackNavigator
