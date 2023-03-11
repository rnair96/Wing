import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import useAuth from '../hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/core';
import { registerIndieID } from 'native-notify';
import getLocation from '../lib/getLocation';
import BirthdayInput from '../components/BirthdayInput';
import GenderPicker from '../components/GenderPicker';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const SetUp0Screen = () => {
    const { user } = useAuth();
    const [ job, setJob ] = useState(null);
    const [ age, setAge ] = useState(null);
    const [ gender, setGender ] = useState("male");
    const [ location, setLocation ] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
          const geoLocation = await getLocation()
          setLocation(geoLocation)
        })();
      }, []);

    
    registerIndieID(user.uid, 6654, 'A2FDEodxIsFgrMD1Mbvpll');


    const incompleteform = !gender||!age||!location||!job;

    const createUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName.split(" ")[0],
            email: user.email,
            job: job,
            age: age,
            gender: gender,
            location: location,
            timestamp: serverTimestamp()
        }).then(()=> {
              navigation.navigate("SetUp1")
        }).catch((error) => {
            alert(error.message)
        });
    }


    return (
        <ScrollView style={{marginHorizontal:10}}>
        <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
        <Text style={{fontSize:20, fontWeight: "bold", padding:20}}>Account Setup 1/4</Text>
        <Text style={{fontSize:15, fontWeight: "bold", padding:20}}>The Basics</Text>
        </SafeAreaView>


        <View style ={{flexDirection:"column", alignItems:"center"}}>
        <Text style={styles.formTitle}>Enter Your BirthDate</Text>
        
          <BirthdayInput setAge={setAge} />
                
        <Text style={styles.formTitle}>Gender</Text>
        <GenderPicker gender= {gender} setGender={setGender} both_boolean={false} />

          <Text style={styles.formTitle}>Provide Occupation</Text>
        <TextInput
        value = {job}
        onChangeText = {setJob} 
        placeholder={'What do you do?'}
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
     
            <Text style={styles.formTitle}>Set Location</Text>
            <TextInput
            value = {location}
            onChangeText = {setLocation} 
            placeholder={'What area are you in? (City, State)'}
            style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>     

            <View style={{height:150}}>
            <TouchableOpacity 
            disabled = {incompleteform}
            style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
            onPress = {createUserProfile}>
            <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Next</Text>
            </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
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

export default SetUp0Screen
