import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Button, Platform} from 'react-native';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/core';
// import TagPicker from '../components/TagPicker';
import Header from '../Header';
import EulaModal from '../components/EulaModal';
import * as Sentry from "@sentry/react";
import PromptModal from '../components/PromptModal';
import PromptPicker from '../components/PromptPicker';
import InterestsList from '../components/InterestsList';



const SetUp3Screen = () => {
  const { user } = useAuth();
  const [eulaVisible, setEulaVisible] = useState(false);
  // const [values, setValues] = useState([]);
  const [interests, setInterests] = useState([]);
  const [prompt, setPrompt] = useState(null)
  const [tagline, setTagline] = useState(null);
  const [isPromptVisible, setisPromptVisible] = useState(false);

  const navigation = useNavigation();
  // const incompleteform = !mission || !values || values.length < 3;
  const incompleteform = !tagline || !interests || interests.length < 5;

  const triggerEula = () =>{
    setEulaVisible(true);
  }


  const updateUserProfile = () => {
    const promptObject = {
      prompt: prompt,
      tagline: tagline,
    }

    updateDoc(doc(db, global.users, user.uid), {
      // values: values,
      interests: interests,
      prompts: [promptObject, null, null],
      completed_setup:true
    }).then(() => {
      navigation.navigate("Home")
      navigation.navigate("WelcomeScreen")
    }).catch((error) => {
      alert("Error updating profile. Try again later.")
      Sentry.captureMessage(`Error setting up data in screen 3 for ${user.uid}, ${error.message}`)
      Sentry.captureException(error)
    });
  }

  function handleAccept() {
    // handle user acceptance of EULA
    setEulaVisible(false); // hide the EULA modal after acceptance
    updateUserProfile();
  }

  function handleReject() {
    // handle user rejection of EULA
    setEulaVisible(false); // hide the EULA modal after rejection
    logout();

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
      keyboardVerticalOffset={5}>
      <TouchableWithoutFeedback
      // onPress={Keyboard.dismiss()}
      >
        <ScrollView style={{ marginHorizontal: 10 }}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>
            <SafeAreaView>
              <Header style={{ marginHorizontal: "17%", right: "40%" }} title={"Account Setup 3/3"} />
              {/* <Text style={{fontSize:20, fontWeight: "bold", padding:20}}>Account Setup 2/4</Text> */}
              <EulaModal
                isVisible={eulaVisible}
                handleAccept={handleAccept}
                handleReject={handleReject}
              />
            </SafeAreaView>

            <Text style={{ ...styles.formTitle, fontSize: 20 }}>Nearly Done!</Text>

            <PromptPicker tagline={tagline} prompt={prompt} setPromptVisible={setisPromptVisible}/>
            <Text style={{ fontSize: 12, margin: 20, color: "grey" }}>Tip: Make it interesting. This is your hook to get a Wing's attention.</Text>


            <Text style={styles.formTitle}>Select Your Top 5 Interests</Text>
            <Text style={{ fontSize: 12, margin: 20, color: "grey" }}>You may add your own as well.</Text>
            {/* <ValuesList selectedValues={values} setSelectedValues={setValues} /> */}
            <InterestsList selectedInterests={interests} setSelectedInterests={setInterests}/>

            <View style={{ height: 300 }}>
              <TouchableOpacity
                disabled={incompleteform}
                style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                onPress={triggerEula}>
                <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
          <PromptModal setTagline={setTagline} setPrompt={setPrompt} isVisible={isPromptVisible} setIsVisible={setisPromptVisible} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  formTitle: {
    fontSize: 15,
    fontWeight: "bold",
    padding: 10,
    marginTop: 20
  }
})

export default SetUp3Screen;
