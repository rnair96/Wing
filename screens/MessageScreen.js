import { useRoute } from '@react-navigation/native'
import React, { Component, useEffect, useState } from 'react'
import { Text, SafeAreaView, View, TextInput, Button, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, Keyboard } from 'react-native';
import Header from '../Header';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';
import { addDoc, collection, getDoc, onSnapshot, orderBy, serverTimestamp, query } from 'firebase/firestore';
import { db } from '../firebase';

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
            photoURL: matchedDetails.users[user.uid].photoURL,
            message: input,

        })
        setInput("");
        // setMessages([input,...messages]);
    }
    //add message to messages array using setMessage

    //update messages array from DB if pre-existing through useEffect or useLayoutEffect
    //update messages array to DB when a new message is added in useEffect
    //depedent variable is messages array

    return (
      <SafeAreaView style={{flex:1}}>
        <Header title={getMatchedUserInfo(matchedDetails.users, user.uid)[1]?.displayName}/>

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

export default MessageScreen
