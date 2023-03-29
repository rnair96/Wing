import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { onSnapshot, collection, query, where, doc, orderBy } from 'firebase/firestore';
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
        where("userMatched", "array-contains", user.uid),
        orderBy("latest_message_timestamp", "desc")),
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


    return matches.length > 0 ? (
      <FlatList
      data = {matches}
      keyExtractor = {item => item.id}
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
