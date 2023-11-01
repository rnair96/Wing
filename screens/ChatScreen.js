import React from 'react'
import { SafeAreaView, View, Text } from 'react-native';
import ChatList from './ChatList';
import AnnouncementRow from './AnnouncementRow';

const ChatScreen = ({profile}) => {

  return (
      <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
        <AnnouncementRow/>

        <ChatList profile={profile}/>
        </SafeAreaView>

  )
}

export default ChatScreen
