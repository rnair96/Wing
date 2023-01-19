import { useNavigation } from '@react-navigation/native';
import React, { Component, useLayoutEffect } from 'react'
import { Button, StyleSheet, ImageBackground, Text, View } from 'react-native'
// import tw from 'tailwind-rn/dist';
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
    const { user } = useAuth();
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
        source={{ uri: "https://tinder.com/static/tinder.png"}}>
            <Text>Sign in & Get Swiping</Text>
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
      flex: 1    
    },
  });

export default LoginScreen
