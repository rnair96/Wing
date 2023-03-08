import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, SafeAreaView, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView} from 'react-native';
import useAuth from '../hooks/useAuth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import ImageUpload from '../components/ImageUpload';
import AgePicker from '../components/AgePicker';
import GenderPicker from '../components/GenderPicker';
import TagPicker from '../components/TagPicker';


const SetUp1Screen = () => {
  const { user } = useAuth();
  const [ images, setImages ]= useState([]);
  const [ job, setJob ] = useState(null);
  const [ age, setAge ] = useState(18);
  const [ mission, setMission ] = useState(null);
  const [ missiontag, setMissionTag ] = useState("Personal Growth");
  const [ gender, setGender ] = useState("male");
  const [ idealwing, setIdealWing ] = useState(null);
  const [ location, setLocation ] = useState(null);

  // const { params } = useRoute();
  // const { user } = params? params: useAuth()


  const navigation = useNavigation();


  const incompleteform = !images||(images && images.length < 3)||!gender||!age||!mission||!idealwing||!location;
 

  const updateUserProfile = () => {
      setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          displayName: user.displayName.split(" ")[0],
          email: user.email,
          images: images,
          job: job,
          age: age,
          gender: gender,
          mission: mission,
          ideal_wing: idealwing,
          location: location,
          mission_tag: missiontag,
          timestamp: serverTimestamp()
      }).then(()=> {
            
            navigation.navigate("SetUp2", {id: user.uid})
      }).catch((error) => {
          alert(error.message)
      });
  }


  //Use Header
    
return (
  <View>
      <ScrollView style={{marginHorizontal:10}}>
        <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
          <SafeAreaView>
          <Text style={{fontSize:20, fontWeight: "bold", padding:20}}>Account Setup 1/3</Text>
          </SafeAreaView>

          <Text style={{fontSize:15, fontWeight: "bold", padding:20}}>The Essentials</Text>

  
          
      <View style ={{flexDirection:"row"}}>
      <View style ={{alignItems:"center"}}>
      <Text style={styles.formTitle}>Age</Text>
      
        <AgePicker age= {age} setAge={setAge} />
      
      </View>
      
      <View style={{alignItems:"center"}}>
      <Text style={styles.formTitle}>Gender</Text>
      
        <GenderPicker gender= {gender} setGender={setGender} both_boolean={false} />
      </View>
      </View>

    <View style={{flexDirection:"column", padding:10}}>
        <View style={{padding:10, alignItems:"center"}}>
        <Text style={styles.formTitle}>Job</Text>
      <TextInput
      value = {job}
      onChangeText = {setJob} 
      placeholder={'What do you do?'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
        </View>
   

        <View style={{padding:10, alignItems:"center"}}>
        <Text style={styles.formTitle}>Location</Text>
        <TextInput
        value = {location}
        onChangeText = {setLocation} 
        placeholder={'What area are you in? (City, State)'}
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
        </View>
        </View>        
  

        <View style ={{flexDirection:"row", padding:20}}>
            <ImageUpload images = {images} index={0} setImages = {setImages}/>
            <ImageUpload images = {images} index={1} setImages = {setImages}/>
            <ImageUpload images = {images} index={2} setImages = {setImages}/>
            </View> 

      <Text style={styles.formTitle}>Define Your Mission</Text>
      <TextInput
      value = {mission}
      multiline
      numberOfLines={3}
      onChangeText = {setMission} 
      placeholder={'I.e Lose 10 pounds'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

      <Text style={styles.formTitle}>Select The Category That Best Fits The Mission</Text>
      <TagPicker tag={missiontag} setTag={setMissionTag}/>
    

      <Text style={styles.formTitle}>How Can Your Wing Best Support You?</Text>
      <TextInput
      value = {idealwing}
      multiline
      numberOfLines={4}
      onChangeText = {setIdealWing}
      placeholder={'I.e: Push me in the gym'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

        <View style={{height:300}}>
      <TouchableOpacity 
          disabled = {incompleteform}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updateUserProfile}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Next</Text>
      </TouchableOpacity>
      </View>
      </View>
      </ScrollView>
  </View>
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

export default SetUp1Screen;
