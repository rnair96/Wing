import React, { useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/core';
import Header from '../Header';
import { db } from '../firebase';
// import AgePicker from '../components/AgePicker';
// import GenderPicker from '../components/GenderPicker';
// import TagPicker from '../components/TagPicker';
import YNRadioButton from '../components/YNRadioButton';
import * as Sentry from "@sentry/react";




const MatchingPreferences = () => {
  // const [ ageMin, setAgeMin ] = useState(18);
  // const [ ageMax, setAgeMax ] = useState(100);
  const [activeStudent, setActiveStudent] = useState(false);
  const [wingUni, setWingUni] = useState(true)
  const [distance, setDistance] = useState("Global");
  const [group, setGroup] = useState(null);
  const [groupMatch, setGroupMatch] = useState(false);


  const { params } = useRoute();
  const profile = params;

  const navigation = useNavigation();


  useEffect(() => {


    if (profile && profile?.preferences) {
      // setAgeMax(profile.ageMax);
      // setAgeMin(profile.ageMin);
      // setGender(profile.genderPreference);

      if (profile?.university_student && profile.university_student.status === "active") {
        setActiveStudent(true);
        setWingUni(profile.preferences.university)
      }

      if (profile.preferences?.distance) {
        setDistance(profile.preferences.distance)
      }

      if (profile?.group && profile.preferences?.group) {
        setGroup(profile.group)
        setGroupMatch(profile.preferences.group)
      }
    }

  }, [profile])

  // const incompleteform = !tag//!ageMin||!ageMax||


  const updatePreferences = () => {
    let prefObj = {
      preferences: {
        distance: distance
      }
    }

    if (activeStudent) {
      prefObj.preferences.university = wingUni;
    }

    if (group) {
      prefObj.preferences.group = groupMatch;
    }

    updateDoc(doc(db, global.users, profile.id), prefObj).then(() => {
      //must trigger a refresh upon entering home screen
      navigation.navigate("Home", { refresh: true })
    }).catch((error) => {
      Sentry.captureMessage("error at updating preferences for ", profile.id, ", ", error.message)
      alert("Error trying to update preferences. Try again later.")
    });
  }


  return (
    <ScrollView style={{ backgroundColor: "white" }}>

      <SafeAreaView style={{ alignItems: "center" }}>
        {/* {profile?.genderPreference ? 
     ( */}
        <Header style={{ marginHorizontal: "10%", right: 10 }} title={"Matching Preferences"} />
        {/* ):(
      <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 4/4"}/>
     )} */}
      </SafeAreaView>
      <View style={{ height: "90%", width: "100%", alignItems: "center", justifyContent: "space-evenly" }}>

        <Text style={{ fontSize: 15, fontWeight: "bold", padding: 40 }}>Choose Your Wing Preferences</Text>

        {/* <Text style={{fontSize:15, fontWeight: "bold", color:"#00308F"}}>Select Age Range</Text>

      <View style ={{flexDirection:"row", alignItems:"center"}}>
        <View style ={{padding:10}}>
          <AgePicker age= {ageMin} setAge={setAgeMin} />
        </View>
      
        <Text>-</Text>

        <View style={{padding:10}}>
      
        <AgePicker age= {ageMax} setAge={setAgeMax} />
        </View>
      </View> */}


        {/* <View style={{alignItems:"center", paddingBottom:30}}>
        <Text style={{fontSize:15, top:40, fontWeight: "bold", color:"#00308F"}}>Gender</Text>
        <GenderPicker gender= {gender} setGender={setGender} both_boolean={true} />
      </View> */}

        {/* <View style={{ alignItems: "center", paddingBottom: 30 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", padding: 10 }}>Mission Category</Text>
          <TagPicker tag={tag} setTag={setTag} all_boolean={true} />
        </View> */}

        <View style={{ alignItems: "center", padding: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", paddingBottom: 20 }}>Distance</Text>
          <YNRadioButton selectedOption={distance} setSelectedOption={setDistance} />
        </View>


        {/* {activeStudent && (
          <View style={{ alignItems: "center", padding: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", padding: 5 }}>Only See Users In Wing-U?</Text>
            <Text style={{ fontSize: 12, padding: 20 }}>{`(Exclusively match with university students)`}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
              <Text style={{ marginRight: 10, fontWeight: "bold", fontSize: 15, }}>{wingUni ? "Yes" : "No"}</Text>
              <Switch
                trackColor={{ false: "red", true: "#00BFFF" }}
                thumbColor={wingUni ? "white" : "grey"}
                onValueChange={setWingUni}
                value={wingUni}
              />
            </View>
          </View>
        )} */}

        {group && (
          <View style={{ alignItems: "center", padding: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", padding: 5 }}>Priotize Users In {group}?</Text>
            <Text style={{ fontSize: 12, padding: 20 }}>{`(Puts your group ahead of other users)`}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
              <Text style={{ marginRight: 10, fontWeight: "bold", fontSize: 15, }}>{groupMatch ? "Yes" : "No"}</Text>
              <Switch
                trackColor={{ false: "red", true: "#00BFFF" }}
                thumbColor={groupMatch ? "white" : "grey"}
                onValueChange={groupMatch}
                value={groupMatch}
              />
            </View>
          </View>
        )}

        {/* {groupMatch && wingUni && (
          <Text style={{ fontSize: 12, padding: 20, color:"red" }}>May not see all users in your group while Wing-U is on. Consider switching it off for maximum reach.</Text>
        )} */}

        <View style={{ height: 150 }}>
          <TouchableOpacity
            // disabled={incompleteform} incompleteform ? "grey" :
            style={{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 5, backgroundColor: "#00308F" }}
            onPress={updatePreferences}>
            <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Update Preferences</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default MatchingPreferences
