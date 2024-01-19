import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Button } from 'react-native';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import ImageUpload from '../components/ImageUpload';
// import registerNotifications from '../lib/registerNotifications';
import { useNavigation } from '@react-navigation/core';
import TagPicker from '../components/TagPicker';
import ValuesList from '../components/ValuesList';
import ClassLevelPicker from '../components/ClassLevelPicker';
import GradYearPicker from '../components/GradYearPicker';
import { Entypo } from '@expo/vector-icons';
import * as Sentry from "@sentry/react";
import PromptModal from '../components/PromptModal';
import PromptPicker from '../components/PromptPicker';



const EditProfileScreen = ({ profile, setIsEditSaved }) => {
  const { user } = useAuth();

  const age = profile?.age || 18;
  const gender = profile?.gender || "male";
  const activeStudent = profile?.university_student?.status === "active";

  const [mission, setMission] = useState(profile?.mission || null);
  const [activitytag, setActivityTag] = useState(profile?.activity_tag || "None");

  const [prompt, setPrompt] = useState(profile?.prompts?.[0]?.prompt || null);
  const [tagline, setTagline] = useState(profile?.prompts?.[0]?.tagline || null);
  const [prompt1, setPrompt1] = useState(profile?.prompts?.[1]?.prompt || null);
  const [tagline1, setTagline1] = useState(profile?.prompts?.[1]?.tagline || null);
  const [prompt2, setPrompt2] = useState(profile?.prompts?.[2]?.prompt || null);
  const [tagline2, setTagline2] = useState(profile?.prompts?.[2]?.tagline || null);


  const [medal1, setMedal1] = useState(profile?.medals?.[0] || null);
  const [medal2, setMedal2] = useState(profile?.medals?.[1] || null);
  const [medal3, setMedal3] = useState(profile?.medals?.[2] || null);
  const [bio, setBio] = useState(profile?.bio || null);
  const [location, setLocation] = useState(profile?.location || null);
  const [hometown, setHometown] = useState(profile?.hometown || null);
  const [job, setJob] = useState(activeStudent ? null : profile?.job || null);
  const [company, setCompany] = useState(activeStudent ? null : profile?.company || null);
  const [school, setSchool] = useState(profile?.school || null);
  const [class_level, setClassLevel] = useState(activeStudent ? profile?.university_student?.class_level || "Undergraduate" : "Undergraduate");
  const [grad_year, setGradYear] = useState(activeStudent ? profile?.university_student?.grad_year || "2027" : "2027");
  const [incompleteForm, setIncompleteForm] = useState(true);
  const [url1, setUrl1] = useState(profile?.images?.[0] || null);
  const [url2, setUrl2] = useState(profile?.images?.[1] || null);
  const [url3, setUrl3] = useState(profile?.images?.[2] || null);
  const [values, setValues] = useState(profile?.values || []);
  const [isPromptVisible, setisPromptVisible] = useState(false);
  const [isPrompt1Visible, setisPrompt1Visible] = useState(false);
  const [isPrompt2Visible, setisPrompt2Visible] = useState(false);



  const navigation = useNavigation();

  useEffect(() => {
    if (profile && profile?.images && profile.images.length > 2) {
      if (url1 !== profile.images[0] || url2 !== profile.images[1] || url3 !== profile.images[2]) {
        console.log("change to false")
        setIsEditSaved(false);
      } else if (url1 === profile.images[0] && url2 === profile.images[1] && url3 === profile.images[2]) {
        console.log("change to true");
        setIsEditSaved(true);

      }
    }

  }, [url1, url2, url3])



  useEffect(() => {
    let form;

    if (activeStudent) {
      form = !url1 || !url2 || !url3 || !location || !values || values.length < 3 || !school || !tagline
    } else {
      form = !url1 || !url2 || !url3 || !location || !values || values.length < 3 || !job || !tagline


    }

    setIncompleteForm(form);

  }, [activeStudent, url1, url2, url3, location, values, school, tagline, job])


  const updateUserProfile = () => {

    let promptObject, promptObject1, promptObject2;

    if (tagline) {
      promptObject = {
        prompt: prompt,
        tagline: tagline
      }
    } else {
      alert("Must have at least first prompt set.")
      return;
    }

    if (tagline1) {
      promptObject1 = {
        prompt: prompt1,
        tagline: tagline1
      }
    } else {
      promptObject1 = null;
    }

    if (tagline2) {
      promptObject2 = {
        prompt: prompt2,
        tagline: tagline2
      }
    } else {
      promptObject2 = null;
    }

    const updateObject = {
      images: [url1, url2, url3],
      school: school,
      hometown: hometown,
      mission: mission,
      activity_tag: activitytag,
      prompts: [promptObject, promptObject1, promptObject2],
      medals: [medal1, medal2, medal3],
      values: values,
      location: location,
      bio: bio,
    }

    if (activeStudent) {
      updateObject.university_student =
      {
        status: "active",
        class_level: class_level,
        grad_year: grad_year
      }
    } else {
      updateObject.job = job
      updateObject.company = company
    }


    updateDoc(doc(db, global.users, user.uid), updateObject).then(() => {
      navigation.navigate("Home", { refresh: true });
    }).catch((error) => {
      Sentry.captureMessage("error at edit profile for ", user.uid, ", ", error.message)
      alert("Could not update profile. Try again later.")
      console.log(error.message)
    });

    setIsEditSaved(true);

  }

  //Use Header

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={15}>
      <TouchableWithoutFeedback
      // onPress={Keyboard.dismiss()}
      >
        <ScrollView style={{ marginHorizontal: 10 }}>

          <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly", backgroundColor: "white" }}>
            {/* <Text style={{ fontSize: 15, fontWeight: "bold", padding: 20, color: "#00BFFF" }}>Edit Your Profile</Text> */}



            <View style={{ flexDirection: "row" }}>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.formTitle}>Age</Text>

                {/* {!profile?.age ? (
        <AgePicker age= {age} setAge={setAge} />
      ):( */}
                <Text>{age}</Text>
                {/* )} */}

              </View>

              <View style={{ alignItems: "center" }}>
                <Text style={styles.formTitle}>Gender</Text>

                {/* {!profile?.gender ? (
        <GenderPicker gender= {gender} setGender={setGender} both_boolean={false} />
      ):( */}
                <Text>{gender}</Text>
                {/* )} */}
              </View>
            </View>

            <View style={{ flexDirection: "column", padding: 10 }}>

              <View style={{ padding: 10, alignItems: "center" }}>
                <Text style={styles.formTitle}>Location</Text>
                {!profile?.location ?
                  <Text>Must Turn on Location Services in Settings</Text>
                  : (
                    <Text>{location.text}</Text>
                  )}
              </View>

              <View style={{ padding: 10, alignItems: "center" }}>
                <Text style={styles.formTitle}>Hometown</Text>
                <TextInput
                  value={hometown}
                  onChangeText={setHometown}
                  placeholder={'Washington, DC'}
                  placeholderTextColor="#888888"
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0" }} />
              </View>
            </View>


            {activeStudent ?
              (
                <View style={{ flexDirection: "column", padding: 10 }}>
                  <View style={{ justifyContent: "center", alignItems: 'center', flexDirection: "row" }}>
                    <View style={{ width: "30%", backgroundColor: "#00BFFF", height: 2 }} />
                    <Text style={{ color: "#00BFFF", fontWeight: "800", fontSize: 25 }}>WING-U</Text>
                    <View style={{ width: "30%", backgroundColor: "#00BFFF", height: 2 }} />

                  </View>


                  <View style={{ padding: 20, alignItems: "center" }}>
                    <Text style={styles.formTitle}>Class Level</Text>
                    <ClassLevelPicker selectedLevel={class_level} setSelectedLevel={setClassLevel} />
                  </View>

                  <View style={{ padding: 20, alignItems: "center" }}>
                    <Text style={styles.formTitle}>Graduation Year</Text>
                    <GradYearPicker selectedYear={parseInt(grad_year, 10)} setSelectedYear={setGradYear} />
                  </View>

                  <View style={{ padding: 10, alignItems: "center" }}>
                    <Text style={styles.formTitle}>University Currently Attending</Text>
                    {/* <UniversityPicker university_chosen={school} setUniversity={setSchool}/> */}
                    <TextInput
                      value={school}
                      onChangeText={setSchool}
                      placeholder={'i.e American University'}
                      placeholderTextColor="#888888"
                      style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0" }} />
                  </View>

                  <View style={{ margin: 20, padding: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 13, textAlign: "center", padding: 10, }} numberOfLines={2}>{`(To show Professional options in profile, go to Account in Settings.)`}</Text>
                    <View style={{ width: "90%", backgroundColor: "#00BFFF", height: 2 }} />
                  </View>

                </View>
              ) : (
                <View style={{ flexDirection: "column", padding: 10 }}>
                  <View style={{ padding: 10, alignItems: "center" }}>
                    <Text style={styles.formTitle}>Job</Text>
                    <TextInput
                      value={job}
                      onChangeText={setJob}
                      placeholder={'What do you do?'}
                      placeholderTextColor="#888888"
                      style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0" }} />
                  </View>

                  <View style={{ padding: 10, alignItems: "center" }}>
                    <Text style={styles.formTitle}>Company</Text>
                    <TextInput
                      value={company}
                      onChangeText={setCompany}
                      placeholder={'Some Company Name'}
                      placeholderTextColor="#888888"
                      style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0" }} />
                  </View>

                  <View style={{ padding: 10, alignItems: "center" }}>
                    <Text style={styles.formTitle}>School Graduated From or Last Attended</Text>
                    <TextInput
                      value={school}
                      onChangeText={setSchool}
                      placeholder={'i.e American University'}
                      placeholderTextColor="#888888"
                      style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0" }} />
                  </View>
                </View>
              )}


            <View style={{ flexDirection: "row", paddingBottom: 10, paddingTop: 10 }}>
              <ImageUpload url={url1} setURL={setUrl1} index={0} userId={user.uid} />
              <ImageUpload url={url2} setURL={setUrl2} index={1} userId={user.uid} />
              <ImageUpload url={url3} setURL={setUrl3} index={2} userId={user.uid} />
            </View>

            <Text style={{ ...styles.formTitle, textAlign: "center" }}>Set a Tag for Activities You'd Be Open To Do With A Wing</Text>
            <TagPicker tag={activitytag} setTag={setActivityTag} />

            <Text style={styles.formTitle}>Prompts</Text>
            <Text style={{ color: "grey" }}>Must have at least one.</Text>
            <View style={{ alignItems: "center", flexDirection: "column", margin: 10 }}>
              <PromptPicker tagline={tagline} prompt={prompt} setPromptVisible={setisPromptVisible} />
              <PromptPicker tagline={tagline1} prompt={prompt1} setPromptVisible={setisPrompt1Visible} setTag={setTagline1} setPrompt={setPrompt1} />
              <PromptPicker tagline={tagline2} prompt={prompt2} setPromptVisible={setisPrompt2Visible} setTag={setTagline2} setPrompt={setPrompt2} />
            </View>




            <Text style={styles.formTitle}>Accomplishments</Text>
            <Text style={{ paddingBottom: 10, color: "grey" }}>List any strengths or accomplishments that you’re proud of.</Text>
            <View style={{ justifyContent: "flex-start", flexDirection: "column", margin: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                <Text>1.</Text>
                <TextInput
                  value={medal1}
                  multiline
                  numberOfLines={2}
                  maxLength={50}
                  onChangeText={setMedal1}
                  placeholder={"I completed a marathon."}
                  placeholderTextColor="#888888"
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", margin: 10, }} />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                <Text>2.</Text>
                <TextInput
                  value={medal2}
                  multiline
                  numberOfLines={2}
                  maxLength={50}
                  onChangeText={setMedal2}
                  placeholder={"I won a hotdog eating contest"}
                  placeholderTextColor="#888888"
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", margin: 10, }} />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                <Text>3.</Text>
                <TextInput
                  value={medal3}
                  multiline
                  numberOfLines={2}
                  maxLength={50}
                  onChangeText={setMedal3}
                  placeholder={"I have a Youtube channel with 3k subscribers."}
                  placeholderTextColor="#888888"
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", margin: 10, }} />
              </View>
            </View>


            <Text style={styles.formTitle}>Values</Text>
            <Text style={{ color: "grey", textAlign: "center" }}>Pick Three. This helps us find the Wings that will best match you.</Text>
            <ValuesList selectedValues={values} setSelectedValues={setValues} />

            <Text style={styles.formTitle}>A Life Mission or Short-Term Goal</Text>
            <Text style={{ paddingBottom: 10, color: "grey" }}>A Pursuit That Has Nothing To Do With Dating</Text>
            <TextInput
              value={mission}
              multiline
              numberOfLines={2}
              maxLength={40}
              onChangeText={setMission}
              placeholder={'Write A Novel'}
              placeholderTextColor="#888888"
              style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0" }} />

            <Text style={styles.formTitle}>Bio</Text>
            <Text style={{ paddingBottom: 10, color: "grey" }}>Share anything fun about you, i.e hobbies/passions</Text>
            <TextInput
              value={bio}
              multiline
              numberOfLines={4}
              maxLength={200}
              onChangeText={setBio}
              placeholder={'I love kayaking and drinking beers by the river.'}
              placeholderTextColor="#888888"
              style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0" }} />

            < View style={{ height: 150 }}>
              <TouchableOpacity
                disabled={incompleteForm}
                style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5 }, incompleteForm ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                onPress={updateUserProfile}>
                <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", color: "white" }}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
          <PromptModal setTagline={setTagline} setPrompt={setPrompt} isVisible={isPromptVisible} setIsVisible={setisPromptVisible} />
          <PromptModal setTagline={setTagline1} setPrompt={setPrompt1} isVisible={isPrompt1Visible} setIsVisible={setisPrompt1Visible} charLimit={150} />
          <PromptModal setTagline={setTagline2} setPrompt={setPrompt2} isVisible={isPrompt2Visible} setIsVisible={setisPrompt2Visible} charLimit={150} />

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView >
  )
}

const styles = StyleSheet.create({
  formTitle: {
    fontSize: 15,
    fontWeight: "bold",
    // color: "#00308F",
    // color:"#00BFFF",
    padding: 20
  }
})

export default EditProfileScreen;