import React, { Component } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const MatchScreen =()=> {
    const navigation = useNavigation();
    const { params } = useRoute();

    const { loggedProfile, userSwiped } = params;
  
    return (
      <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly", backgroundColor:"#00BFFF"}}>
        <Text style={{color:"white"}}> You and {userSwiped.displayName} have matched! </Text>
        <View>
            <Image source={{uri:loggedProfile.photoURL}}/>
        </View>
        <View>
            <Image source={{uri:userSwiped.photoURL}}/>
        </View>
        <TouchableOpacity style={{backgroundColor:"white", justifyContent:"center"}} onPress={()=>{
            navigation.goBack();
            navigation.navigate("Chat");
        }}>
            <Text>Send a Message</Text>
        </TouchableOpacity>
      </View>
    )
  }


export default MatchScreen
