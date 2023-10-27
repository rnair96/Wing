import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from "../hooks/useAuth";
import RequestRow from './RequestRow'


const RequestsList = ({profile}) => {
    const [ requests, setRequests ] = useState([]);
    const { user } = useAuth();


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
      console.log("there was an error in requestlist snapshot", error)
    }
    )

    return () => {
      unsub();
    };
  },[user]);


    return requests.length > 0 ? (
      <FlatList
      data = {requests}
      keyExtractor = {item => item.id}
      renderItem = {({item}) => <RequestRow requestDetails = {item} profile={profile}/>
    }/>
    ):
    (
      <View style ={{flexDirection:"row", marginVertical:"60%", justifyContent:"center"}}>
        <Text style={{fontWeight:"bold"}}> No Requests At This Time </Text>
      </View>
    )
    
}

export default RequestsList
