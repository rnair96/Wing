import React from 'react'
import { SafeAreaView, View, Text } from 'react-native';
import ChatList from './ChatList';
import useAuth from '../hooks/useAuth';
import AnnouncementRow from './AnnouncementRow';
import Constants from 'expo-constants';


const ChatScreen = ({ profile, requests }) => {
  const { user } = useAuth();

  const { masterAccount, masterId } = Constants.expoConfig.extra

  const canInput = (user.email === masterAccount && user.uid === masterId) ? true : false;


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {canInput &&
        <AnnouncementRow profile={profile}/>
      }
      <ChatList profile={profile} requests={requests} />
    </SafeAreaView>

  )
}

export default ChatScreen
