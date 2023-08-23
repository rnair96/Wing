import React, { useState } from 'react';
import { View, ScrollView, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import Header from '../Header';
import ImageUpload from '../components/ImageUpload';


const SetUp2Screen = () => {
  const [ medals, setMedals ] = useState(null);
  const [ bio, setBio ] = useState(null);
  const [ url1, setUrl1] = useState(null);
  const [ url2, setUrl2] = useState(null);
  const [ url3, setUrl3] = useState(null);


  const navigation = useNavigation();
  const { params } = useRoute();
  const user = params; 

  const incompleteform = !url1||!url2||!url3||!medals;


  const updateUserProfile = () => {
      updateDoc(doc(db, global.users, user.id), {
          images: [url1, url2, url3],
          medals: medals,
          bio: bio,
          timestamp: serverTimestamp()
      }).then(()=> {
            navigation.navigate("Preferences", {id: user.id})
            // navigation.navigate("Home")
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
            <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 3/4"}/>
          </SafeAreaView>
  
        <Text style={{fontSize:15, fontWeight: "bold", padding:20}}>Last Touches</Text>

        <Text style={styles.formTitle}>Choose 3 Presentable Pictures Of Yourself</Text>
        {/* <Text style={{fontSize:10, fontWeight: "bold", padding:5}}>Extra points, if they demonstrate your personality/interests!</Text> */}

        <View style ={{flexDirection:"row", padding:20}}>
            <ImageUpload url = {url1 } setURL = {setUrl1} index={0} user={user}/>
            <ImageUpload url = {url2 } setURL = {setUrl2} index={1} user={user}/>
            <ImageUpload url = {url3 } setURL = {setUrl3} index={2} user={user}/>
            </View> 
      
      {/* <Text style={{fontSize:13, fontWeight: "bold", padding:10}}>Your following answers will help Wings feel excited to work with you! Keep each answer 3 lines or less. {'(Don\'t worry, you can edit this later.)'}</Text> */}

      <Text style={styles.formTitle}>Bragging Time. What Makes You Stand Out?</Text>
      <TextInput
      value = {medals}
      multiline
      numberOfLines={3}
      onChangeText = {setMedals} 
      placeholder={'i.e: I never quit. I finished a marathon with a broken foot.'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

        <Text style={styles.formTitle}>Share something fun about yourself</Text>
      <TextInput
      value = {bio}
      multiline
      numberOfLines={3}
      onChangeText = {setBio} 
      placeholder={'I.e: I love kayaking at a local river while drinking craft beer'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
    

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

export default SetUp2Screen;
