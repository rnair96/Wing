import React, { useState } from 'react';
import { View, ScrollView, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/core';
import Header from '../Header';
import ImageUpload from '../components/ImageUpload';


const SetUp5Screen = () => {
  const [ bio, setBio ] = useState(null);
  const [ hometown, setHometown ] = useState(null);
  const [ url1, setUrl1] = useState(null);
  const [ url2, setUrl2] = useState(null);
  const [ url3, setUrl3] = useState(null);


  const navigation = useNavigation();
  const { params } = useRoute();
  const user = params; 

  const incompleteform = !url1||!url2||!url3||!bio;


  const updateUserProfile = () => {
      updateDoc(doc(db, global.users, user.id), {
          images: [url1, url2, url3],
          bio: bio,
          hometown: hometown,
          timestamp: serverTimestamp()
      }).then(()=> {
            navigation.navigate("Home")
            navigation.navigate("WelcomeScreen")
      }).catch((error) => {
          alert(error.message)
      });
  }

    
return (
  <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex:1, backgroundColor:"black"}}
            keyboardVerticalOffset={15}>
        <TouchableWithoutFeedback 
          // onPress={Keyboard.dismiss()}
        >
      <ScrollView style={{marginHorizontal:10}}>
        <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly"}}>
          <SafeAreaView>
            <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 5/5"}/>
          </SafeAreaView>
  
        <Text style={{fontSize:15, fontWeight: "bold", padding:20, color:"white"}}>Last Touches</Text>

        <Text style={styles.formTitle}>Choose 3 Presentable Pictures Of Yourself</Text>
        {/* <Text style={{fontSize:10, fontWeight: "bold", padding:5}}>Extra points, if they demonstrate your personality/interests!</Text> */}

        <View style ={{flexDirection:"row", padding:20}}>
            <ImageUpload url = {url1 } setURL = {setUrl1} index={0} user={user}/>
            <ImageUpload url = {url2 } setURL = {setUrl2} index={1} user={user}/>
            <ImageUpload url = {url3 } setURL = {setUrl3} index={2} user={user}/>
            </View> 

        <Text style={styles.formTitle}>Share Something Fun About yourself</Text>
      <TextInput
      value = {bio}
      multiline
      numberOfLines={4}
      maxLength={200}
      onChangeText = {setBio} 
      placeholder={'I.e: I love kayaking at a local river while drinking craft beer'}
      placeholderTextColor={"grey"}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15, color:"white"}}/>

      <Text style={styles.formTitle}>Add your Hometown {`(Optional)`}</Text>
      <TextInput
      value = {hometown}
      multiline
      numberOfLines={1}
      maxLength={50}
      onChangeText = {setHometown} 
      placeholder={'I.e: Washington, DC'}
      placeholderTextColor={"grey"}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15, color:"white"}}/>
    

        <View style={{height:150}}>
      <TouchableOpacity 
          disabled = {incompleteform}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updateUserProfile}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Complete Setup!</Text>
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
    color:"white", 
    padding:20
  }
})

export default SetUp5Screen;
