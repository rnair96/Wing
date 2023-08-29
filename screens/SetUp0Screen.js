import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import getLocation from '../lib/getLocation';
import BirthdayInput from '../components/BirthdayInput';
import GenderPicker from '../components/GenderPicker';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import registerNotifications from '../lib/registerNotifications';

const SetUp0Screen = () => {
    const { user, logout } = useAuth();
    // const [ job, setJob ] = useState(null);
    const [ age, setAge ] = useState(null);
    const [ gender, setGender ] = useState("male");
    const [ location, setLocation ] = useState(null);
    const [ birthdate, setBirthDate ] = useState(null);
    const [ token, setToken ] = useState(null);
    const [ name, setName ] = useState(user.displayName?.split(" ")[0]);

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
          const geoLocation = await getLocation()
          setLocation(geoLocation)
          const pushtoken = await registerNotifications();
          setToken(pushtoken)
        })();
      }, []);


    const incompleteform = !gender||!age||!location||!name;//!job||

    const createUserProfile = () => {
        setDoc(doc(db, global.users, user.uid), {
            id: user.uid,
            displayName: name,
            email: user.email,
            // job: job,
            age: age,
            birthdate: birthdate,
            last_year_celebrated: 2022,
            gender: gender,
            location: location,
            // rank: "Airman",
            // points: 0,
            // recently_promoted: true,
            token: token,
            timestamp: serverTimestamp()
        }).then(()=> {
              navigation.navigate("SetUp1")
        }).catch((error) => {
            alert(error.message)
        });
    }


    return (
      // <KeyboardAvoidingView
      //       behavior={Platform.OS === "ios" ? "padding" : "height"}
      //       style={{flex:1}}
      //       keyboardVerticalOffset={15}>
      //   <TouchableWithoutFeedback 
      //     // onPress={Keyboard.dismiss()}
      //   >
        // <ScrollView style={{marginHorizontal:10}}>
        <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>

          {/* header with logout and title for Account Setup 1/5 */}
      


        <View style ={{flexDirection:"column", alignItems:"center"}}>

        {(!user.displayName||user.displayName==="null"||user.displayName==="") && (
          <View>
          <Text style={styles.formTitle}>What's Your First Name?</Text>
          <TextInput
          onChangeText = {setName} 
          placeholder={'John'}
          style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/> 
          </View>
        )
        }
        <Text style={styles.formTitle}>Enter Your BirthDate</Text>
        
          <BirthdayInput setAge={setAge} birthdate={birthdate} setBirthDate={setBirthDate}/>
                
        <Text style={styles.formTitle}>Select Gender</Text>
        <GenderPicker gender= {gender} setGender={setGender} both_boolean={false} />

          {/* <Text style={styles.formTitle}>Provide Occupation</Text>
          <Text style={{fontSize:10, fontWeight: "bold", color:"#00308F", padding:5}}>{'(If Student, Provide Field & Level)'}</Text>
        <TextInput
        value = {job}
        onChangeText = {setJob} 
        placeholder={'Law Student, Freshman'}
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/> */}
     
            <Text style={styles.formTitle}>Set Location</Text>
            <TextInput
            value = {location}
            onChangeText = {setLocation} 
            placeholder={'(City, State)'}
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
        {/* </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView> */}
        </SafeAreaView>

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
