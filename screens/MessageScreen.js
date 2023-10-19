import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, TextInput, Button, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, Image } from 'react-native';
import ChatHeader from '../components/ChatHeader';
import useAuth from '../hooks/useAuth';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import sendPush from '../lib/sendPush';
import * as Sentry from "@sentry/react";

const MessageScreen = () => {

  const { params } = useRoute();
  const { matchedDetails, profile } = params;
  const [input, setInput] = useState();
  const [messages, setMessages] = useState([])
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  // const matchedUser = getMatchedUserInfo(matchedDetails.users,user.uid);


  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, global.matches, matchedDetails.id, "messages"),
      orderBy("timestamp", "desc")),
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })
        ))
      },
      (error) => {
        console.log("there was an error in message screen snapshot", error)
      })

    setLoading(false);

    return () => {
      unsub();
    };

  }, [matchedDetails, db]);

  useEffect(() => {
    if (messages.length > 0 && messages[0].userId !== user.uid && !(messages[0].read)) {
      updateDoc(doc(db, global.matches, matchedDetails.id, "messages", messages[0].id), {
        read: true,
      })
    }
  }, [messages])

  const sendMessage = () => {
    const timestamp = serverTimestamp();
    addDoc(collection(db, global.matches, matchedDetails.id, "messages"), {
      timestamp: timestamp,
      userId: user.uid,
      displayName: user.displayName,
      message: input,
      read: false,
    })

    updateDoc(doc(db, global.matches, matchedDetails.id), {
      latest_message_timestamp: timestamp
    })

    const userName = user.displayName.split(" ")[0];

    Sentry.captureMessage(`does profile have token at message? ${profile.token}`)
    console.log(`Does profile token exist at message? ${profile.token}`)

    if (profile.token && profile.token !== "testing" && profile.token !== "not_granted") {

      const messageDetails = { "matchedDetails": matchedDetails, "profile": profile }

      Sentry.captureMessage(`sending message token to ${profile.token}`)
      // Sentry.captureMessage(`sending message details ${messageDetails}`)
      Sentry.captureMessage(`sending message from ${userName}`)

      // console.log(`sending message token to ${profile.token}`)
      // console.log(`sending message details ${messageDetails}`)
      // console.log(`sending message from ${userName}`)

      sendPush(profile.token, `New Message from ${userName}`, input, { type: "message", message: messageDetails })

    }

    setInput("");

  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ChatHeader matchedDetails={matchedDetails} profile={profile} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={10}>

        {!loading &&
          <TouchableWithoutFeedback
          // onPress={Keyboard.dismiss()}
          >

            <FlatList
              data={messages}
              style={{}}
              inverted={-1}
              keyExtractor={(item) => item.id}
              renderItem={({ item: message }) =>
                message.userId === user.uid ? (
                  <SenderMessage key={message.id} message={message} />
                ) : (
                  <View style={{ padding: 10, maxWidth: 250, marginRight: "auto", alignSelf: "flex-start", flexDirection: "row" }}>
                    {profile ? (
                      <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF"}}
                        source={{ uri: profile.images[0] }} />
                    ) : (
                      <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }}
                        source={require("../images/account.jpeg")} />
                    )}
                    <RecieverMessage key={message.id} message={message} />

                  </View>
                )
              }
            />

          </TouchableWithoutFeedback>
        }
        {/* <View style={{flexDirection:"row", justifyContent:"flex-end", bottom:10, padding:10}}>
        <TouchableOpacity style={styles.missionControl} onPress={()=>navigation.navigate("MissionControl")}>
                <Entypo name="aircraft-take-off" size={30} color="blue"/>
        </TouchableOpacity>
    </View> */}


        <View
          style={{ flexDirection: "row", borderColor: "grey", borderWidth: 2, borderRadius: 10, alignItems: "center", margin:5 }}>
          <TextInput
            style={{ height: 50, width: "80%", fontSize: 15, padding: 10, backgroundColor:"#E0E0E0" }}
            placeholder="Send Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            placeholderTextColor={"grey"}
            multiline = {true}
            numberOfLines={5}
            value={input}
          />
          <Button onPress={sendMessage} title="Send" color="#00BFFF" style={{borderRadius:20}}/>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  missionControl: {
    bottom: 10,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00BFFF"
  }
});

export default MessageScreen
