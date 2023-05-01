import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback
} from 'react-native';
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const { resetPassword } = useAuth();
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (email) {
      resetPassword(email);
    } else {
      alert('Please enter your email address.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{height:"60%"}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style ={{height:"40%", justifyContent:"space-evenly", alignItems:"center"}}>
        <Text style={styles.title}>Reset Password</Text>
        <Text>Please enter your email address:</Text>
        </View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{height:"40%"}}
            keyboardVerticalOffset={10}>
        <View style={{height:"100%", justifyContent:"space-evenly", alignItems:"center"}}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="example@example.com"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send Reset Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Return to Login</Text>
        </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width:"60%"
  },
  button: {
    backgroundColor: '#00308F',
    padding: 15,
    borderRadius: 5,
    width:"60%"
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
