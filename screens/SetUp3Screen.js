import React, { useState } from 'react';
import { View, ScrollView, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc, writeBatch, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import TagPicker from '../components/TagPicker';
import Header from '../Header';
import EulaModal from '../components/EulaModal';
import ValuesList from '../components/ValuesList';
import missionText from '../welcome_sequence/mission';
import welcomeText from '../welcome_sequence/welcome';
import cultureText from '../welcome_sequence/values_etiquette';
import storyText from '../welcome_sequence/story';
import chatText from '../welcome_sequence/mychatrequest';
// import { readFileSync } from 'react-native-fs';


const SetUp3Screen = () => {
  const { user } = useAuth();
  const [mission, setMission] = useState(null);
  const [missiontag, setMissionTag] = useState("Let's Have Fun");
  const [eulaVisible, setEulaVisible] = useState(true);
  const [values, setValues] = useState([]);

  const navigation = useNavigation();
  const incompleteform = !mission || !values || values.length < 3;

  // const setUpChat = () => {
  //   const batch = writeBatch(db);

  //   const docRef = doc(db, global.users, user.uid, "requests", master.uid);//must have my UID stored somewhere


  //   const timestamp = serverTimestamp();

  //   const requestDoc = {
  //     id: master.uid,
  //     message: chatText,
  //     timestamp: timestamp,
  //     read: false
  //   }


  //   setDoc(docRef, requestDoc).then(() => {
  //     console.log('Chat Request added successfully');
  //   }).catch((error) => {
  //     console.log("auto chat from founder failed", error)
  //     alert(error.message)
  //   });

  // }

  const setUpAnnouncements = async () => {
    const batch = writeBatch(db);

    const textFiles = [
      { "path": 'https://firebasestorage.googleapis.com/v0/b/mission-partner-app.appspot.com/o/images%2Fannouncements%2F47541449-0897-4058-9596-F8352C6ED59E.jpg?alt=media&token=4e79cd48-4000-45d3-a5f4-e037b893d5f1&_gl=1*ngpm9j*_ga*MjEyOTMxMTI1Mi4xNjkwMDUyNTY4*_ga_CW55HF8NVT*MTY5ODE5NzYyNy4xNzMuMS4xNjk4MTk4MTkxLjQ2LjAuMA..', "type": 'image' },
      { "path": welcomeText, "type": 'text' },
      { "path": missionText, "type": 'text' },
      { "path": cultureText, "type": 'text' },
      { "path": 'https://firebasestorage.googleapis.com/v0/b/mission-partner-app.appspot.com/o/images%2Fannouncements%2F9BDF8690-5101-4852-89A2-CFB63BDEBCE1.jpg?alt=media&token=df1d8fc6-35ef-470b-8554-77d37d32467d&_gl=1*1a1x0ek*_ga*MjEyOTMxMTI1Mi4xNjkwMDUyNTY4*_ga_CW55HF8NVT*MTY5ODE5NzYyNy4xNzMuMS4xNjk4MTk4MzE3LjU5LjAuMA..', "type": 'image' },
      { "path": storyText, "type": 'text' },
    ];

    let secondsToAdd = 0;

    for (const file of textFiles) {
      // Read text from file
      const message = file["path"];

      // Reference to a new document in the "announcements" collection for the user
      const docRef = doc(collection(db, global.users, user.uid, "announcements"));

      const timestamp = new Date(Date.now() + (secondsToAdd * 1000))
      secondsToAdd++;

      console.log("timestamp", timestamp);

      const contentField = file["type"] === "text" ? "message" : "picture";

      batch.set(docRef, {
        id: docRef.id, // Auto-generated ID
        [contentField]: message, // Content from the text file
        read: false,
        timestamp: timestamp, // Current timestamp
        title: '',
        type: file['type'],
      });

    }

    try {
      await batch.commit();
      console.log('Announcements added successfully');
    } catch (error) {
      console.error('Error adding announcements: ', error);
    }

  }

  const updateUserProfile = () => {
    updateDoc(doc(db, global.users, user.uid), {
      mission: mission,
      mission_tag: missiontag,
      values: values,
    }).then(() => {
      setUpAnnouncements();
      // setUpChat();
      navigation.navigate("Home")
      navigation.navigate("WelcomeScreen")
      // navigation.navigate("SetUp4", {id: user.uid})
    }).catch((error) => {
      alert(error.message)
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


            <Text style={styles.formTitle}>Define Your Mission {`(40 char max)`}</Text>
            <Text style={{ fontSize: 12, margin: 20, color: "grey" }}>Hint: Think of a specific goal you want to achieve or activity you'd like to do with your Wing.</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
              <Text style={styles.formTitle}>I Want To: </Text>
              <TextInput
                value={mission}
                multiline
                numberOfLines={2}
                maxLength={40}
                onChangeText={setMission}
                placeholder={'Explore the local nightlife'}
                placeholderTextColor={"grey"}
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, marginTop: 20, width: "55%", backgroundColor: "#E0E0E0" }} />
            </View>

            <Text style={styles.formTitle}>Select The Category That Best Fits The Mission</Text>
            <Text style={{ fontSize: 12, margin: 2, color: "grey", padding: 15 }}>This will help to optimize matching you with the best Wing to assist your Mission.</Text>
            <TagPicker tag={missiontag} setTag={setMissionTag} />

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
