import React, { Component, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { collection, getDoc, onSnapshot, doc, query, limit, where } from 'firebase/firestore';
import { db } from '../firebase';




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
                setProfile(...info)
            })

        return unsub;
   
    },[db]);

    console.log("profile",profile);


    return (
        <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
        <Image style={{height:100, width:100, borderRadius:50, borderColor:"#00308F", borderWidth:2}} source={{uri: profile?.photos[0]}}/>
        <Text style={{fontSize:20, fontWeight: "bold"}}>{user.displayName}: Wing Member</Text>
        <TouchableOpacity onPress={() => navigation.navigate("EditProfile", profile)}>
        <Text>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity>
        <Text>Matching Prefences</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text>Start Matching</Text>
        </TouchableOpacity>
        <TouchableOpacity>
        <Text>Settings</Text>
        </TouchableOpacity>

        </View>
    )
}

export default MenuScreen
