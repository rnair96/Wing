import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import ImageUpload from '../components/ImageUpload';
import registerNotifications from '../lib/registerNotifications';
import { useNavigation } from '@react-navigation/core';
import TagPicker from '../components/TagPicker';
import ValuesList from '../components/ValuesList';
import ClassLevelPicker from '../components/ClassLevelPicker';
import GradYearPicker from '../components/GradYearPicker';
import * as Sentry from "@sentry/react";



const EditProfileScreen = ({ profile }) => {
  const { user } = useAuth();
  const [age, setAge] = useState(18);
  const [oldtoken, setOldToken] = useState(null);
  const [newtoken, setNewToken] = useState("not_granted");
  const [mission, setMission] = useState(null);
  const [missiontag, setMissionTag] = useState("Social");
  const [gender, setGender] = useState("male");
  const [medal1, setMedal1] = useState(null);
  const [medal2, setMedal2] = useState(null);
  const [medal3, setMedal3] = useState(null);
  const [bio, setBio] = useState(null);
  const [location, setLocation] = useState(null);

  const [activeStudent, setActiveStudent] = useState(false);

  const [hometown, setHometown] = useState(null);
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [school, setSchool] = useState(null);
  const [class_level, setClassLevel] = useState("Undergraduate");
  const [grad_year, setGradYear] = useState("2027");

  const [incompleteForm, setIncompleteForm] = useState(true);
  const [url1, setUrl1] = useState(null);
  const [url2, setUrl2] = useState(null);
  const [url3, setUrl3] = useState(null);
  const [values, setValues] = useState([])

  const navigation = useNavigation();




  useEffect(() => {
    if (profile) {
      if (profile?.images && profile.images.length > 2) {
        setUrl1(profile.images[0]);
        setUrl2(profile.images[1]);
        setUrl3(profile.images[2]);
      }

      if (profile?.medals && profile.medals.length > 2) {
        setMedal1(profile.medals[0]);
        setMedal2(profile.medals[1]);
        setMedal3(profile.medals[2]);
      }

      profile?.age !== undefined && setAge(parseInt(profile.age));
      profile?.mission !== undefined && setMission(profile.mission);
      profile?.gender !== undefined && setGender(profile.gender);
      

      profile?.bio !== undefined && setBio(profile.bio);
      profile?.location !== undefined && setLocation(profile.location);
      profile?.values !== undefined && setValues(profile.values)
      profile?.mission_tag !== undefined && setMissionTag(profile.mission_tag);
      profile?.token !== undefined && setOldToken(profile.token);
      profile?.school !== undefined && setSchool(profile.school);
      profile?.hometown !== undefined && setHometown(profile.hometown);
      if (profile.university_student && profile.university_student.status === "active") {
        profile?.class_level !== undefined && setClassLevel(profile.university_student.class_level)
        profile?.grad_year !== undefined && setGradYear(profile.university_student.grad_year)
        setActiveStudent(true)
      } else {
        profile?.job !== undefined && setJob(profile.job);
        profile?.company !== undefined && setCompany(profile.company);
      }


    }

  }, [profile])

  console.log("mission", mission)



  useEffect(() => {
    let form;
    // console.log("how about here?",mission)
    if (activeStudent) {
      form = !url1 || !url2 || !url3  || !location || !values || !school || !mission
    } else {//|| !medal1 || !medal2 || !medal3 || !bio || !class_level || !grad_year
      form = !url1 || !url2 || !url3  || !location || !values ||!job || !mission;//|| !medal1 || !medal2 || !medal3 || !bio 

    }

    setIncompleteForm(form);

  }, [activeStudent, url1, url2, url3, location, values, school, mission, job])//  medal1, medal2, medal3, class_level, grad_year, bio,

//activeStudent, url1, url2, url3, location, values, school, mission


  useEffect(() => {
    (async () => {
      if (oldtoken && (oldtoken === "testing" || oldtoken === "not_granted")) {
        const new_token = await registerNotifications();
        setNewToken(new_token);
      } else {
        setNewToken(oldtoken);
      }
    })();

  }, [oldtoken])
  //create a screen at sign in for notifications




  const updateUserProfile = () => {

    if (activeStudent) { // change to one call of update doc, with different docs sent

      updateDoc(doc(db, global.users, user.uid), {
        images: [url1, url2, url3],
        university_student: {
          status: "active",
          class_level: class_level,
          grad_year: grad_year
        },
        school: school,
        hometown: hometown,
        mission: mission,
        mission_tag: missiontag,
        medals: [medal1, medal2, medal3],
        values: values,
        location: location,
        token: newtoken,
        bio: bio
      }).then(() => {
        navigation.navigate("Home");
      }).catch((error) => {
        Sentry.captureMessage("error at edit profile for student", error.message)
        console.log(error.message)
      });
    } else {

      updateDoc(doc(db, global.users, user.uid), {
        images: [url1, url2, url3],
        job: job,
        company: company,
        school: school,
        hometown: hometown,
        mission: mission,
        mission_tag: missiontag,
        medals: [medal1, medal2, medal3],
        values: values,
        location: location,
        token: newtoken,
        bio: bio
      }).then(() => {
        navigation.navigate("Home");
      }).catch((error) => {
        Sentry.captureMessage("error at edit profile for professional", error.message)
        console.log(error.message)
      });
    }

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

          <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly", backgroundColor: "black" }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", padding: 20, color: "#00BFFF" }}>Edit Your Profile</Text>



            <View style={{ flexDirection: "row" }}>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.formTitle}>Age</Text>

                {/* {!profile?.age ? (
        <AgePicker age= {age} setAge={setAge} />
      ):( */}
                <Text style={{ color: "white" }}>{age}</Text>
                {/* )} */}

              </View>

              <View style={{ alignItems: "center" }}>
                <Text style={styles.formTitle}>Gender</Text>

                {/* {!profile?.gender ? (
        <GenderPicker gender= {gender} setGender={setGender} both_boolean={false} />
      ):( */}
                <Text style={{ color: "white" }}>{gender}</Text>
                {/* )} */}
              </View>
            </View>

            <View style={{ flexDirection: "column", padding: 10 }}>

              <View style={{ padding: 10, alignItems: "center" }}>
                <Text style={styles.formTitle}>Location</Text>
                {!profile?.location ?
                  (<TextInput
                    value={location}
                    onChangeText={setLocation}
                    placeholder={'What area are you in? (City, State)'}
                    placeholderTextColor="#888888"
                    style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color: "white" }} />)
                  : (
                    <Text style={{ color: "white" }}>{location}</Text>
                  )}
              </View>

              <View style={{ padding: 10, alignItems: "center" }}>
                <Text style={styles.formTitle}>Hometown</Text>
                <TextInput
                  value={hometown}
                  onChangeText={setHometown}
                  placeholder={'Washington, DC'}
                  placeholderTextColor="#888888"
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color: "white" }} />
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
                      style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color: "white" }} />
                  </View>

                  <View style={{ margin: 20, padding: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 13, textAlign: "center", padding: 10, color: "white" }} numberOfLines={2}>{`(To show Professional options in profile, go to Account in Settings.)`}</Text>
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
                      style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color: "white" }} />
                  </View>

                  <View style={{ padding: 10, alignItems: "center" }}>
                    <Text style={styles.formTitle}>Company</Text>
                    <TextInput
                      value={company}
                      onChangeText={setCompany}
                      placeholder={'Some Company Name'}
                      placeholderTextColor="#888888"
                      style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color: "white" }} />
                  </View>

                  <View style={{ padding: 10, alignItems: "center" }}>
                    <Text style={styles.formTitle}>School Graduated From or Last Attended</Text>
                    <TextInput
                      value={school}
                      onChangeText={setSchool}
                      placeholder={'i.e American University'}
                      placeholderTextColor="#888888"
                      style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color: "white" }} />
                  </View>
                </View>
              )}


            <View style={{ flexDirection: "row", padding: 20 }}>
              <ImageUpload url={url1} setURL={setUrl1} index={0} userId={user.uid} />
              <ImageUpload url={url2} setURL={setUrl2} index={1} userId={user.uid} />
              <ImageUpload url={url3} setURL={setUrl3} index={2} userId={user.uid} />
            </View>

            <Text style={styles.formTitle}>Bio</Text>
            <TextInput
              value={bio}
              multiline
              numberOfLines={4}
              maxLength={200}
              onChangeText={setBio}
              placeholder={'Share something fun about you i.e: I love kayaking and drinking beers by the river.'}
              placeholderTextColor="#888888"
              style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color: "white" }} />


            <Text style={styles.formTitle}>Accomplishments</Text>
            <View style={{ justifyContent: "flex-start", flexDirection: "column" }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                <Text style={{ color: "white" }}>1.</Text>
                <TextInput
                  value={medal1}
                  multiline
                  numberOfLines={2}
                  maxLength={50}
                  onChangeText={setMedal1}
                  placeholder={"I completed a marathon."}
                  placeholderTextColor="#888888"
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, margin: 10, color: "white" }} />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                <Text style={{ color: "white" }}>2.</Text>
                <TextInput
                  value={medal2}
                  multiline
                  numberOfLines={2}
                  maxLength={50}
                  onChangeText={setMedal2}
                  placeholder={"I won a hotdog eating contest"}
                  placeholderTextColor="#888888"
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, margin: 10, color: "white" }} />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                <Text style={{ color: "white" }}>3.</Text>
                <TextInput
                  value={medal3}
                  multiline
                  numberOfLines={2}
                  maxLength={50}
                  onChangeText={setMedal3}
                  placeholder={"I have a Youtube channel with 3k subscribers."}
                  placeholderTextColor="#888888"
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, margin: 10, color: "white" }} />
              </View>
            </View>


            <Text style={styles.formTitle}>{`Values (Pick 3)`}</Text>
            <ValuesList selectedValues={values} setSelectedValues={setValues} />

            <Text style={styles.formTitle}>Mission</Text>
            <TextInput
              value={mission}
              multiline
              numberOfLines={2}
              maxLength={40}
              onChangeText={setMission}
              placeholder={'Explore the local nightlife!'}
              placeholderTextColor="#888888"
              style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color: "white" }} />

            <Text style={styles.formTitle}>Mission Category</Text>
            <TagPicker tag={missiontag} setTag={setMissionTag} />

            <View style={{ height: 150 }}>
              <TouchableOpacity
                disabled={incompleteForm}
                style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteForm ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                onPress={updateUserProfile}>
                <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Update Profile</Text>
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
    // color: "#00308F",
    // color:"#00BFFF",
    color: "white",
    padding: 20
  }
})

export default EditProfileScreen;