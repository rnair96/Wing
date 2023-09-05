import React, { Component, useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, TextInput, Modal, TouchableHighlight, ScrollView} from 'react-native';
import useAuth from '../hooks/useAuth';
import Header from '../Header';
import { useNavigation, useRoute } from '@react-navigation/core';
import { deleteDoc, doc, getDocs, collection, writeBatch, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { storage } from '../firebase';
import { deleteObject, ref, listAll} from "firebase/storage";



const SettingsScreen = () => {
    const navigation = useNavigation();

    const { params } = useRoute();
    const profile = params;


    return (
        // <ScrollView style={{backgroundColor:"black"}}>
        <View style={{backgroundColor:"black"}}>
        <SafeAreaView>
        <Header style={{fontSize:20, fontWeight: "bold"}} title={"Settings"}/>
        </SafeAreaView> 
        <View style={{height:"90%", width:"100%", alignItems:"center", justifyContent:"space-evenly"}}>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Account", profile)}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold", color:"white"}}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("PrivacyPolicy")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold", color:"white"}}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Terms")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold", color:"white"}}>Terms of Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Guidelines")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold", color:"white"}}>Community Guidelines</Text>
        </TouchableOpacity>

            </View>

          </View>
        //   </ScrollView>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      height: 50,
      margin: 10,
      borderWidth: 1,
    //   borderColor: '#ccc'
      backgroundColor:"#00308F"
    },
    iconcontainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        borderColor:"#00BFFF",
        borderWidth: 2
    },
    centeredView: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
      },
      textStyle: {
          color: 'black',
          fontWeight: 'bold',
          textAlign: 'center'
        }
    });

export default SettingsScreen;