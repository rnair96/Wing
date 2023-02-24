import React, { Component, useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import { doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/core';
import Header from '../Header';
import { db } from '../firebase';
import AgePicker from '../components/AgePicker';
import GenderPicker from '../components/GenderPicker';
import TagPicker from '../components/TagPicker';




const MatchingPreferences = () => {
    const [ ageMin, setAgeMin ] = useState(18);
    const [ ageMax, setAgeMax ] = useState(100);
    const [ tag, setTag ] = useState("All")
    // const [ matchRadius, setMatchRadius ] = useState(100);
    const [ gender, setGender ] = useState("both");
    // const [ global, setGlobal ] = useState("true");

    // const handleGenderChange = (option) => {
    //   setGender(option);
    // };

    const { params } = useRoute();
    const profile = params;
    // console.log("profile",profile)

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
    <SafeAreaView>

     {profile?.genderPreference ? 
     (
      <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Matching Preferences"}/>
     ):(
      <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 2/2"}/>
     )} 
    <View style={{height:"90%", width:"100%", alignItems:"center", justifyContent:"space-evenly"}}>

    <Text style={{fontSize:15, fontWeight: "bold", padding:20}}>Choose Your Preferences</Text> 

    <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Select Age Range</Text>

    <View style ={{flexDirection:"row", alignItems:"center"}}>
    <View style ={{padding:10}}>
      {/* <TextInput
      value = {ageMin}
      onChangeText = {setAgeMin} 
      placeholder={"Minimum age"}
      maxLength={2}/> */}
      <AgePicker age= {ageMin} setAge={setAgeMin} />
      </View>
      
        <Text>-</Text>

      <View style={{padding:10}}>
      {/* <TextInput
      value = {ageMax}
      onChangeText = {setAgeMax} 
      placeholder={"Maximum age"}/> */}
      <AgePicker age= {ageMax} setAge={setAgeMax} />
      </View>
      </View>


      <View 
        style={{alignItems:"center", paddingBottom:30}}>
        <Text style={{fontSize:15, top:40, fontWeight: "bold", color:"#00308F"}}>Gender</Text>
      {/* <Picker
            style={{height:200, width:'40%'}}
        selectedValue={gender}
        onValueChange={handleGenderChange}
        enabled='true'
      >
        <Picker.Item label="Both" value="both" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker> */}
          <GenderPicker gender= {gender} setGender={setGender} both_boolean={true} />
          </View>

      {/* <Button onPress={} title="Radio" color="#00BFFF"/> */}

      <View 
        style={{alignItems:"center"}}>
        <Text style={{top:40,fontSize:15, fontWeight: "bold", color:"#00308F"}}>Mission Tags</Text>

      {/* <Picker
            style={{height:200, width:'40%'}}
        selectedValue={gender}
        onValueChange={handleGenderChange}
        enabled='true'
      >
        <Picker.Item label="Both" value="both" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker> */}
          <TagPicker tag= {tag} setTag={setTag} all_boolean={true} />





      {/* <TextInput
      value = {gender}
      onChangeText = {setGender} 
      placeholder={"What's Your Gender"}/> */}
      </View>

      <TouchableOpacity 
          disabled = {incompleteform}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updatePreferences}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Update Preferences</Text>
      </TouchableOpacity>
      </View>
      </SafeAreaView>
    )
}

export default MatchingPreferences
