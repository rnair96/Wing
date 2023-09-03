import React, { useState } from 'react';
import { View, ScrollView, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import Header from '../Header';
import ValuesList from '../components/ValuesList';


const SetUp4Screen = () => {
  const [ medal1, setMedal1 ] = useState(null);
  const [ medal2, setMedal2 ] = useState(null);
  const [ medal3, setMedal3 ] = useState(null);
  const [ values, setValues ] = useState([]);



  const navigation = useNavigation();
  const { params } = useRoute();
  const user = params; 

  const incompleteform = !medal1||!medal2||!medal3||!values||values.length<3;


  const updateUserProfile = () => {
      updateDoc(doc(db, global.users, user.id), {
          medals: [medal1, medal2, medal3],
          values: values
      }).then(()=> {
            navigation.navigate("SetUp5", {id: user.id})
      }).catch((error) => {
          alert(error.message)
      });
  }

    
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
            <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 4/5"}/>
          </SafeAreaView>
  
        <Text style={{fontSize:15, fontWeight: "bold", padding:20}}>Nearly There...</Text>

        <Text style={styles.formTitle}>Time to Brag. Briefly List Accomplishments You Are Most Proud Of {`(50 characters max each)`}</Text>
      <View style={{justifyContent:"flex-start", flexDirection:"column"}}>
      <View style={{flexDirection:"row", alignItems:"center", marginTop:10, marginBottom:10}}>
      <Text>1.</Text>
      <TextInput
      value = {medal1}
      multiline
      numberOfLines={2}
      maxLength={50}
      onChangeText = {setMedal1} 
      placeholder={"I completed a marathon."}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15, margin:10}}/>
      </View>

      <View style={{flexDirection:"row", alignItems:"center", marginTop:10, marginBottom:10}}>
      <Text>2.</Text>
      <TextInput
      value = {medal2}
      multiline
      numberOfLines={2}
      maxLength={50}
      onChangeText = {setMedal2} 
      placeholder={"I won a hotdog eating contest"}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15, margin:10}}/>
      </View>

    <View style={{flexDirection:"row", alignItems:"center", marginTop:10, marginBottom:10}}>
    <Text>3.</Text>
    <TextInput
      value = {medal3}
      multiline
      numberOfLines={2}
      maxLength={50}
      onChangeText = {setMedal3} 
      placeholder={"I have a Youtube channel with 3k subscribers."}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15, margin:10}}/>
    </View>
    </View>


    <Text style={styles.formTitle}>Select Your 3 Top Values</Text>
    <ValuesList selectedValues={values} setSelectedValues={setValues} />

        <View style={{height:150}}>
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

export default SetUp4Screen;
