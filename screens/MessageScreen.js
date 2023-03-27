import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, TextInput, Button, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, Keyboard, TouchableOpacity} from 'react-native';
import ChatHeader from '../components/ChatHeader';
import useAuth from '../hooks/useAuth';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query } from 'firebase/firestore';
import { db } from '../firebase';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const MessageScreen = () => {

    const { params } = useRoute();
    const { matchedDetails } = params;
    const [ input, setInput ] = useState();
    const [ messages, setMessages ] = useState([])
    const { user } = useAuth();

    useEffect(()=> onSnapshot(query(collection(db,"matches",matchedDetails.id,"messages"), 
        orderBy("timestamp", "desc")), (snapshot) => {
            setMessages(snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
            })
            ))
        })
        ,[matchedDetails, db]);

    const sendMessage = () => {
        addDoc(collection(db, "matches", matchedDetails.id, "messages"), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchedDetails.users[user.uid].images[0],
            message: input,

        })
        // setMessages([input,...messages]);

        const matchedUser = getMatchedUserInfo(matchedDetails.users,user.uid);
        const userName = user.displayName.split(" ")[0];
        sendPush(matchedUser, userName);
        setInput("");

    }

    //use individualized push notification
    const sendPush = async(matchedUser, userName) => {

          try {
            const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
            },
              body: JSON.stringify({
                to: matchedUser[1].token,
                title: "New Message from "+userName,
                body: input
                // data: {
                //   type: "message",
                //   message: matchedUser 
                // },
              }),
            });

        
            const result = await response.json();
        
            if (result.errors) {
              throw new Error(`Failed to send push notification: ${result.errors}`);
            }
            console.log("are you being sent?", result)

            return result.data;
          } catch (error) {
            console.error('Error sending push notification:', error);
            return null;
          }
    }
    
    
    return (
      <SafeAreaView style={{flex:1}}>
        <ChatHeader matchedDetails={matchedDetails}/>

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex:1}}
            keyboardVerticalOffset={10}>


        {/* must create messages for data */}

        <TouchableWithoutFeedback 
        // onPress={Keyboard.dismiss()}
        >
            <FlatList
                data={messages}
                style={{}}
                inverted={-1}
                keyExtractor={(item) => item.id}
                renderItem = {({item:message}) =>
                    message.userId === user.uid ? (
                        <SenderMessage key = {message.id} message={message}/>
                    ):(
                        <RecieverMessage key = {message.id} message={message}/>
                    )
            }
            />
        </TouchableWithoutFeedback>
        {/* <View style={{flexDirection:"row", justifyContent:"flex-end", bottom:10, padding:10}}>
        <TouchableOpacity style={styles.missionControl} onPress={()=>navigation.navigate("MissionControl")}>
                <Entypo name="aircraft-take-off" size={30} color="blue"/>
        </TouchableOpacity>
    </View> */}


        <View 
        style={{flexDirection:"row", borderColor:"#E0E0E0", borderWidth:2, alignItems:"center"}}>
            <TextInput
            style={{height:50, width: 300, fontSize:15, padding:10}}
            placeholder = "Send Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
            />
            <Button onPress={sendMessage} title="Send" color="#00BFFF"/>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
     missionControl:{
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
