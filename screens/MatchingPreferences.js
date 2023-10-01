import React, { useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity,ScrollView } from 'react-native'
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/core';
import Header from '../Header';
import { db } from '../firebase';
import AgePicker from '../components/AgePicker';
import GenderPicker from '../components/GenderPicker';
import TagPicker from '../components/TagPicker';
import YNRadioButton from '../components/YNRadioButton';




const MatchingPreferences = () => {
    // const [ ageMin, setAgeMin ] = useState(18);
    // const [ ageMax, setAgeMax ] = useState(100);
    const [ tag, setTag ] = useState("All");
    const [ activeStudent, setActiveStudent ] = useState(false);
    const [ wingUni, setWingUni ] = useState("Yes")
    // const [ matchRadius, setMatchRadius ] = useState(100);
    // const [ gender, setGender ] = useState("both");
    // const [ global, setGlobal ] = useState("true");


    const { params } = useRoute();
    const profile = params;

    const navigation = useNavigation();


    useEffect(()=>{
        if (profile) {
            // setAgeMax(profile.ageMax);
            // setAgeMin(profile.ageMin);
            // setGender(profile.genderPreference);
            if(profile?.tagPreference){
              setTag(profile.tagPreference);
            }

            if(profile?.university_student && profile.university_student.status==="active"){
              setActiveStudent(true);
            }


            if(profile?.universityPreference){
              setWingUni(profile.universityPreference)
            }
        }
    
      },[profile])

    const incompleteform = !tag//!ageMin||!ageMax||


    const updatePreferences = () => {
      if (activeStudent){
        updateDoc(doc(db, global.users,profile.id), {
          // ageMin: ageMin,
          // ageMax: ageMax,
          // matchRadius: matchRadius,
          // genderPreference: gender,
          tagPreference: tag,
          universityPreference: wingUni
          // globalMatchingBoolean: global
          }).then(()=> {
            //must trigger a refresh upon entering home screen
          navigation.navigate("Home",{ refresh: true })
      }).catch((error) => {
          alert(error.message)
      });
      } else {
        updateDoc(doc(db, global.users,profile.id), {
          // ageMin: ageMin,
          // ageMax: ageMax,
          // matchRadius: matchRadius,
          // genderPreference: gender,
          tagPreference: tag
          // globalMatchingBoolean: global
          }).then(()=> {
            //must trigger a refresh upon entering home screen
          navigation.navigate("Home",{ refresh: true })
      }).catch((error) => {
          alert(error.message)
      });
      }
    }


    return (
    <ScrollView style={{backgroundColor:"black"}}>

    <SafeAreaView style={{alignItems:"center"}}>
     {/* {profile?.genderPreference ? 
     ( */}
      <Header style={{fontSize:20, fontWeight: "bold"}} title={"Matching Preferences"}/>
     {/* ):(
      <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 4/4"}/>
     )} */}
    </SafeAreaView>
    <View style={{height:"90%", width:"100%", alignItems:"center", justifyContent:"space-evenly"}}>

      <Text style={{fontSize:15, fontWeight: "bold", padding:40, color:"white"}}>Choose Your Wing Preferences</Text> 

      {/* <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Select Age Range</Text>

      <View style ={{flexDirection:"row", alignItems:"center"}}>
        <View style ={{padding:10}}>
          <AgePicker age= {ageMin} setAge={setAgeMin} />
        </View>
      
        <Text>-</Text>

        <View style={{padding:10}}>
      
        <AgePicker age= {ageMax} setAge={setAgeMax} />
        </View>
      </View> */}


      {/* <View style={{alignItems:"center", paddingBottom:30}}>
        <Text style={{fontSize:15, top:40, fontWeight: "bold", color:"#00308F"}}>Gender</Text>
        <GenderPicker gender= {gender} setGender={setGender} both_boolean={true} />
      </View> */}

      <View style={{alignItems:"center", paddingBottom:60}}>
        <Text style={{fontSize:15, fontWeight: "bold", color:"white", padding:10}}>Mission Category</Text>
        <TagPicker tag= {tag} setTag={setTag} all_boolean={true} />
      </View>

      {activeStudent && (
        <View style={{alignItems:"center", padding:10}}>
        <Text style={{fontSize:15, fontWeight: "bold", color:"white", padding:5}}>Only See Users In Wing-U?</Text>
        <Text style={{fontSize:12, padding:20, color:"white"}}>{`(Exclusively university students)`}</Text>
        <YNRadioButton selectedOption={wingUni} setSelectedOption={setWingUni}/>
      </View>
      )}

      <View style={{height:150}}>
      <TouchableOpacity 
          disabled = {incompleteform}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updatePreferences}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Update Preferences</Text>
      </TouchableOpacity>
      </View>
      </View>
      </ScrollView>
    )
}

export default MatchingPreferences
