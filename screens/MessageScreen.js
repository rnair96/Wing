import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, Image, TouchableOpacity, Text, Platform } from 'react-native';
import ChatHeader from '../components/ChatHeader';
import useAuth from '../hooks/useAuth';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query, updateDoc, doc, getDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import sendPush from '../lib/sendPush';
import * as Sentry from "@sentry/react";
import ChatInput from '../components/ChatInput';
import likeMessage from '../lib/likeMessage';

const MessageScreen = () => {

  const { params } = useRoute();
  const { matchedDetails, otherProfile, profile } = params;
  const [input, setInput] = useState();
  const [messages, setMessages] = useState([])
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(profile);

  // const matchedUser = getMatchedUserInfo(matchedDetails.users,user.uid);

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
        Sentry.captureMessage(`error fetching messages in message screen of ${matchedDetails.id}, ${error.message}`)
        alert("Error getting messages. Try again later.")

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

  const sendMessage = (type) => {
    const name = userProfile ? userProfile.displayName : user.displayName.split(" ")[0]
    const timestamp = serverTimestamp();

    try {

      addDoc(collection(db, global.matches, matchedDetails.id, "messages"), {
        timestamp: timestamp,
        userId: user.uid,
        displayName: name,
        message: input,
        read: false,
        type: type
      })

      updateDoc(doc(db, global.matches, matchedDetails.id), {
        latest_message_timestamp: timestamp
      })


      if (userProfile && otherProfile?.notifications && otherProfile.notifications.messages && otherProfile.token && otherProfile.token !== "testing" && otherProfile.token !== "not_granted") {

        const messageDetails = { "matchedDetails": matchedDetails, "otherProfile": userProfile }

        // Sentry.captureMessage(`sending message from ${name}`)
        // Sentry.captureMessage(`sending message to ${otherProfile.displayName} with token ${otherProfile.token}`)

        sendPush(otherProfile.token, `New Message from ${name}`, input, { type: "message", message: messageDetails })

      }
    } catch (error) {
      console.log("ERROR, there was an error in sending a message", error);
      Sentry.captureMessage(`there was an error in sending a message ${error.message}`)
      alert("Error sending message. Try again later.")

    }

    setInput("");

  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ChatHeader details={matchedDetails} type={"match"} profile={otherProfile} />

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
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              updateCellsBatchingPeriod={50}
              renderItem={({ item: message }) =>
                message.userId === user.uid ? (
                  <SenderMessage key={message.id} message={message} />
                ) : (
                  <View style={{ padding: 10, maxWidth: 250, marginRight: "auto", alignSelf: "flex-start", flexDirection: "row" }}>
                    {otherProfile ? (
                      <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }}
                        source={{ uri: otherProfile.images[0] }} />
                    ) : (
                      <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }}
                        source={require("../images/account.jpeg")} />
                    )}
                    <TouchableOpacity onLongPress={() => {
                      likeMessage(message, user.uid, doc(db, global.matches, matchedDetails.id, "messages", message.id))
                    }}>
                      <RecieverMessage key={message.id} message={message} />
                    </TouchableOpacity>

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


        {/* <View
          style={{ flexDirection: "row", borderColor: "grey", borderWidth: 2, borderRadius: 10, alignItems: "center", margin: 5 }}>
          <TextInput
            style={{ height: 50, width: "80%", fontSize: 15, padding: 10, paddingTop: 15 }}
            placeholder="Send Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            placeholderTextColor={"grey"}
            multiline={true}
            numberOfLines={5}
            value={input}
          />
          <TouchableOpacity onPress={sendMessage} style={{marginLeft:20}}>
            <Text style={{color:"#00BFFF", fontSize:15}}>Send</Text>
          </TouchableOpacity>
        </View> */}
        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} fileLocation={matchedDetails.id} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MessageScreen
