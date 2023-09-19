import React from 'react'
import { SafeAreaView, View, Text } from 'react-native';
import ChatList from './ChatList';
import Header from '../Header';
import AnnouncementRow from './AnnouncementRow';

const ChatScreen = () => {

  return (
    // <View style={{flex:1, backgroundColor:"black"}}>
      <SafeAreaView style={{flex:1, backgroundColor:"black"}}>
        {/* <Header title= "Matches"/> */}
        <View style={{alignItems:'center', justifyContent:"center", width:"100%"}}>
        <AnnouncementRow/>
        <Text style={{color:"#00BFFF", padding:10, fontWeight:"bold", fontSize:20}}>Matches</Text>
        </View>


        <ChatList/>
        </SafeAreaView>
    // </View>

  )
}

export default ChatScreen
