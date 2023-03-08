import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect} from 'react'
import {StyleSheet, ImageBackground, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native'
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
    <SafeAreaView style={[styles.container]}>
        <ImageBackground
        resizeMode='cover'
        style = {[styles.container]} 
        source={require("../images/pilots2.jpeg")}>
        <View style={{height:"30%", justifyContent:"center", alignItems:"center", justifyContent:"space-evenly"}}>
        <View style={{flexDirection:"row", justifyContent:"center"}}>
        <Text style={{fontWeight:"bold", fontSize:40, fontFamily:"Times New Roman", color:"#00308F"}}>Wing</Text>
        <Image style = {styles.iconcontainer} source={require("../images/logo2.jpg")}/>
        </View>
        <Text style={{fontWeight:"bold", fontSize:20, fontFamily:"Times New Roman", color:"#00308F"}}>Find Your Wingman. Go On Missions.</Text>
        </View>
        <View style={{marginVertical:"20%",alignItems: 'center', height:"20%", justifyContent:"space-evenly"}}>
        <TouchableOpacity style={styles.opacitycontainer} onPress={signInWithGoogle}>
            <Text style = {styles.textcontainer}>Sign In with Google</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.opacitycontainer} onPress={navigation.navigate("SignUp")}>
            <Text style = {styles.textcontainer}>Sign Up Manually</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.opacitycontainer}>
            <Text style = {styles.textcontainer}>Log In</Text>
        </TouchableOpacity> */}
        </View>
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
        padding: 5,
        borderRadius: 10,
        width:200,
        alignItems:"center"

        },
    textcontainer: {
        alignItems: 'center',
        fontWeight: 'bold',
    },
    iconcontainer: {
        height:40, 
        width:40, 
        borderRadius:50, 
        borderColor:"#00308F", 
        borderWidth:2
    }
});

export default LoginScreen
