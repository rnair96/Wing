import React, { Component } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const MatchScreen =()=> {
    const navigation = useNavigation();
    const { params } = useRoute();

    const { loggedProfile, userSwiped } = params;
  
    return (
      <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly", backgroundColor:"#00BFFF", opacity:0.95}}>
        <Text style={{color:"white", fontSize:40, fontWeight:"bold"}}> Mission Aligned</Text>
        <Text style={{color:"white", fontSize:20, paddingLeft:20, paddingRight:20}}> You and {userSwiped.displayName} have selected each other as potential Wings!</Text> 
        <View style ={{flexDirection:"row"}}>
            <Image style ={{width:180, height:180, borderRadius:200, right:10}} source={{uri:loggedProfile.images[0]}}/>
            <Image style ={{width:180, height:180, borderRadius:200, left:10}} source={{uri:userSwiped.images[0]}}/>
        </View>

        <View style={{alignItems:"center"}}>
            <Text style={{color:"white", fontSize:20, fontWeight:"bold", paddingLeft:20, paddingRight:20}}> {userSwiped.displayName}'s Mission: {userSwiped.mission}</Text> 
            <Text style={{color:"white", fontSize:15, paddingTop:20, fontWeight:"bold"}}>What can you add to this?</Text> 
        </View>
        <TouchableOpacity style={{backgroundColor:"white", justifyContent:"center", width: 300, padding:5, borderRadius: 20}} onPress={()=>{
            navigation.goBack();
            navigation.navigate("Chat");
        }}>
            <Text style={{marginHorizontal:"18%", fontSize:25}}>Send A Message</Text>
        </TouchableOpacity>
       
      </View>
    )
  }


export default MatchScreen
