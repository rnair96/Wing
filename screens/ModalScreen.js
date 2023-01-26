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
    const [ mission, setMission ] = useState(null);
    // const [ gender, setGender ] = useState(null); & location

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
            // gender: gender,
            mission: mission,
            timestamp: serverTimestamp()
        }).then(()=> {
            navigation.navigate("Home")
        }).catch((error) => {
            alert(error.message)
        });
    }


  return (
    <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
        <Image style={{height:100, width:200, borderRadius:50}} source={require("../images/logo.jpg")}/>

        <Text style={{fontSize:20, fontWeight: "bold"}}>Welcome {user.displayName}</Text>
        <Text style={{fontSize:15, fontWeight: "bold", color:"#00BFFF"}}>Step 1: The Profile Pic</Text>
        <TextInput
        value = {image}
        onChangeText = {setImage}
        placeholder='Enter Your Profile Pic URL'/>

        <Text style={{fontSize:15, fontWeight: "bold", color:"#00BFFF"}}>Step 2: The Job</Text>
        <TextInput
        value = {job}
        onChangeText = {setJob} 
        placeholder='Enter Your Job'/>

        <Text style={{fontSize:15, fontWeight: "bold", color:"#00BFFF"}}>Step 3: The Age</Text>
        <TextInput
        value = {age}
        onChangeText = {setAge} 
        placeholder='Enter Your Age'
        maxLength={2}/>

        {/* <Text style={{fontSize:15, fontWeight: "bold", color:"#00BFFF"}}>Step 2: The Job</Text>
        <TextInput
        value = {gender}
        onChangeText = {setGender} 
        placeholder='Enter Your Gender'/> */}

        <Text style={{fontSize:15, fontWeight: "bold", color:"#00BFFF"}}>Step 4: The Mission</Text>
        <TextInput
        value = {mission}
        onChangeText = {setMission} 
        placeholder='Enter Your Mission'/>

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
