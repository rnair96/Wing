import React, { Component, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons} from '@expo/vector-icons';


const  MenuScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute();
    const profile = params;

    return (
        <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
        <TouchableOpacity style={{flexDirection:"row", alignItems:"center"}} onPress={() => navigation.navigate("EditProfile", profile)}>
        <Image style={{height:100, width:100, borderRadius:50, borderColor:"#00308F", borderWidth:2, left:20}} source={{uri: profile? profile?.images[0]: '../images/account.jpeg'}}/>
        <View style={{padding:2, backgroundColor:"white", borderRadius:20, borderWidth:1,borderColor:"#989898"}}>
        <Ionicons name="pencil" size={30} color = "#00308F"/>
        </View>
        </TouchableOpacity>
        <Text style={{fontSize:20, fontWeight: "bold"}}>{profile.displayName}</Text>
        <View style ={{flexDirection:"row", alignItems:"center", padding:5}}>
        <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Wing Member</Text>
        <MaterialCommunityIcons name="account-check" size={20} color="#32CD32" />
        </View>
        {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Preferences", profile)}>
        <Text style={{padding:10, fontSize:15}}>Matching Prefences</Text>
        <Ionicons name="heart-outline" style={{padding:10}} size={30} color = "black"/>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Settings", profile)}>
        <Text style={{padding:10, fontSize:15}}>Settings</Text>
        <Ionicons name="settings-outline" style={{padding:10}} size={30} color = "black"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Help", profile)}>
        <Text style={{padding:10, fontSize:15}}>Help</Text>
        <Ionicons name="help" style={{padding:10}} size={30} color = "black"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image style={styles.iconcontainer} source={require("../images/logo2.jpg")}/>        
        </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection:"row",
      alignItems: 'center',
      justifyContent:'space-between',
      width: "90%",
      height: 50,
      margin: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#ccc'
    },
    iconcontainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        borderColor:"#00308F",
        borderWidth: 2
    }
    });


export default MenuScreen
