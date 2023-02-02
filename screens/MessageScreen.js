import { useRoute } from '@react-navigation/native'
import React, { Component, useEffect, useState } from 'react'
import { Text, SafeAreaView, View, TextInput, Button, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, Keyboard } from 'react-native';
import Header from '../Header';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';

const MessageScreen = () => {

    const { params } = useRoute();
    const { matchedDetails } = params;
    const [ input, setInput ] = useState();
    const [ messages, setMessages ] = useState([])
    const { user } = useAuth();


    useEffect(()=>{
        
    },[])

    const sendMessage = () => {}
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
            keyboardVerticalOffset={10}/>


        {/* must create messages for data */}

        <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
            <FlatList
                data={messages}
                style={{}}
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

        <View style={{flexDirection:"row"}}>
            <TextInput
            style={{height:40, width: 300, fontSize:15, padding:30}}
            placeholder = "Send Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
            />
            <Button onPress={sendMessage} title="Send" color="#00BFFF"/>
        </View>
      </SafeAreaView>
    )
}

export default MessageScreen
