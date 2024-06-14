import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
// import {applicationId} from "expo-application";
import Constants from 'expo-constants';
import { Platform} from 'react-native';



async function registerNotifications() {
    const {projectId} = Constants.expoConfig.extra
    let token;    

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        token = "not_granted"
        return token;
      }
      token = (await Notifications.getExpoPushTokenAsync(
        {
        projectId: projectId,
        development: false
      }
      )).data;
    } else {
      alert('Must use physical device for Push Notifications');
      token="testing"
    }
  
    return token;
  }

export default registerNotifications;