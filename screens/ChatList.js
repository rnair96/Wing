import React, { Component, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { onSnapshot, collection, query, where, doc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from "../hooks/useAuth";
import ChatRow from './ChatRow';


const ChatList = () => {
    const [ matches, setMatches ] = useState([]);
    const { user } = useAuth();


  useEffect(()=>{
    onSnapshot(
      query(
        collection(db, "matches"), 
        where("userMatched", "array-contains", user.uid)),
        ( snapshot ) => 
          setMatches(
            snapshot.docs.map((doc)=>(
          {
            id: doc.id,
              ...doc.data(),
          }
            ))
    )
    )
  },[user]);


  function sortByLatestTimestamp() {
    return matches.sort((a, b) => new Date(b.latestMessageTimeStamp) - new Date(a.latestMessageTimeStamp));
  }


  console.log("matches",matches);

    return matches.length > 0 ? (
      <FlatList
      data = {sortByLatestTimestamp()}
      // data = {matches}
      keyExtractor = {item => item.id}//order Flatlist by latest timestamp of last message
      renderItem = {({item}) => <ChatRow matchedDetails = {item}/>
    }/>
    ):
    (
      <View style ={{flexDirection:"row", marginVertical:"60%", justifyContent:"center"}}>
        <Text style={{fontWeight:"bold"}}> No Matches At This Time </Text>
      </View>
    )
    
}

export default ChatList
