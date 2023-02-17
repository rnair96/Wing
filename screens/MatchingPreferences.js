import React, { Component, useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Picker } from '@react-native-picker/picker';
import Header from '../Header';
import { db } from '../firebase';




const MatchingPreferences = () => {
    const [ ageMin, setAgeMin ] = useState("18");
    const [ ageMax, setAgeMax ] = useState("100");
    // const [ matchRadius, setMatchRadius ] = useState(100);
    const [ gender, setGender ] = useState("both");
    // const [ global, setGlobal ] = useState("true");

    const handleGenderChange = (option) => {
      setGender(option);
    };

    const { params } = useRoute();
    const profile = params;

    const navigation = useNavigation();


    useEffect(()=>{
        if (profile && profile?.ageMin && profile?.ageMax && profile?.genderPreference) {
            setAgeMax(profile.ageMax);
            setAgeMin(profile.ageMin);
            setGender(profile.genderPreference);
        }
    
      },[profile])

    const incompleteform = !ageMin||!gender||!ageMax

    console.log('profile',profile.id)


    const updatePreferences = () => {
        setDoc(doc(db, 'users', profile.id, 'preferences', profile.id), {
            ageMin: ageMin,
            ageMax: ageMax,
            // matchRadius: matchRadius,
            genderPreference: gender
            // globalMatchingBoolean: global
            }).then(()=> {
            navigation.navigate("Menu")
        }).catch((error) => {
            alert(error.message)
        });
    }


    return (
    <SafeAreaView>
    <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Matching Preferences"}/>
    <View style={{alignItems:"center", justifyContent:"space-evenly"}}>


    <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Select Age Range</Text>

    <View style ={{flexDirection:"row"}}>
    <View style ={{padding:10}}>
      <TextInput
      value = {ageMin}
      onChangeText = {setAgeMin} 
      placeholder={"Minimum age"}
      maxLength={2}/>
      </View>
      
      <View style={{padding:10}}>
      <TextInput
      value = {ageMax}
      onChangeText = {setAgeMax} 
      placeholder={"Maximum age"}/>
      </View>
      </View>


      <View 
        style={{flexDirection:"row", alignItems:"center"}}>
        <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Gender</Text>
      <Picker
            style={{height:200, width:'40%'}}
        selectedValue={gender}
        onValueChange={handleGenderChange}
        enabled='true'
      >
        <Picker.Item label="Both" value="Both" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      {/* <Button onPress={} title="Radio" color="#00BFFF"/> */}





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
