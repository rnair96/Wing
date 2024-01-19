import React from 'react'
import { SafeAreaView, View, Text } from 'react-native';
import ChatList from './ChatList';
import AnnouncementRow from './AnnouncementRow';

const ChatScreen = ({profile, requests}) => {

  return (
      <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
        <AnnouncementRow/>
        <ChatList profile={profile} requests={requests}/>
        </SafeAreaView>

  )
}

export default ChatScreen
