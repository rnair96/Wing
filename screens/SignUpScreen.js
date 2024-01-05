import React, { Component, useState, useEffect } from 'react'
import { Text, TextInput, View, TouchableOpacity, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import useAuth from '../hooks/useAuth';
import Header from '../Header';



const SignUpScreen = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmpassword, setConfirmPassword] = useState(null);
  const [incompleteForm, setIncompleteForm] = useState(true);
  const { signUpManually } = useAuth();


  useEffect(() => {
    const form = !name || !email || !password || !confirmpassword || password !== confirmpassword
    setIncompleteForm(form);

  }, [name, email, password, confirmpassword])


  const createUser = () => {
    signUpManually(email, password, name);
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
      keyboardVerticalOffset={10}>
      <TouchableWithoutFeedback
      // onPress={Keyboard.dismiss}
      >
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>
          <View style={{ alignItems: "center" }}>
            <Header style={{right:"35%"}} title={"Sign Up"} />
            {/* <Text style={{fontSize:20, fontWeight: "bold", padding:20, color:"#00BFFF"}}> Sign Up </Text> */}
            <Text style={styles.formTitle}> First and Last Name </Text>
          </View>
          <TextInput
            value={name}
            onChangeText={setName}
            maxLength={50}
            placeholder={'John Doe'}
            placeholderTextColor={"grey"}
            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor:"#E0E0E0" }} />
          <Text style={styles.formTitle}> Email </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={'example@example.com'}
            placeholderTextColor={"grey"}
            maxLength={50}
            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor:"#E0E0E0" }} />
          <Text style={styles.formTitle}> Password </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={"grey"}
            secureTextEntry={true}
            placeholder={'*************'}
            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor:"#E0E0E0" }} />
          <Text style={styles.formTitle}> Confirm Password </Text>
          <TextInput
            value={confirmpassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor={"grey"}
            secureTextEntry={true}
            placeholder={'*************'}
            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor:"#E0E0E0" }} />

          {password && confirmpassword &&
          <View style={{flexDirection:"row", padding:10}}>
          <Text style={{color:"grey"}}> Do passwords match?... </Text>
          <Text style={{fontSize:15, color:password===confirmpassword? "green": "red"}}>{password===confirmpassword? `Yes`:`No`}</Text>
          </View>}


          <TouchableOpacity
            disabled={incompleteForm}
            style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteForm ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
            onPress={createUser}>
            <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Create Account</Text>
          </TouchableOpacity>

        </SafeAreaView>
      </TouchableWithoutFeedback>

    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  formTitle: {
    fontSize: 15,
    fontWeight: "bold",
    padding: 20
  }
})

export default SignUpScreen
