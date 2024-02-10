import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { onSnapshot, collection, query, where, doc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from "../hooks/useAuth";
import ChatRow from './ChatRow';
import * as Sentry from "@sentry/react";
import GroupChatRow from './GroupChatRow';


const ChatList = ({ profile, requests }) => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, global.matches),
        where("userMatched", "array-contains", user.uid),
        orderBy("latest_message_timestamp", "desc")),
      (snapshot) =>
        setMatches(
          snapshot.docs.map((doc) => (
            {
              id: doc.id,
              ...doc.data(),
            }
          ))
        ),
      (error) => {
        console.log("there was an error in chatlist snapshot", error)
        Sentry.captureMessage(`error getting chatlist snapshot for ${user.uid}, ${error.message}`)

      }
    )

    return () => {
      unsub();
    };
  }, [user]);

  return (
    <View style={{paddingBottom:100}}>
      <GroupChatRow profile={profile} matches={matches} requests={requests}/>
      {matches.length > 0 && (
        <FlatList
          data={matches}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatRow matchedDetails={item} profile={profile} />
          } />
      ) }
    </View>
  )


}

export default ChatList
