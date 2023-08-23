import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, SafeAreaView, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import ImageUpload from '../components/ImageUpload';
import registerNotifications from '../lib/registerNotifications';
import { useNavigation } from '@react-navigation/core';
import TagPicker from '../components/TagPicker';
 


const EditProfileScreen = ({profile}) => {
  const { user } = useAuth();
  const [ job, setJob ] = useState(null);
  const [ age, setAge ] = useState(18);
  const [ oldtoken, setOldToken ] = useState(null);
  const [ newtoken, setNewToken ] = useState("not_granted");
  const [ mission, setMission ] = useState(null);
  const [ missiontag, setMissionTag ] = useState("Social");
  const [ gender, setGender ] = useState("male");
  const [ medals, setMedals ] = useState(null);
  const [ bio, setBio ] = useState(null);
  const [ idealwing, setIdealWing ] = useState(null);
  const [ location, setLocation ] = useState(null);
  const [ incompleteForm, setIncompleteForm ] = useState(true);
  const [ url1, setUrl1] = useState(null);
  const [ url2, setUrl2] = useState(null);
  const [ url3, setUrl3] = useState(null);
  const navigation = useNavigation();


 

  useEffect(()=>{
    if (profile) {
        setUrl1(profile.images[0]);
        setUrl2(profile.images[1]);
        setUrl3(profile.images[2]);
        setJob(profile.job);
        setAge(parseInt(profile.age));
        setMission(profile.mission);
        setGender(profile.gender);
        setMedals(profile.medals);
        setBio(profile.bio);
        setLocation(profile.location);
        setIdealWing(profile.ideal_wing);
        setMissionTag(profile.mission_tag);
        setOldToken(profile.token);
    }

  },[profile])



  useEffect(()=>{
    const form =  !url1||!url2||!url3||!mission||!medals||!idealwing||!location||!bio;
    setIncompleteForm(form);

  },[url1, url2, url3 ,mission, medals, idealwing, location, bio])

  useEffect(()=>{
    (async () => {
    if (oldtoken && (oldtoken === "testing" || oldtoken === "not_granted")){
      const new_token = await registerNotifications();
      setNewToken(new_token);
    } else {
      setNewToken(oldtoken);
    }
  })();

  },[oldtoken])

    


  const updateUserProfile = () => {
      updateDoc(doc(db, global.users, user.uid), {
          images: [url1, url2, url3],
          job: job,
          mission: mission,
          mission_tag: missiontag,
          medals: medals,
          ideal_wing: idealwing,
          location: location,
          token: newtoken,
          bio: bio
      }).then(()=> {
            navigation.navigate("Home");
      }).catch((error) => {
          alert(error.message)
      });
  }


  //Use Header
    
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
        <Text style={{fontSize:15, fontWeight: "bold", padding:20}}>Edit Your Profile</Text>

          
      
      <View style ={{flexDirection:"row"}}>
      <View style ={{alignItems:"center"}}>
      <Text style={styles.formTitle}>Age</Text>
      
      {/* {!profile?.age ? (
        <AgePicker age= {age} setAge={setAge} />
      ):( */}
        <Text>{age}</Text>
      {/* )} */}
      
      </View>
      
      <View style={{alignItems:"center"}}>
      <Text style={styles.formTitle}>Gender</Text>
      
      {/* {!profile?.gender ? (
        <GenderPicker gender= {gender} setGender={setGender} both_boolean={false} />
      ):( */}
        <Text>{gender}</Text>
      {/* )} */}
      </View>
      </View>

    <View style={{flexDirection:"column", padding:10}}>
   
        <View style={{padding:10, alignItems:"center"}}>
        <Text style={styles.formTitle}>Location</Text>
        {!profile?.location ?
        (<TextInput
        value = {location}
        onChangeText = {setLocation} 
        placeholder={'What area are you in? (City, State)'}
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>)
        :(
          <Text>{location}</Text>
        )}
        </View>


      <View style={{padding:10, alignItems:"center"}}>
      <Text style={styles.formTitle}>Job</Text>
      <TextInput
      value = {job}
      onChangeText = {setJob} 
      placeholder={'What do you do?'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
        </View>
        </View>        
  

        <View style ={{flexDirection:"row", padding:20}}>
            <ImageUpload url = {url1} setURL = {setUrl1} index={0} user={user}/>
            <ImageUpload url = {url2} setURL = {setUrl2} index={1} user={user}/>
            <ImageUpload url = {url3} setURL = {setUrl3} index={2} user={user}/>
            </View> 

      <Text style={styles.formTitle}>Bio</Text>
      <TextInput
      value = {bio}
      multiline
      numberOfLines={3}
      onChangeText = {setBio} 
      placeholder={'Share a bit about you i.e: Papa Johns is the key to my heart.'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>


      <Text style={styles.formTitle}>Medals</Text>
      <TextInput
      value = {medals}
      multiline
      numberOfLines={3}
      onChangeText = {setMedals} 
      placeholder={"What makes you a solid Wing? i.e: I'm fun and always pumped to train"}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
    

      <Text style={styles.formTitle}>The Ideal Wing</Text>
      <TextInput
      value = {idealwing}
      multiline
      numberOfLines={3}
      onChangeText = {setIdealWing}
      placeholder={'How can a Wing best support you? i.e: Push me in the gym'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

      <Text style={styles.formTitle}>Mission</Text>
      <TextInput
      value = {mission}
      multiline
      numberOfLines={3}
      onChangeText = {setMission} 
      placeholder={'What goal do you want a Wing to assist you on? i.e Lose 10 pounds'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

      <Text style={styles.formTitle}>Mission Category</Text>
      <TagPicker tag={missiontag} setTag={setMissionTag}/>

        <View style={{height:150}}>
      <TouchableOpacity 
          disabled = {incompleteForm}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteForm ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updateUserProfile}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Update Profile</Text>
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

export default EditProfileScreen;
