import React, { useState } from 'react';
import { View, ScrollView, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import TagPicker from '../components/TagPicker';
import Header from '../Header';
import EulaModal from '../components/EulaModal';
import ValuesList from '../components/ValuesList';


const SetUp3Screen = () => {
  const { user } = useAuth();
  const [mission, setMission] = useState(null);
  const [missiontag, setMissionTag] = useState("Let's Have Fun");
  const [eulaVisible, setEulaVisible] = useState(true);
  const [values, setValues] = useState([]);



  const navigation = useNavigation();
  const incompleteform = !mission || !values || values.length < 3;

  const updateUserProfile = () => {
    updateDoc(doc(db, global.users, user.uid), {
      mission: mission,
      mission_tag: missiontag,
      values: values,
    }).then(() => {
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
      style={{ flex: 1, backgroundColor: "black" }}
      keyboardVerticalOffset={5}>
      <TouchableWithoutFeedback
      // onPress={Keyboard.dismiss()}
      >
        <ScrollView style={{ marginHorizontal: 10 }}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly", backgroundColor: "black" }}>
            <SafeAreaView>
              <Header style={{ fontSize: 20, fontWeight: "bold", padding: 20 }} title={"Account Setup 3/3"} />
              {/* <Text style={{fontSize:20, fontWeight: "bold", padding:20}}>Account Setup 2/4</Text> */}
              <EulaModal
                isVisible={eulaVisible}
                handleAccept={handleAccept}
                handleReject={handleReject}
              />
            </SafeAreaView>

            <Text style={{...styles.formTitle, fontSize:20}}>Nearly There!</Text>


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
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color: "white", marginTop:20 }} />
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
    color: "white",
    padding: 10,
    marginTop:20
  }
})

export default SetUp3Screen;
