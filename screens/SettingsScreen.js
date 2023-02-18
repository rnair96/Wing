import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native';
import useAuth from '../hooks/useAuth';
import Header from '../Header';
import { useNavigation } from '@react-navigation/core';



const SettingsScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation();


    return (
        <SafeAreaView>
        <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Settings"}/>
        <View style={{height:"90%", width:"100%", alignItems:"center", justifyContent:"space-evenly"}}>

        
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Menu")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Push Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Menu")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Menu")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Terms of Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Menu")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Community Guidelines</Text>
        </TouchableOpacity>

          <TouchableOpacity 
              style={[{width:200, height:50, padding:15, borderRadius:10}, {backgroundColor:"#00308F"}]}
              onPress = {logout}>
              <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity 
              style={[{width:200, height:50, padding:15, borderRadius:10}, {backgroundColor:"red"}]}
              onPress = {logout}>
              <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Delete Account</Text>
          </TouchableOpacity>

            </View>
          </SafeAreaView>
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
      borderColor: '#ccc'
    },
    iconcontainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        borderColor:"#00BFFF",
        borderWidth: 2
    }
    });

export default SettingsScreen
