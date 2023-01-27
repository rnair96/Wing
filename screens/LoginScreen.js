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
        <Text style={{left:140, top:80, fontWeight:"bold", fontSize:40, fontFamily:"Times New Roman", color:"#00308F"}}>Wing</Text>
        <Text style={{left:85, top:100, fontWeight:"bold", fontSize:20, fontFamily:"Times New Roman", color:"#00308F"}}>Find Your Mission Partner</Text>
        <Image style = {styles.iconcontainer} source={require("../images/logo2.jpg")}/>
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
        marginTop: 400,
        width: 180,
        marginHorizontal: "30%",
        backgroundColor: "white",
        padding: 5,
        borderRadius: 10,
        alignItems: 'center'
    },
    textcontainer: {
        alignItems: 'center',
        fontWeight: 'bold',
    },
    iconcontainer: {
        height:40, 
        width:40, 
        left:235, 
        top:15, 
        borderRadius:50, 
        borderColor:"#00308F", 
        borderWidth:2
    }
});

export default LoginScreen
