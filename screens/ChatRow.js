import { useNavigation } from '@react-navigation/native'
import React, { Component, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const ChatRow = ({ matchedDetails }) => {

    const  navigate = useNavigation();
    const  { user } = useAuth();
    const [matchedUserInfo, setMatchedUserInfo]  = useState(null);


    useEffect(()=>{
        setMatchedUserInfo(getMatchedUserInfo(matchedDetails.users, user));
        console.log("matchInfo",matchedUserInfo[1].photoURL);

    },[matchedDetails, user])

    return (
      <TouchableOpacity style={styles.container}>
        <Image style = {{height:80, width:80, borderRadius:50}} source = {{uri:matchedUserInfo[1]?.photoURL}}/>
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        backgroundColor:"white",
        padding:10,
        shadowColor:"#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation:2
    }
})

export default ChatRow
