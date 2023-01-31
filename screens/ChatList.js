import React, { Component, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase'
import useAuth from "../hooks/useAuth"


const ChatList = () => {
    const { matches, setMatches } = useState([]);
    const { user } = useAuth();


  useEffect(()=>{
    onSnapshot(query(collection(db, "matches"), 
    where("userMatched", "array-contains", user.uid)),( snapshot ) => 
    console.log("snapshot", snapshot.docs)
    // setMatches(
    //   snapshot.docs.map((doc)=>({
    //   id: doc.id,
    //   ...doc.data(),
    //   }))
    // )
    )
  },[])


    return (
      <View>
        <Text> Chatlist... </Text>
      </View>
    )
}

export default ChatList
