// import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import React, { Component, useEffect, useRef } from 'react'
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';
// import MatchScreen from './screens/MatchScreen';
import useAuth from './hooks/useAuth';
import MessageScreen from './screens/MessageScreen';
import EditProfileScreen from './screens/EditProfileScreen';
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
import ViewProfileScreen from './screens/ViewMyProfileScreen';
import ToggleProfileScreen from './screens/ToggleProfileScreen';
import StudentSetupScreen from './screens/StudentSetupScreen';
import SetUp3Screen from './screens/SetUp3Screen';
import SetUp4Screen from './screens/SetUp4Screen';
import SetUp5Screen from './screens/SetUp5Screen';
import AccountScreen from './screens/AccountScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ToggleChatScreen from './screens/ToggleChatScreen';
import RequestMessageScreen from './screens/RequestMessageScreen';
import AnnouncementScreen from './screens/AnnouncementScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import * as Sentry from "@sentry/react";
import GroupChatScreen from './screens/GroupChatScreen';
import GCProfileViewScreen from './screens/GCProfileViewScreen';
import GroupsScreen from './screens/GroupsScreen';
import SetUpGroupScreen from './screens/SetupGroupScreen';
import GroupsAccountScreen from './screens/GroupsAccountScreen';
import WorkshopScreen from './screens/WorkshopScreen';


const Stack = createStackNavigator();


const StackNavigator = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const responseListener = useRef();

  useEffect(() => {

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

      try {

        if (response.notification.request.content.data.type === "message") {

          const messageDetails = response.notification.request.content.data.message;
          const matchedDetails = messageDetails.matchedDetails;
          const otherProfile = messageDetails.otherProfile;
          const profile = null;

          navigation.navigate("Message", { matchedDetails, otherProfile, profile });

        } else if (response.notification.request.content.data.type === "request") {

          const messageDetails = response.notification.request.content.data.message;
          const requestDetails = messageDetails.requestDetails;
          const otherProfile = messageDetails.otherProfile
          const profile = null

          navigation.navigate("RequestMessage", { requestDetails, otherProfile, profile });

        } else if (response.notification.request.content.data.type === "announcement" || response.notification.request.content.data.type === "groupchat") {
          navigation.navigate("ToggleChat");//change to groupchat later

        } else {
          navigation.navigate("Home");

        }
      } catch (error) {
        Sentry.captureMessage("there was an error in notifications", error.message);
        navigation.navigate("Home");
      }


    }
    );

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  const customCardStyleInterpolator = ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-layouts.screen.width, 0], // Start from the right and move to the left
            }),
          },
        ],
      },
    };
  };

  const slideFromTopInterpolator = ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-layouts.screen.height, 0], // Start from the top and move to the bottom
            }),
          },
        ],
      },
    };
  };


  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}>
      {user ? (
        <>
          {/* <Stack.Group> */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Message" component={MessageScreen} />
          <Stack.Screen name="GroupChat" component={GroupChatScreen} />
          <Stack.Screen name="Menu" component={MenuScreen}
            options={{
              cardStyleInterpolator: slideFromTopInterpolator,
              gestureDirection: 'vertical-inverted',
            }}
          />
          <Stack.Screen name="MissionControl" component={MissionControlScreen} />
          <Stack.Screen name="Preferences" component={MatchingPreferences} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PolicyScreen} />
          <Stack.Screen name="Terms" component={TermsScreen} />
          <Stack.Screen name="Guidelines" component={GuideScreen} />
          <Stack.Screen name="SetUp1" component={SetUp1Screen} />
          <Stack.Screen name="SetUp2" component={SetUp2Screen} />
          <Stack.Screen name="SetUp0" component={SetUp0Screen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="ToggleProfile" component={ToggleProfileScreen}
            options={{ cardStyleInterpolator: customCardStyleInterpolator }} />

          <Stack.Screen name="ToggleChat" component={ToggleChatScreen} />
          <Stack.Screen name="StudentSetup" component={StudentSetupScreen} />
          <Stack.Screen name="SetUp3" component={SetUp3Screen} />
          <Stack.Screen name="SetUp4" component={SetUp4Screen} />
          <Stack.Screen name="SetUp5" component={SetUp5Screen} />
          <Stack.Screen name="Account" component={AccountScreen} />
          <Stack.Screen name="RequestMessage" component={RequestMessageScreen} />
          <Stack.Screen name="Announcements" component={AnnouncementScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Groups" component={GroupsScreen} />
          <Stack.Screen name="Flagged" component={FlaggedScreen} />
          <Stack.Screen name="SetUpGroup" component={SetUpGroupScreen} />
          <Stack.Screen name="GroupAccount" component={GroupsAccountScreen} />
          <Stack.Screen name="Workshop" component={WorkshopScreen} />

          {/* </Stack.Group> */}
          {/* <Stack.Group screenOptions={{ presentation: "modal" }}> */}
          <Stack.Screen
            name="ProfileView"
            component={ProfileViewScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            //   gestureDirection: 'vertical'
            }}
          />
          <Stack.Screen
            name="GCProfileView"
            component={GCProfileViewScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            //   gestureDirection: 'vertical'
            }}
          />
          <Stack.Screen
            name="ReportOther"
            component={ReportOtherScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
            }}
          />
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />



    </Stack.Navigator>
  )
}

export default StackNavigator
