import React, { Component, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { collection, getDoc, onSnapshot, doc, query, limit, where } from 'firebase/firestore';
import { db } from '../firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';





const  MenuScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [ profile, setProfile ] = useState();

    // must figure out how to simplify this database get method
    useEffect(()=> {
        unsub = onSnapshot(query(collection(db,"users"), where("id","in", [user.uid]))
            ,(snapshot) =>{
                // console.log("snapshot",snapshot.docs.photos);
                const info = snapshot.docs.map((doc) => (
                    {
                    id: doc.id,
                    ...doc.data()
                }
                ))
                setProfile(...info);
            })
        return unsub;
   
    },[db]);

    return (
        <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
        <Image style={{height:100, width:100, borderRadius:50, borderColor:"#00308F", borderWidth:2}} source={{uri: profile? profile?.images[0]: '../images/account.jpeg'}}/>
        <Text style={{fontSize:20, fontWeight: "bold"}}>{user.displayName}</Text>
        <View style ={{flexDirection:"row", alignItems:"center", padding:5}}>
        <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Wing Member</Text>
        <MaterialCommunityIcons name="account-check" size={20} color="#32CD32" />
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("EditProfile", profile)}>
        <Text>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Preferences", profile)}>
        <Text>Matching Prefences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer}>
        <Text>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer}>
        <Text>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image style={styles.iconcontainer} source={require("../images/logo2.jpg")}/>        
        </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      height: 50,
      margin: 10,
      borderWidth: 1,
      borderColor: '#ccc'
    },
    iconcontainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        borderColor:"#00BFFF",
        borderWidth: 2
    }
    });


export default MenuScreen
