import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import getLocation from '../lib/getLocation';
import BirthdayInput from '../components/BirthdayInput';
import GenderPicker from '../components/GenderPicker';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import registerNotifications from '../lib/registerNotifications';
import Header from '../Header';

const SetUp0Screen = () => {
  const { user } = useAuth();
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState("male");
  const [location, setLocation] = useState(null);
  const [birthdate, setBirthDate] = useState(null);
  const [token, setToken] = useState(null);
  const [name, setName] = useState(user.displayName?.split(" ")[0]);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const geoLocation = await getLocation()
      setLocation(geoLocation)
      const pushtoken = await registerNotifications();
      setToken(pushtoken)
    })();
  }, []);


  const incompleteform = !gender || !age || !location || !name;//!job||

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
      latest_read_announcement: "",
      
      token: token,
      timestamp: serverTimestamp()
    }).then(() => {
      navigation.navigate("SetUp1")
    }).catch((error) => {
      alert(error.message)
    });
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
      keyboardVerticalOffset={10}>
      <ScrollView style={{ marginHorizontal: 10}}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly"}}>
      <SafeAreaView>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss()}
        >
          <Text style={{ color: "#00BFFF", fontSize: 20, fontWeight: "bold", padding:20}}>Account Setup 1/3</Text>

        
        </TouchableWithoutFeedback>
        </SafeAreaView>

          {(!user.displayName || user.displayName === "null" || user.displayName === "") && (
            <View>
              <Text style={styles.formTitle}>What's Your First Name?</Text>
              <TextInput
                onChangeText={setName}
                placeholder={'John'}
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor:"#E0E0E0" }} />
            </View>
          )
          }
          <Text style={styles.formTitle}>Enter Your BirthDate</Text>
          <BirthdayInput setAge={setAge} birthdate={birthdate} setBirthDate={setBirthDate} />
          <Text style={{color:"grey", paddingBottom:20}}>Ensure format is correct, i.e: 11/20/2023</Text>


          <Text style={styles.formTitle}>Select Gender</Text>
          <GenderPicker gender={gender} setGender={setGender} both_boolean={false} />


          <Text style={styles.formTitle}>Set Location</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder='City, State'
            placeholderTextColor={"grey"}
            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, marginBottom:20, backgroundColor:"#E0E0E0"}} />

          <View style={{ height: 150 }}>
            <TouchableOpacity
              disabled={incompleteform}
              style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
              onPress={createUserProfile}>
              <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </View> */}
        </ScrollView>
    </KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({
  formTitle: {
    fontSize: 15,
    fontWeight: "bold",
    padding: 20
  }
})

export default SetUp0Screen
