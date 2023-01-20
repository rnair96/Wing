import { useNavigation } from '@react-navigation/native';
import React, { Component, useLayoutEffect } from 'react'
import { Button, StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native'
// import tw from 'tailwind-rn/dist';
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
    const { user, raj } = useAuth();
    const navigation = useNavigation();
    const loading = false;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    console.log(user);

    return (
    <View style={[styles.container]}>
        <ImageBackground
        resizeMode='cover'
        style = {[styles.container]} 
        source={{ uri: "https://tinder.com/static/tinder.png"}}>
        <TouchableOpacity style={styles.opacitycontainer} onPress={raj}>
            {/*add onPress = {signInWithGoogle}*/}
            <Text style = {styles.textcontainer}>Sign in & Get Swiping</Text>
        </TouchableOpacity>
        </ImageBackground>
    </View>
    )

    // this is the view for basic authentication
    // return (
    //   <View>
    //     <Text> {loading ? "loading ..." : "Login to the app" }</Text>
    //     <Button title='login' onPress = {signInWithGoogle}/>
    //   </View>
    // )

}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
    },
    opacitycontainer: {
        marginTop: 500,
        width: 180,
        marginHorizontal: "25%",
        backgroundColor: "white",
        padding: 5,
        borderRadius: 10,
        alignItems: 'center'
    },
    textcontainer: {
        alignItems: 'center',
        fontWeight: 'bold',
    }
});

export default LoginScreen
