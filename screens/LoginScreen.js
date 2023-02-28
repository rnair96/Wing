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
        <TouchableOpacity style={styles.opacitycontainer} onPress={signInWithGoogle}>
            <Text style = {styles.textcontainer}>Sign in</Text>
        </TouchableOpacity>
        </ImageBackground>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { 
      flex: 1,
    },
    opacitycontainer: {
        marginHorizontal: "30%",
        marginVertical:"40%",
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
        borderRadius:50, 
        borderColor:"#00308F", 
        borderWidth:2
    }
});

export default LoginScreen
