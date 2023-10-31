import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import ChatScreen from './ChatScreen'
import { useNavigation, useRoute} from '@react-navigation/core';
import RequestsScreen from './RequestsScreen';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import * as Sentry from "@sentry/react";

const ToggleChatScreen = () => {

  const [showMatches, setShowMatches] = useState(true);

  const navigation = useNavigation();

  const {params} = useRoute();

  const {user} = useAuth();
  
  const profile = params;

  const [ requests, setRequests] = useState([])

  useEffect(()=>{
    const unsub = onSnapshot(
      query(
        collection(db, global.users, user.uid, "requests"), 
        orderBy("timestamp", "desc")),
        ( snapshot ) => 
          setRequests(
            snapshot.docs.map((doc)=>(
          {
            id: doc.id,
              ...doc.data(),
          }
            ))
    ),
    (error) => {
      console.log("there was an error in requestlist snapshot", error);
      Sentry.captureMessage(`Error in requestlist snapshot of ${user.uid}, ${error.message}`)
    }
    )

    return () => {
      unsub();
    };
  },[]);


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.toggleIcons}>
      <TouchableOpacity style={{paddingTop:5}} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={30} color="#00BFFF"/>
            </TouchableOpacity>
        <View style={{flexDirection: 'row', width:"50%", justifyContent:'space-between',right:"20%", borderBottomWidth:1, borderColor:"#E0E0E0", marginLeft:"35%" }}>
        <TouchableOpacity style={{padding:10, alignItems:"center", justifyContent:"center"}} onPress={() => setShowMatches(true)}>
          {/* <Ionicons name="chatbubbles-sharp" size={20} color = "#00308F"/> */}
          <Text style={{color:showMatches?"#00BFFF":"#A8A8A8",fontSize:17, fontWeight:"bold"}}>Chats</Text>
          {/* {chatIndicator && <UnreadHighlighter />} */}
        </TouchableOpacity>
        <TouchableOpacity style={{padding:10, alignItems:"center", justifyContent:"center", flexDirection:"row"}} onPress={() => setShowMatches(false)}>
        {/* <Ionicons name="mail" size={20} color = "#00308F"/> */}
        <Text style={{color:showMatches?"#A8A8A8":"#00BFFF",fontSize:17, fontWeight:"bold"}}>Requests</Text>
        {requests && requests.length>0 && 
        <View style={{left:10}}>
        <MaterialCommunityIcons name="alert-circle" size={20} color="#00BFFF" />
        </View>
}
        </TouchableOpacity>
        </View>
      </SafeAreaView>
      {showMatches ? <ChatScreen profile={profile}/> : <RequestsScreen profile={profile} requests={requests}/>}
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
    marginTop:20
  },
  selectedIcon: {
    color: 'blue',
    fontSize: 24,
  },
});

export default ToggleChatScreen;