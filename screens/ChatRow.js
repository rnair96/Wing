import { useNavigation } from '@react-navigation/native'
import React, { Component, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const ChatRow = ({ matchedDetails }) => {

    const  { user } = useAuth();
    const [ matchedUserInfo, setMatchedUserInfo ] = useState(null);
    const navigator = useNavigation();
   

    useEffect(()=>{
        // console.log("are you here at least?")
        setMatchedUserInfo(getMatchedUserInfo(matchedDetails.users,user.uid));
        // console.log("matched user", matchedUserInfo)
        
    },[matchedDetails, user]);
    


//create a loading value
    return ( 
        matchedUserInfo? (
        <TouchableOpacity style={styles.container} onPress={()=>navigator.navigate("Message",{
            matchedDetails
        })}>
         <Image style = {{height:60, width:60, borderRadius:50}} source = {{uri:matchedUserInfo[1]?.photoURL}}/>
         <View style={{padding:10}}>
            <Text style={{fontWeight:"bold", fontSize:20, paddingLeft:10, paddingBottom:5}}>{matchedUserInfo[1]?.displayName}</Text>
            <Text style={{paddingLeft:10}}>Say Hi!</Text>
         </View>
       </TouchableOpacity>
    ):(
        <Text>Not Here!!!</Text>
    )
    )


}

const styles = StyleSheet.create({
    container:{
        left:20,
        flexDirection:"row",
        backgroundColor:"white",
        alignItems:"center",
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
