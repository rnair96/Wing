import React, { Component } from 'react';
import { Text, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Header from '../Header';


const NotificationScreen = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Received background message', remoteMessage);
      });
      
      // Request permission from the user
      const handlePress = () => {
        messaging()
          .requestPermission()
          .then(() => {
            console.log('Permission granted');
          })
          .catch(error => {
            console.log('Permission denied', error);
          });
      };

    return (
      <View>
        <Header title="Set Your Notifications"/>
        <TouchableOpacity onPress={handlePress}>
            <Text>Enable Push Notifications</Text>
        </TouchableOpacity>
      </View>
    )
}

export default NotificationScreen
