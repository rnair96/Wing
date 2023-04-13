import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react'
import {StyleSheet, ImageBackground, Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import useAuth from '../hooks/useAuth';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();


const LoginScreen = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const { signInWithGoogle, logInManually } = useAuth();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    return (
    <SafeAreaView style={[styles.container]}>
        <ImageBackground
        resizeMode='cover'
        style = {[styles.container]} 
        source={require("../images/pilots2.jpeg")}>
        <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        >
        <View style={{height:"30%", justifyContent:"center", alignItems:"center", justifyContent:"space-evenly"}}>
        <View style={{flexDirection:"row", justifyContent:"center"}}>
        <Text style={{fontWeight:"bold", fontSize:40, fontFamily:"Times New Roman", color:"#00308F"}}>Wing</Text>
        <Image style = {styles.iconcontainer} source={require("../images/logo.png")}/>
        </View>
        <Text style={{fontWeight:"bold", fontSize:20, fontFamily:"Times New Roman", color:"#00308F"}}>Find Your Wingman. Go On Missions.</Text>
        </View>
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{height:"50%"}}
            keyboardVerticalOffset={5}
            > 
        <View style={{marginVertical:"10%", marginHorizontal:"20%", alignItems: 'center', height:"100%", justifyContent:"space-evenly", backgroundColor:"#00308F", opacity:0.8, borderRadius:20}}>
        <Text style={{fontWeight:"bold", fontSize:20, fontFamily:"Times New Roman", color:"white"}}>Email</Text>
        <TextInput
        value = {email}
        onChangeText = {setEmail}
        placeholder={'example@example.com'}
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15, backgroundColor:"white"}}/>
        <Text style={{fontWeight:"bold", fontSize:20, fontFamily:"Times New Roman", color:"white"}}>Password</Text>
        <TextInput
        value = {password}
        onChangeText = {setPassword}
        type='password'
        placeholder={'*************'}
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15, backgroundColor:"white"}}/>
        <TouchableOpacity style={styles.opacitycontainer} onPress={()=>logInManually(email, password)}>
            <Text style = {styles.textcontainer}>Log In</Text>
        </TouchableOpacity>
        {/* </KeyboardAvoidingView> */}
        <Text style={{fontWeight:"bold", fontSize:15, fontFamily:"Times New Roman", color:"white"}}>Or</Text>
        <TouchableOpacity style={styles.opacitycontainer} onPress={()=>navigation.navigate("SignUp")}>
            <Text style = {styles.textcontainer}>Create New Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.opacitycontainer} onPress={signInWithGoogle}>
            <View style={{flexDirection:"row"}}>
            <Image style={{height:20,width:20, right:10}} source={require("../images/google_icon.png")}/>
            <Text style = {styles.textcontainer}>Sign In With Google</Text>
            </View>
        </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
        </ImageBackground>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { 
      flex: 1,
    },
    opacitycontainer: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        width:200,
        alignItems:"center"

        },
    textcontainer: {
        alignItems: 'center',
        fontWeight: 'bold',
    },
    iconcontainer: {
        left:5,
        height:40, 
        width:40,
        backgroundColor:"#00BFFF", 
        borderRadius:50, 
        borderColor:"#00308F", 
        borderWidth:1
    }
});

export default LoginScreen
