import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import useAuth from '../hooks/useAuth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/core';


const  ModalScreen = () => {
    const { user } = useAuth();
    const [ image, setImage ]= useState(null);
    const [ job, setJob ] = useState(null);
    const [ age, setAge ] = useState(null);
    const navigation = useNavigation();


    const incompleteform = !image||!job||!age;
    //use LayoutEffect to update header profile if you want to

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp()
        }).then(()=> {
            navigation.navigate("Home")
        }).catch((error) => {
            alert(error.message)
        });
    }


  return (
    <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
        <Image style={{height:100, width:200}} source={require("../images/tinder-title.png")}/>

        <Text style={{fontSize:20, fontWeight: "bold"}}>Welcome {user.displayName}</Text>
        <Text style={{fontSize:15, fontWeight: "bold", color:"#FF5864"}}>Step 1: The Profile Pic</Text>
        <TextInput
        value = {image}
        onChangeText = {setImage}
        placeholder='Enter Your Profile Pic URL'/>

        <Text style={{fontSize:15, fontWeight: "bold", color:"#FF5864"}}>Step 2: The Job</Text>
        <TextInput
        value = {job}
        onChangeText = {setJob} 
        placeholder='Enter Your Job'/>

        <Text style={{fontSize:15, fontWeight: "bold", color:"#FF5864"}}>Step 3: The Age</Text>
        <TextInput
        value = {age}
        onChangeText = {setAge} 
        placeholder='Enter Your Age'
        maxLength={2}/>

        <TouchableOpacity 
            disabled = {incompleteform}
            style={[{width:200, height:50, paddingTop:15, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#FF5864"}]}
            onPress = {updateUserProfile}>
            <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Update Profile</Text>
        </TouchableOpacity>
    </View>
  )
}

export default ModalScreen
