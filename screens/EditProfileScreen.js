import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, SafeAreaView, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import ImageUpload from '../components/ImageUpload';
import AgePicker from '../components/AgePicker';
import GenderPicker from '../components/GenderPicker';
import { Ionicons} from '@expo/vector-icons';
import TagPicker from '../components/TagPicker';
import registerNotifications from '../lib/registerNotifications';


const EditProfileScreen = () => {
  const { user } = useAuth();
  const [ job, setJob ] = useState(null);
  const [ age, setAge ] = useState(18);
  const [ oldtoken, setOldToken ] = useState(null);
  const [ newtoken, setNewToken ] = useState(null);
  const [ mission, setMission ] = useState(null);
  const [ missiontag, setMissionTag ] = useState("Personal Growth");
  const [ gender, setGender ] = useState("male");
  const [ accomplishments, setAccomplishments ] = useState(null);
  const [ skills, setSkills ] = useState(null);
  const [ idealwing, setIdealWing ] = useState(null);
  const [ location, setLocation ] = useState(null);
  const [ hobbies, setHobbies ] = useState(null);
  const [ incompleteForm, setIncompleteForm ] = useState(true);
  const [ email, setEmail ] = useState(user.email);
  const [ name, setName ] = useState(user.displayName.split(" ")[0])
  const [ url1, setUrl1] = useState(null);
  const [ url2, setUrl2] = useState(null);
  const [ url3, setUrl3] = useState(null);


  const { params } = useRoute();
  const profile = params;

  useEffect(()=>{
    if (profile) {
        setUrl1(profile.images[0]);
        setUrl2(profile.images[1]);
        setUrl3(profile.images[2]);
        setJob(profile.job);
        setAge(parseInt(profile.age));
        setMission(profile.mission);
        setGender(profile.gender);
        setAccomplishments(profile.accomplishments);
        setSkills(profile.skills);
        setLocation(profile.location);
        setHobbies(profile.hobbies);
        setIdealWing(profile.ideal_wing);
        setMissionTag(profile.mission_tag);
        setEmail(profile.email);
        setName(profile.displayName)
        setOldToken(profile.token);
    }

  },[profile])


  const navigation = useNavigation();

  useEffect(()=>{
    const form =  !url1||!url2||!url3||!gender||!age||!mission||!accomplishments||!skills||!idealwing||!location||!hobbies;
    setIncompleteForm(form);

  },[url1, url2, url3 ,gender, age,mission, accomplishments, skills, idealwing, location, hobbies])

  useEffect(()=>{
    if (oldtoken && (oldtoken === "testing" || oldtoken === "not_granted")){
      const new_token = registerNotifications();
      setNewToken(new_token);
    } else {
      setNewToken(oldtoken);
    }

  },[oldtoken])


  const updateUserProfile = () => {
      updateDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          displayName: name,
          email: email,
          images: [url1, url2, url3],
          job: job,
          age: age,
          gender: gender,
          mission: mission,
          accomplishments: accomplishments,
          skills: skills,
          ideal_wing: idealwing,
          hobbies: hobbies,
          mission_tag: missiontag,
          timestamp: serverTimestamp(),
          token: newtoken
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
      <SafeAreaView style={{flexDirection:"row", alignItems:"center", justifyContent:"space-evenly", right:"4%"}}>
            <TouchableOpacity style={{paddingTop:20}} onPress={() => navigation.goBack()}>
            <Ionicons name="ios-arrow-back" size={30} color = "#00BFFF"/>
            </TouchableOpacity>
          <TouchableOpacity style={{paddingTop:20}} onPress={() => navigation.navigate("Home")}>
          <Image style={{height:50, width:50, borderRadius:50, backgroundColor:"#00BFFF", borderColor:"#00308F", borderWidth:2}} source={require("../images/logo.png")}/>
          </TouchableOpacity>
          </SafeAreaView>
        <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
          

        <Text style={{fontSize:15, fontWeight: "bold", padding:20}}>Edit Your Profile</Text>
      
      <View style ={{flexDirection:"row"}}>
      <View style ={{alignItems:"center"}}>
      <Text style={styles.formTitle}>Age</Text>
      
      {!profile?.age ? (
        <AgePicker age= {age} setAge={setAge} />
      ):(
        <Text>{age}</Text>
      )}
      
      </View>
      
      <View style={{alignItems:"center"}}>
      <Text style={styles.formTitle}>Gender</Text>
      
      {!profile?.gender ? (
        <GenderPicker gender= {gender} setGender={setGender} both_boolean={false} />
      ):(
        <Text>{gender}</Text>
      )}
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

      <Text style={styles.formTitle}>Hobbies</Text>
      <TextInput
      value = {hobbies}
      multiline
      numberOfLines={3}
      onChangeText = {setHobbies} 
      placeholder={'What do you do for fun? i.e: Trying out new restaurants!'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

      <Text style={styles.formTitle}>Medals</Text>
      <TextInput
      value = {accomplishments}
      multiline
      numberOfLines={3}
      onChangeText = {setAccomplishments} 
      placeholder={"What accomplishments are you most proud of? i.e Completing a marathon with a bad foot"}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

      <Text style={styles.formTitle}>Strengths</Text>
      <TextInput
      value = {skills}
      multiline
      numberOfLines={3}
      onChangeText = {setSkills} 
      placeholder={'What are you good at? i.e: Calculating calories and being consistent'}
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
      placeholder={'What goal do you want to achieve? i.e Lose 10 pounds'}
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
