import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, SafeAreaView, Image, TextInput, TouchableOpacity} from 'react-native';
import useAuth from '../hooks/useAuth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import ImageUpload from '../components/ImageUpload';

const EditProfileScreen = () => {
  const { user } = useAuth();
  const [ images, setImages ]= useState([]);
  const [ job, setJob ] = useState(null);
  const [ age, setAge ] = useState(null);
  const [ mission, setMission ] = useState(null);
  const [ gender, setGender ] = useState(null);
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
        setAge(profile.age);
        setMission(profile.mission);
        setGender(profile.gender);
        setAccomplishments(profile.accomplishments);
        setSkills(profile.skills);
        setLocation(profile.location);
        setHobbies(profile.hobbies);
        setDesires(profile.desires);
    }

  },[profile])


  const navigation = useNavigation();


  const incompleteform = !images||!gender||!age||!mission||!accomplishments||!skills||!desires||!location||!hobbies;
  //use LayoutEffect to update header profile if you want to

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
          timestamp: serverTimestamp()
      }).then(()=> {
          navigation.navigate("Home")
      }).catch((error) => {
          alert(error.message)
      });
  }


  //add multiline texts to inputs
    
return (
  <View>
      <ScrollView>
        <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
      <TouchableOpacity style={{paddingTop:20}} onPress={() => navigation.navigate("Menu")}>
      <Image style={{height:50, width:50, borderRadius:50, borderColor:"#00308F", borderWidth:2}} source={require("../images/logo2.jpg")}/>
      </TouchableOpacity>
      <Text style={{fontSize:15, fontWeight: "bold", padding:20}}>Edit Your Profile</Text>
      {/* <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Set Up Your Profile</Text> */}

      <View style ={{flexDirection:"row", padding:10}}>
      <View style ={{padding:10}}>
      <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Age</Text>
      <TextInput
      value = {age}
      onChangeText = {setAge} 
      placeholder={"What's Your Age?"}
      maxLength={2}/>
      </View>
      
      <View style={{padding:10}}>
      <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Gender</Text>
      <TextInput
      value = {gender}
      onChangeText = {setGender} 
      placeholder={"What's Your Gender"}/>
      </View>
      </View>

    <View style={{flexDirection:"row", padding:10}}>
        <View style={{padding:10}}>
        <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Job</Text>
      <TextInput
      value = {job}
      onChangeText = {setJob} 
      placeholder={'What do you do?'}/>
        </View>
   

        <View style={{padding:10}}>
        <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Location</Text>
        <TextInput
        value = {location}
        onChangeText = {setLocation} 
        placeholder={'What area are you in? (City, State)'}/>
        </View>
        </View>        
      

      {/* Does the placeholder info actually pass in the info to VALUE when updating profile? */}
      {/* make images editable - probably add a function in ImageUpload to place user image there
      if profile is existing */}

        <View style ={{flexDirection:"row", padding:20}}>
            <ImageUpload images = {images} index={0} setImages = {setImages}/>
            <ImageUpload images = {images} index={1} setImages = {setImages}/>
            <ImageUpload images = {images} index={2} setImages = {setImages}/>
            </View> 

      <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F", paddingTop:10}}>Hobbies</Text>
      <TextInput
      value = {hobbies}
      multiline
      numberOfLines={2}
      onChangeText = {setHobbies} 
      placeholder={'What do you do for fun? i.e: Trying out new restaurants!'}/>

      <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F", paddingTop:20}}>Mission</Text>
      <TextInput
      value = {mission}
      multiline
      numberOfLines={2}
      onChangeText = {setMission} 
      placeholder={'What goal do you want to achieve? i.e Lose 10 pounds'}/>

      <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F", paddingTop:20}}>Medals</Text>
      <TextInput
      value = {accomplishments}
      multiline
      numberOfLines={2}
      onChangeText = {setAccomplishments} 
      placeholder={"What accomplishments are you most proud of? i.e Completing a marathon with a bad foot"}/>

      <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F", paddingTop:20}}>Strengths</Text>
      <TextInput
      value = {skills}
      multiline
      numberOfLines={2}
      onChangeText = {setSkills} 
      placeholder={'What are you good at? i.e: Calculating calories and being consistent'}/>    

      <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F", paddingTop:20}}>The Ideal Wing</Text>
      <TextInput
      value = {desires}
      multiline
      numberOfLines={2}
      onChangeText = {setDesires}
      placeholder={'How can a Wing best support you? i.e: Push me in the gym'}

      />


      <TouchableOpacity 
          disabled = {incompleteform}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updateUserProfile}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Update Profile</Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
  </View>
)
}

export default EditProfileScreen;
