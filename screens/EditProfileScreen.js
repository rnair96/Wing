import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, SafeAreaView, Image, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import useAuth from '../hooks/useAuth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import ImageUpload from '../components/ImageUpload';
import AgePicker from '../components/AgePicker';
import GenderPicker from '../components/GenderPicker';
import { Ionicons} from '@expo/vector-icons';
import Header from '../Header';
import TagPicker from '../components/TagPicker';


const EditProfileScreen = () => {
  const { user } = useAuth();
  const [ images, setImages ]= useState([]);
  const [ job, setJob ] = useState(null);
  const [ age, setAge ] = useState(18);
  const [ mission, setMission ] = useState(null);
  const [ tag, setTag ] = useState(null);
  const [ gender, setGender ] = useState("male");
  const [ accomplishments, setAccomplishments ] = useState(null);
  const [ skills, setSkills ] = useState(null);
  const [ desires, setDesires ] = useState(null);
  const [ location, setLocation ] = useState(null);
  const [ hobbies, setHobbies ] = useState(null);


  const { params } = useRoute();
  const profile = params;

  useEffect(()=>{
    if (profile) {
        setImages(profile.images);
        setJob(profile.job);
        setAge(parseInt(profile.age));
        setMission(profile.mission);
        setGender(profile.gender);
        setAccomplishments(profile.accomplishments);
        setSkills(profile.skills);
        setLocation(profile.location);
        setHobbies(profile.hobbies);
        setDesires(profile.desires);
        setTag(profile.tag)
    }

  },[profile])


  const navigation = useNavigation();


  const incompleteform = !images||(images && images.length < 3)||!gender||!age||!mission||!accomplishments||!skills||!desires||!location||!hobbies;
  

  const updateUserProfile = () => {
      setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          displayName: user.displayName,
          images: images,
          job: job,
          age: age,
          gender: gender,
          mission: mission,
          accomplishments: accomplishments,
          skills: skills,
          desires: desires,
          location: location,
          hobbies: hobbies,
          tag: tag,
          timestamp: serverTimestamp()
      }).then(()=> {
            navigation.navigate("Home");
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
          <TouchableOpacity style={{paddingTop:20}} onPress={() => navigation.navigate("Home")}>
          <Image style={{height:50, width:50, borderRadius:50, borderColor:"#00308F", borderWidth:2}} source={require("../images/logo2.jpg")}/>
          </TouchableOpacity>
          </SafeAreaView>

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
      value = {desires}
      multiline
      numberOfLines={3}
      onChangeText = {setDesires}
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
      <TagPicker tag={tag} setTag={setTag}/>

        <View style={{height:150}}>
      <TouchableOpacity 
          disabled = {incompleteform}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updateUserProfile}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Update Profile</Text>
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

export default EditProfileScreen;
