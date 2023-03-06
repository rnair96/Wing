import React from 'react'
import { SafeAreaView, Text } from 'react-native';
import ChatList from './ChatList';
import Header from '../Header';

const ChatScreen = () => {

  return (
    <SafeAreaView>
        <Header title= "Matches"/>
        <ChatList/>
    </SafeAreaView>
  )
}

export default ChatScreen
