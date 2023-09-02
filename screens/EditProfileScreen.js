import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, SafeAreaView, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import ImageUpload from '../components/ImageUpload';
import registerNotifications from '../lib/registerNotifications';
import { useNavigation } from '@react-navigation/core';
import TagPicker from '../components/TagPicker';
import ValuesList from '../components/ValuesList';
import ClassLevelPicker from '../components/ClassLevelPicker';
import UniversityPicker from '../components/UniversityPicker';
import GradYearPicker from '../components/GradYearPicker';



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
  const [class_level, setClassLevel] = useState(null);
  const [grad_year, setGradYear] = useState(null);

  const [incompleteForm, setIncompleteForm] = useState(true);
  const [url1, setUrl1] = useState(null);
  const [url2, setUrl2] = useState(null);
  const [url3, setUrl3] = useState(null);
  const [values, setValues] = useState([])

  const navigation = useNavigation();




  useEffect(() => {
    if (profile) {
      setUrl1(profile.images[0]);
      setUrl2(profile.images[1]);
      setUrl3(profile.images[2]);
      setAge(parseInt(profile.age));
      setMission(profile.mission);
      setGender(profile.gender);
      setMedal1(profile.medals[0]);
      setMedal2(profile.medals[1]);
      setMedal3(profile.medals[2]);
      setBio(profile.bio);
      setLocation(profile.location);
      setValues(profile.values)
      setMissionTag(profile.mission_tag);
      setOldToken(profile.token);
      setSchool(profile.school);
      setHometown(profile.hometown);
      if(profile.university_student && profile.university_student.status==="active"){
        setClassLevel(profile.university_student.class_level)
        setGradYear(profile.university_student.grad_year)
        setActiveStudent(true)
      } else {
        setJob(profile.job);
        setCompany(profile.company);
      }


    }

  }, [profile])



  useEffect(() => {

    let form;

    if (activeStudent){
      form = !url1 || !url2 || !url3 || !mission || !medal1 || !medal2 || !medal3 || !location || !bio || !values || !class_level ||!grad_year||!school
    } else {
      form = !url1 || !url2 || !url3 || !mission || !medal1 || !medal2 || !medal3 || !location || !bio || !values;

    }

    setIncompleteForm(form);

  }, [activeStudent, url1, url2, url3, mission, medal1, medal2, medal3, location, bio, values, class_level, grad_year, school])

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




  const updateUserProfile = () => {
    if(activeStudent){ // change to one call of update doc, with different docs sent
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
        alert(error.message)
      });
    } else{
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
        alert(error.message)
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

          <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", padding: 20 }}>Edit Your Profile</Text>



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
                  (<TextInput
                    value={location}
                    onChangeText={setLocation}
                    placeholder={'What area are you in? (City, State)'}
                    style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15 }} />)
                  : (
                    <Text>{location}</Text>
                  )}
              </View>

              <View style={{ padding: 10, alignItems: "center" }}>
                <Text style={styles.formTitle}>Hometown</Text>
                <TextInput
                  value={hometown}
                  onChangeText={setHometown}
                  placeholder={'Washington, DC'}
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15 }} />
              </View>
              </View>

              
              {activeStudent ?
                (
                  <View style={{ flexDirection: "column", padding: 10 }}>
                    <View style={{justifyContent:"center", alignItems:'center', flexDirection:"row"}}>
                      <View style={{width:"30%", backgroundColor:"#00BFFF", height:2}}/>
                    <Text style={{color:"#00BFFF", fontWeight:"800", fontSize:25}}>WING-U</Text>
                    <View style={{width:"30%", backgroundColor:"#00BFFF", height:2}}/>

                    </View>


                    <View style={{ padding: 20, alignItems: "center" }}>
                      <Text style={styles.formTitle}>Class Level</Text>
                        <ClassLevelPicker selectedLevel={class_level} setSelectedLevel={setClassLevel}/>
                    </View>

                    <View style={{ padding: 20, alignItems: "center" }}>
                      <Text style={styles.formTitle}>Graduation Year</Text>
                      <GradYearPicker selectedYear={parseInt(grad_year, 10)} setSelectedYear={setGradYear}/>
                    </View>

                    <View style={{ paddingBottom: 40, alignItems: "center" }}>
                      <Text style={styles.formTitle}>School Currently Attending</Text>
                      <UniversityPicker university_chosen={school} setUniversity={setSchool}/>
                    </View>
                    
                    <View style={{margin:20, padding:10, justifyContent:"center", alignItems:"center"}}>
                  <Text style={{fontSize:13, textAlign:"center", padding:10}} numberOfLines={2}>{`(To show Professional options in profile, go to Account in Settings.)`}</Text>
                  <View style={{width:"90%", backgroundColor:"#00BFFF", height:2}}/>
                  </View>

                  </View>
                ):(
              <View style={{ flexDirection: "column", padding: 10 }}>
              <View style={{ padding: 10, alignItems: "center" }}>
                <Text style={styles.formTitle}>Job</Text>
                <TextInput
                  value={job}
                  onChangeText={setJob}
                  placeholder={'What do you do?'}
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15 }} />
              </View>

            <View style={{ padding: 10, alignItems: "center" }}>
                <Text style={styles.formTitle}>Company</Text>
                <TextInput
                  value={company}
                  onChangeText={setCompany}
                  placeholder={'What do you do?'}
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15 }} />
              </View>

            <View style={{ padding: 10, alignItems: "center" }}>
                <Text style={styles.formTitle}>School Graduated From or Last Attended</Text>
                <TextInput
                  value={school}
                  onChangeText={setSchool}
                  placeholder={'What do you do?'}
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15 }} />
              </View>
            </View>
                )}


            <View style={{ flexDirection: "row", padding: 20 }}>
              <ImageUpload url={url1} setURL={setUrl1} index={0} user={user} />
              <ImageUpload url={url2} setURL={setUrl2} index={1} user={user} />
              <ImageUpload url={url3} setURL={setUrl3} index={2} user={user} />
            </View>

            <Text style={styles.formTitle}>Bio</Text>
            <TextInput
              value={bio}
              multiline
              numberOfLines={3}
              onChangeText={setBio}
              placeholder={'Share a bit about you i.e: Papa Johns is the key to my heart.'}
              style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15 }} />


            <Text style={styles.formTitle}>Accomplishments</Text>
            <View style={{ justifyContent: "flex-start", flexDirection: "column" }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                <Text>1.</Text>
                <TextInput
                  value={medal1}
                  multiline
                  numberOfLines={2}
                  onChangeText={setMedal1}
                  placeholder={"I completed a marathon."}
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, margin: 10 }} />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                <Text>2.</Text>
                <TextInput
                  value={medal2}
                  multiline
                  numberOfLines={2}
                  onChangeText={setMedal2}
                  placeholder={"I won a hotdog eating contest"}
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, margin: 10 }} />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                <Text>3.</Text>
                <TextInput
                  value={medal3}
                  multiline
                  numberOfLines={2}
                  onChangeText={setMedal3}
                  placeholder={"I have a Youtube channel with 3k subscribers."}
                  style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, margin: 10 }} />
              </View>
            </View>


            <Text style={styles.formTitle}>{`Values (Pick 3)`}</Text>
            <ValuesList selectedValues={values} setSelectedValues={setValues} />


            {/* <Text style={styles.formTitle}>The Ideal Wing</Text>
      <TextInput
      value = {idealwing}
      multiline
      numberOfLines={3}
      onChangeText = {setIdealWing}
      placeholder={'How can a Wing best support you? i.e: Push me in the gym'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/> */}

            <Text style={styles.formTitle}>Mission</Text>
            <TextInput
              value={mission}
              multiline
              numberOfLines={3}
              onChangeText={setMission}
              placeholder={'What goal do you want a Wing to assist you on? i.e Lose 10 pounds'}
              style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15 }} />

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
    color: "#00308F",
    padding: 20
  }
})

export default EditProfileScreen;
