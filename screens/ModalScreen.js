import React, { useState } from 'react';
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import useAuth from '../hooks/useAuth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import ImageUpload from '../components/ImageUpload';


const  ModalScreen = () => {
    const { user } = useAuth();
    const [ images, setImages ]= useState([]);
    const [ job, setJob ] = useState(null);
    const [ age, setAge ] = useState(null);
    const [ mission, setMission ] = useState(null);
    const [ gender, setGender ] = useState(null); 

    const navigation = useNavigation();


    const incompleteform = !images||!job||!age;
    //use LayoutEffect to update header profile if you want to

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photos: images,//change photoURL to profile pic(s)
            job: job,
            age: age,
            gender: gender,
            mission: mission,
            timestamp: serverTimestamp()
        }).then(()=> {
            navigation.navigate("Home")
        }).catch((error) => {
            alert(error.message)
        });
    }

    // const selectImage = async () => {      
    //       const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.All,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //       });
      
    //       if (!result.canceled) {
    //         setImages(images.push(result.assets[0].uri));
    //         console.log("images added",images[0]);
    //         console.log("images added",images.length);


    //       }
    //   };
      

    // const removeImage = async (index) => {       
    //     images.splice(index,1);
    //     setImages(images);
    //     console.log("images removed",images);

    // };
      

      


  return (
    <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
        {/* <ScrollView> */}
        <Image style={{height:100, width:100, borderRadius:50, borderColor:"#00308F", borderWidth:2}} source={require("../images/logo2.jpg")}/>
        <Text style={{fontSize:20, fontWeight: "bold"}}>Welcome {user.displayName}</Text>
        <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Set Up Your Profile</Text>

        <View style ={{flexDirection:"row"}}>
        <ImageUpload/>
        <ImageUpload/>
        <ImageUpload/>  
        </View>

        <View style ={{flexDirection:"row"}}>
        <View style ={{padding:10}}>
        <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Age</Text>
        <TextInput
        value = {age}
        onChangeText = {setAge} 
        placeholder='Enter Your Age'
        maxLength={2}/>
        </View>
        
        <View style={{padding:10}}>
        <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Gender</Text>
        <TextInput
        value = {gender}
        onChangeText = {setGender} 
        placeholder='Enter Your Gender'/>
        </View>
        </View>

        <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Job</Text>
        <TextInput
        value = {job}
        onChangeText = {setJob} 
        placeholder='Enter Your Job'/>

        <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Mission</Text>
        <TextInput
        value = {mission}
        onChangeText = {setMission} 
        placeholder='Enter Your Mission'/>

        <TouchableOpacity 
            disabled = {incompleteform}
            style={[{width:200, height:50, paddingTop:15, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
            onPress = {updateUserProfile}>
            <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Update Profile</Text>
        </TouchableOpacity>
        {/* </ScrollView> */}
    </View>
  )
}

export default ModalScreen
