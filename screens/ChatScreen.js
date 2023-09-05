import React from 'react'
import { SafeAreaView, View } from 'react-native';
import ChatList from './ChatList';
import Header from '../Header';

const ChatScreen = () => {

  return (
    <View style={{flex:1, backgroundColor:"black"}}>
      <SafeAreaView>
        <Header title= "Matches"/>
        </SafeAreaView>


        <ChatList/>
    </View>

  )
}

export default ChatScreen
