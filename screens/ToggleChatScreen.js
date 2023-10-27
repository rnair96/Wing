import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import ChatScreen from './ChatScreen'
import { useNavigation, useRoute} from '@react-navigation/core';
import RequestsScreen from './RequestsScreen';


const ToggleChatScreen = () => {

  const [showMatches, setShowMatches] = useState(true);

  const navigation = useNavigation();

  const {params} = useRoute();
  
  const profile = params;


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.toggleIcons}>
      <TouchableOpacity style={{paddingTop:20 }} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={30} color="#00BFFF"/>
            </TouchableOpacity>
        <View style={{flexDirection: 'row', width:"50%", height:"80%",justifyContent:'space-between',right:"20%", top:10, borderBottomWidth:1, borderColor:"#E0E0E0", marginLeft:"35%" }}>
        <TouchableOpacity style={{padding:10, alignItems:"center", justifyContent:"center"}} onPress={() => setShowMatches(true)}>
          {/* <Ionicons name="chatbubbles-sharp" size={20} color = "#00308F"/> */}
          <Text style={{color:showMatches?"#00BFFF":"#A8A8A8",fontSize:17, fontWeight:"bold"}}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding:10, alignItems:"center", justifyContent:"center"}} onPress={() => setShowMatches(false)}>
        {/* <Ionicons name="mail" size={20} color = "#00308F"/> */}
        <Text style={{color:showMatches?"#A8A8A8":"#00BFFF",fontSize:17, fontWeight:"bold"}}>Requests</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
      {showMatches ? <ChatScreen profile={profile}/> : <RequestsScreen profile={profile}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
    backgroundColor:"white"
  },
  toggleIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 40,
  },
  selectedIcon: {
    color: 'blue',
    fontSize: 24,
  },
});

export default ToggleChatScreen;