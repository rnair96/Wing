import React from 'react'
import { SafeAreaView, View, Text } from 'react-native';
import ChatList from './ChatList';
import AnnouncementRow from './AnnouncementRow';

const ChatScreen = ({profile}) => {

  //perhaps if I can see if the value of latest announcement is read, I can set it below Chatlist, otherwise set it above

  return (
    // <View style={{flex:1, backgroundColor:"black"}}>
      <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
        {/* <Header title= "Matches"/> */}
        {/* <View style={{alignItems:'center', justifyContent:"center", width:"100%"}}> */}
        {/* <Text style={{color:"#00BFFF", padding:10, fontWeight:"bold", fontSize:20}}>Active Chats</Text> */}
        {/* </View> */}
        <AnnouncementRow profile={profile}/>

        <ChatList/>
        </SafeAreaView>
    // </View>

  )
}

export default ChatScreen
