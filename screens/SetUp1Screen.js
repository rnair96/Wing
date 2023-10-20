import React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';


const SetUp1Screen = () => {   

    const navigation = useNavigation();



    return (
        <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly", backgroundColor:"white"}}>
     
            <Text style={styles.formTitle}>Are you a college student?</Text>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("StudentSetup")}>
                <Text style={{color:"white"}}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("SetUp2")}>
                <Text style={{color:"white"}}>No</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    formTitle :{
      fontSize:17, 
      fontWeight: "bold", 
      padding:20
    },
    button :{
        padding:10,
        width:"50%", 
        height:50,
        backgroundColor:"#00308F",
        borderRadius:10,
        alignItems:"center",
        justifyContent:"center",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 2.41,
        elevation: 5

    }
  })

export default SetUp1Screen;
