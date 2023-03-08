import React, { Component, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/core';
import { v4 as uuidv4 } from 'uuid';


const SignUpScreen = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmpassword, setConfirmPassword] = useState(null);
  const [incompleteForm, setIncompleteForm] = useState(true)

  const navigation = useNavigation();


  useEffect(()=>{
    const form = !name||!email||!password||!confirmpassword||password===confirmpassword
    setIncompleteForm(form);

  },[name, email, password, confirmpassword])


  const createUser = () => {
    const uid = uuidv4();
    const user = {"displayName": name, "email": email, "uid": uid, "password": password}
    navigation.navigate("SetUp1", {user})
  }


    return (
      <View>
        <Text> Sign Up </Text>
        <Text> First and Last Name </Text>
        <TextInput
        value = {name}
        onChangeText = {setName}
        placeholder={'John Doe'}
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
        <Text> Email </Text>
        <TextInput
        value = {email}
        onChangeText = {setEmail}
        placeholder={'example@example.com'}
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
        <Text> Password </Text>
        <TextInput
        value = {password}
        onChangeText = {setPassword}
        type='password'
        placeholder={'******'}
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
        <Text> Confirm Password </Text>
        <TextInput
        value = {confirmpassword}
        onChangeText = {setConfirmPassword}
        type='password'
        placeholder={'******'}
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>

        <TouchableOpacity 
          disabled = {incompleteForm}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteForm ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {createUser}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Create Account</Text>
      </TouchableOpacity>

      </View>
    )
}

export default SignUpScreen
