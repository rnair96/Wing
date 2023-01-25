import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect} from 'react'
import {StyleSheet, ImageBackground, Text, View, TouchableOpacity, Image } from 'react-native'
import useAuth from '../hooks/useAuth';


const LoginScreen = () => {
    const { signInWithGoogle } = useAuth();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);


    return (
    <View style={[styles.container]}>
        <ImageBackground
        resizeMode='cover'
        style = {[styles.container]} 
        source={require("../images/pilots2.jpeg")}>
        {/* <Image source={require("../images/wing.png")}/> */}
        <Text style={{left:160, top:80, fontWeight:"bold", fontSize:40, fontFamily:"Times New Roman"}}>Wing</Text>
        <Text style={{left:85, top:100, fontWeight:"bold", fontSize:20}}>Find Your Mission Partner</Text>
        <TouchableOpacity style={styles.opacitycontainer} onPress={signInWithGoogle}>
            <Text style = {styles.textcontainer}>Sign in & Get Swiping</Text>
        </TouchableOpacity>
        </ImageBackground>
    </View>
    )
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
