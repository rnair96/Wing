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

  const [userProfile, setUserProfile] = useState(profile);

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

  useEffect(() => {
    let isCancelled = false; // cancel flag

    if (!profile) {
      console.log("fetching user data...")
      const fetchUserData = async () => {
        try {
          const userSnap = await getDoc(doc(db, global.users, user.uid));
          setUserProfile({
            id: user.uid,
            ...userSnap.data()
          })
        } catch (error) {
          if (!isCancelled) {
            console.log("incomplete fetch data:", error);
            Sentry.captureMessage(`Cancelled fetching user data in message screen of ${user.uid}, ${error.message}`)

          }
          console.log("error fetching userdata")
          Sentry.captureMessage(`error fetching user data in message screen of ${user.uid}, ${error.message}`)

        }


      }

      fetchUserData();

      return () => {
        isCancelled = true;
      };
    }
  }, [profile, db])


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.toggleIcons}>
      <TouchableOpacity style={{paddingTop:5}} onPress={() =>  navigation.navigate("Home", { refresh: true })}>
            <Ionicons name="chevron-back-outline" size={30} color="#00308F"/>
            </TouchableOpacity>
        <View style={{flexDirection: 'row', width:"50%", justifyContent:'space-between',right:"20%", borderBottomWidth:1, borderColor:"#E0E0E0", marginLeft:"35%" }}>
        <TouchableOpacity style={{padding:10, alignItems:"center", justifyContent:"center"}} onPress={() => setShowMatches(true)}>
          {/* <Ionicons name="chatbubbles-sharp" size={20} color = "#00308F"/> */}
          <Text style={{color:showMatches?"#00308F":"#A8A8A8",fontSize:17, fontWeight:"bold"}}>Chats</Text>
          {/* {chatIndicator && <UnreadHighlighter />} */}
        </TouchableOpacity>
        <TouchableOpacity style={{padding:10, alignItems:"center", justifyContent:"center", flexDirection:"row"}} onPress={() => setShowMatches(false)}>
        {/* <Ionicons name="mail" size={20} color = "#00308F"/> */}
        <Text style={{color:showMatches?"#A8A8A8":"#00308F",fontSize:17, fontWeight:"bold"}}>Requests</Text>
        {requests && requests.length>0 && 
        <View style={{left:10}}>
        <MaterialCommunityIcons name="alert-circle" size={20} color="#00BFFF" />
        </View>
}
        </TouchableOpacity>
        </View>
      </SafeAreaView>
      {showMatches ? <ChatScreen profile={userProfile} requests={requests}/> : <RequestsScreen profile={userProfile} requests={requests}/>}
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
    marginTop:30
  },
  selectedIcon: {
    color: 'blue',
    fontSize: 24,
  },
});

export default ToggleChatScreen;