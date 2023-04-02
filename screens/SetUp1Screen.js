import React, { useState } from 'react';
import { View, ScrollView, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import TagPicker from '../components/TagPicker';
import Header from '../Header';



const SetUp1Screen = () => {
  const { user } = useAuth();
  const [ mission, setMission ] = useState(null);
  const [ missiontag, setMissionTag ] = useState("Personal Growth");
  const [ idealwing, setIdealWing ] = useState(null);

  const navigation = useNavigation();

  const incompleteform = !mission||!idealwing;

  const updateUserProfile = () => {
      updateDoc(doc(db, 'users', user.uid), {
          mission: mission,
          ideal_wing: idealwing,
          mission_tag: missiontag,
      }).then(()=> {
            
            navigation.navigate("SetUp2", {id: user.uid})
      }).catch((error) => {
          alert(error.message)
      });
  }


  //Use Header
    
return (
  <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex:1}}
            keyboardVerticalOffset={15}>
        <TouchableWithoutFeedback 
          // onPress={Keyboard.dismiss()}
        >
      <ScrollView style={{marginHorizontal:10}}>
        <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
          <SafeAreaView>
          <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 2/3"}/>
          {/* <Text style={{fontSize:20, fontWeight: "bold", padding:20}}>Account Setup 2/4</Text> */}
          </SafeAreaView>

          <Text style={{fontSize:15, fontWeight: "bold", padding:20}}>The Mission</Text>
     

      <Text style={styles.formTitle}>Define Your Mission</Text>
      <TextInput
      value = {mission}
      multiline
      numberOfLines={3}
      onChangeText = {setMission} 
      placeholder={'I.e Lose 10 pounds'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

      <Text style={styles.formTitle}>Select The Category That Best Fits The Mission</Text>
      <TagPicker tag={missiontag} setTag={setMissionTag}/>
    

      <Text style={styles.formTitle}>How Can A Wing Best Support Your Mission?</Text>
      <TextInput
      value = {idealwing}
      multiline
      numberOfLines={4}
      onChangeText = {setIdealWing}
      placeholder={'I.e: Push me in the gym'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

        <View style={{height:300}}>
      <TouchableOpacity 
          disabled = {incompleteform}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updateUserProfile}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Next</Text>
      </TouchableOpacity>
      </View>
      </View>
      </ScrollView>
      </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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

export default SetUp1Screen;
