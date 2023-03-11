import React, { Component, useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TextInput, TouchableOpacity,ScrollView } from 'react-native'
import { doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/core';
import Header from '../Header';
import { db } from '../firebase';
import AgePicker from '../components/AgePicker';
import GenderPicker from '../components/GenderPicker';
import TagPicker from '../components/TagPicker';




const MatchingPreferences = () => {
    const [ ageMin, setAgeMin ] = useState(18);
    const [ ageMax, setAgeMax ] = useState(50);
    const [ tag, setTag ] = useState("All")
    // const [ matchRadius, setMatchRadius ] = useState(100);
    const [ gender, setGender ] = useState("both");
    // const [ global, setGlobal ] = useState("true");


    const { params } = useRoute();
    const profile = params;

    const navigation = useNavigation();


    useEffect(()=>{
        if (profile && profile?.ageMin && profile?.ageMax && profile?.genderPreference && profile?.tagPreference) {
            setAgeMax(profile.ageMax);
            setAgeMin(profile.ageMin);
            setGender(profile.genderPreference);
            setTag(profile.tagPreference);

        }
    
      },[profile])

    const incompleteform = !ageMin||!gender||!ageMax||!tag


    const updatePreferences = () => {
      updateDoc(doc(db, 'users',profile.id), {
            ageMin: ageMin,
            ageMax: ageMax,
            // matchRadius: matchRadius,
            genderPreference: gender,
            tagPreference: tag
            // globalMatchingBoolean: global
            }).then(()=> {
              //must trigger a refresh upon entering home screen
            navigation.navigate("Home")
        }).catch((error) => {
            alert(error.message)
        });
    }


    return (
    <ScrollView style={{marginHorizontal:10}}>

    <SafeAreaView style={{alignItems:"center"}}>
     {profile?.genderPreference ? 
     (
      <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Matching Preferences"}/>
     ):(
      <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 4/4"}/>
     )}
    </SafeAreaView>
    <View style={{height:"90%", width:"100%", alignItems:"center", justifyContent:"space-evenly"}}>

      <Text style={{fontSize:15, fontWeight: "bold", padding:40}}>Choose Your Wing Preferences</Text> 

      <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Select Age Range</Text>

      <View style ={{flexDirection:"row", alignItems:"center"}}>
        <View style ={{padding:10}}>
          <AgePicker age= {ageMin} setAge={setAgeMin} />
        </View>
      
        <Text>-</Text>

        <View style={{padding:10}}>
      
        <AgePicker age= {ageMax} setAge={setAgeMax} />
        </View>
      </View>


      <View style={{alignItems:"center", paddingBottom:30}}>
        <Text style={{fontSize:15, top:40, fontWeight: "bold", color:"#00308F"}}>Gender</Text>
        <GenderPicker gender= {gender} setGender={setGender} both_boolean={true} />
      </View>

      <View style={{alignItems:"center", paddingBottom:60}}>
        <Text style={{top:40,fontSize:15, fontWeight: "bold", color:"#00308F"}}>Mission Category</Text>
        <TagPicker tag= {tag} setTag={setTag} all_boolean={true} />
      </View>

      <TouchableOpacity 
          disabled = {incompleteform}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updatePreferences}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Update Preferences</Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
    )
}

export default MatchingPreferences
