import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';



const ChatHeader = ({matchedDetails}) => {
    const navigator = useNavigation();
    const { user } = useAuth();

    const matched_user = getMatchedUserInfo(matchedDetails.users, user.uid);

    console.log("user logged", matched_user);

    return (
      <View style={{flexDirection:"row", justifyContent:'space-evenly'}}>
        <TouchableOpacity onPress={() => navigator.goBack()} style={{padding: 2}}>
            <Ionicons name="chevron-back-outline" size={34} color="#00308F"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigator.navigate("ProfileView", {matchedDetails})} style={{padding: 2, flexDirection:"row"}}>
            <Image style = {{height:35, width:35, borderRadius:50}} source = {{uri: matched_user[1]?.images[0]}}/>
            <Text style={{padding:10, fontWeight:"bold", fontSize:12}}> {matched_user[1]?.displayName} </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigator.navigate("ProfileView", {matchedDetails})} style={{padding: 2, flexDirection:"row"}}>
        <Ionicons name="menu" size={34} color="#00308F"/>
        </TouchableOpacity>
      </View>
    )
}

export default ChatHeader