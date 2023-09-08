import React from 'react'
import { SafeAreaView, View } from 'react-native';
import ChatList from './ChatList';
import Header from '../Header';

const ChatScreen = () => {

  return (
    // <View style={{flex:1, backgroundColor:"black"}}>
      <SafeAreaView style={{flex:1, backgroundColor:"black"}}>
        <Header title= "Matches"/>


        <ChatList/>
        </SafeAreaView>
    // </View>

  )
}

export default ChatScreen
