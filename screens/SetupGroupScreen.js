import React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';


const SetUpGroupScreen = () => {   

    const navigation = useNavigation();



    return (
        <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly", backgroundColor:"white"}}>
            <View tyle={{alignItems:"center", justifyContent:"center"}}>
            <Text style={styles.formTitle}>Are you joining Wing as part of a Group?</Text>
            <Text>If so, you should have a group code.</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Groups")}>
                <Text style={{color:"white"}}>Yes, I have a code.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("SetUp3")}>
                <Text style={{color:"white"}}>No</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    formTitle :{
      fontSize:17, 
      fontWeight: "bold", 
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

export default SetUpGroupScreen;
