import React, { useState } from 'react';
import { View, ScrollView, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import Header from '../Header';
import ImageUpload from '../components/ImageUpload';


const SetUp2Screen = () => {
  const [ accomplishments, setAccomplishments ] = useState(null);
  const [ skills, setSkills ] = useState(null);
  const [ hobbies, setHobbies ] = useState(null);
  const [ images, setImages ]= useState([]);

  const navigation = useNavigation();
  const { params } = useRoute();
  const user = params; 

  const incompleteform = !images||(images && images.length < 3)||!accomplishments||!skills||!hobbies;

  const updateUserProfile = () => {
      updateDoc(doc(db, 'users', user.id), {
          images: images,
          accomplishments: accomplishments,
          skills: skills,
          hobbies: hobbies,
          timestamp: serverTimestamp()
      }).then(()=> {
            // navigation.navigate("Preferences", {id: user.id})
            navigation.navigate("Home")
      }).catch((error) => {
          alert(error.message)
      });
  }

    
return (
  <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex:1}}
            keyboardVerticalOffset={15}>
        <TouchableWithoutFeedback 
          // onPress={Keyboard.dismiss()}
        >
      <ScrollView style={{marginHorizontal:10}}>
        <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
          <SafeAreaView>
            <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 3/3"}/>
          </SafeAreaView>
  
        <Text style={{fontSize:15, fontWeight: "bold", padding:20}}>Define Your Profile</Text>

        <View style ={{flexDirection:"row", padding:20}}>
            <ImageUpload images = {images} index={0} setImages = {setImages} user={user}/>
            <ImageUpload images = {images} index={1} setImages = {setImages} user={user}/>
            <ImageUpload images = {images} index={2} setImages = {setImages} user={user}/>
            </View> 
      

      <Text style={styles.formTitle}>What Accomplishments Are You Most Proud Of?</Text>
      <TextInput
      value = {accomplishments}
      multiline
      numberOfLines={3}
      onChangeText = {setAccomplishments} 
      placeholder={"i.e Completing a marathon with a bad foot"}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

      <Text style={styles.formTitle}>What are some strengths you have?</Text>
      <TextInput
      value = {skills}
      multiline
      numberOfLines={3}
      onChangeText = {setSkills} 
      placeholder={'i.e: Calculating calories and being consistent'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

        <Text style={styles.formTitle}>What Do You Do For Fun?</Text>
      <TextInput
      value = {hobbies}
      multiline
      numberOfLines={3}
      onChangeText = {setHobbies} 
      placeholder={'I.e: Trying out new restaurants!'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
    

        <View style={{height:150}}>
      <TouchableOpacity 
          disabled = {incompleteform}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updateUserProfile}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Next</Text>
      </TouchableOpacity>
      </View>
      </View>
      </ScrollView>
      </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
)
}

const styles = StyleSheet.create({
  formTitle :{
    fontSize:15, 
    fontWeight: "bold", 
    color:"#00308F", 
    padding:20
  }
})

export default SetUp2Screen;
