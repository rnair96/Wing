import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Button } from 'react-native';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc, writeBatch, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
// import TagPicker from '../components/TagPicker';
import Header from '../Header';
import EulaModal from '../components/EulaModal';
import ValuesList from '../components/ValuesList';
import { Entypo } from '@expo/vector-icons';
import * as Sentry from "@sentry/react";
import PromptModal from '../components/PromptModal';



const SetUp3Screen = () => {
  const { user } = useAuth();
  const [eulaVisible, setEulaVisible] = useState(true);
  const [values, setValues] = useState([]);
  const [prompt, setPrompt] = useState(null)
  const [tagline, setTagline] = useState(null);
  const [isPromptVisible, setisPromptVisible] = useState(false);

  const navigation = useNavigation();
  // const incompleteform = !mission || !values || values.length < 3;
  const incompleteform = !tagline || !values || values.length < 3;


  const route = useRoute();


  const updateUserProfile = () => {
    const promptObject = {
      prompt: prompt,
      tagline: tagline
    }

    updateDoc(doc(db, global.users, user.uid), {
      values: values,
      // tagline: {
      //   prompt: prompt,
      //   tagline: tagline,
      // }
      prompts: [promptObject, null, null]
    }).then(() => {
      navigation.navigate("Home")
      navigation.navigate("WelcomeScreen")
    }).catch((error) => {
      alert("Error updating profile. Try again later.")
      Sentry.captureMessage(`Error setting up data in screen 3 for ${user.uid}, ${error.message}`)
    });
  }

  function handleAccept() {
    // handle user acceptance of EULA
    setEulaVisible(false); // hide the EULA modal after acceptance
  }

  function handleReject() {
    // handle user rejection of EULA
    setEulaVisible(false); // hide the EULA modal after rejection
    logout();

  }

  // useEffect(() => {
  //   if (route.params?.tagline && route.params?.prompt) {
  //     console.log("getting tagline")
  //     setTagline(route.params.tagline);
  //     setPrompt(route.params.prompt)
  //   }
  // }, [route.params])

  //Use Header

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


            {/* <Text style={styles.formTitle}>Create Your Tagline {`(40 char max)`}</Text> */}
            {/* <Text style={{ fontSize: 12, margin: 20, color: "grey" }}>"Help me meet my future ex-wife", "I'm just here so I won't get fined", "New in town. Show me the local nightlife" </Text> */}
            {/* <Text style={{ fontSize: 12, margin: 20, color: "grey" }}>Ex 2 - "I'm just here so I won't get fined" - Marshawn Lynch</Text> */}
            {/* <Text style={{ fontSize: 12, margin: 20, color: "grey" }}>Ex 3 - Looking to meet my future ex-wife</Text> */}
            {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}> */}
            {/* <Text style={styles.formTitle}>I'm Here To: </Text> */}
            {/* <TextInput
                value={mission}
                multiline
                numberOfLines={2}
                maxLength={40}
                onChangeText={setMission}
                placeholder={'Explore the local nightlife'}
                placeholderTextColor={"grey"}
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, marginTop: 20, width: "55%", backgroundColor: "#E0E0E0" }} /> */}
            {/* </View> */}

            {tagline && prompt ? (
              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity style={{ left: 8, borderRadius: 50, borderWidth: 1, alignItems: "center", justifyContent: "center", width: 30, backgroundColor: "white", zIndex: 1 }} onPress={() => setisPromptVisible(true)}>
                  <Entypo name="cross" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ bottom: 10, backgroundColor: "#E0E0E0", padding: 10, margin: 5, borderRadius: 15, alignItems: "center", top: 20, zIndex: 0 }}>
                  <Text>{prompt}</Text>
                  <Text style={{ fontWeight: "bold", paddingTop: 10 }}>{tagline}</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={{ borderWidth: 1, borderColor: "blue", margin: 10, borderRadius: 10 }} onPress={() => setisPromptVisible(true)}>
                <Text style={{ color: "#00BFFF", fontSize: 20, padding: 5 }}>Tap to Add A Prompt</Text>
              </TouchableOpacity>
            )

            }
            <Text style={{ fontSize: 12, margin: 20, color: "grey" }}>Tip: Make it interesting. This is your hook to get a Wing's attention.</Text>


            {/* <Text style={styles.formTitle}>Select The Category That Best Fits The Mission</Text>
            <Text style={{ fontSize: 12, margin: 2, color: "grey", padding: 15 }}>This will help to optimize matching you with the best Wing to assist your Mission.</Text>
            <TagPicker tag={missiontag} setTag={setMissionTag} /> */}

            <Text style={styles.formTitle}>Select Your 3 Top Values</Text>
            <ValuesList selectedValues={values} setSelectedValues={setValues} />

            <View style={{ height: 300 }}>
              <TouchableOpacity
                disabled={incompleteform}
                style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                onPress={updateUserProfile}>
                <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Next</Text>
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
