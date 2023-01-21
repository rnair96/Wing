import React from 'react'
import { Button, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    console.log("HomeScreen user ", user);


  return (
   <SafeAreaView>
    {/* Header */}
    <View>
        <TouchableOpacity>
            <Image style = {styles.imagecontainer} source={{ uri: user.photoURL }}/>
        </TouchableOpacity>
    </View>
    {/* End of Header */}
    <Text>I am the Homescreen</Text> 
    <Button title="Go to Chat Screen" onPress={() => navigation.navigate("Chat")}/>
    <Button title= "Logout" onPress= {logout}/>
   </SafeAreaView>
  )
}

const styles = StyleSheet.create({
   imagecontainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        left: 10,
        top: 5,
    }
});


export default HomeScreen
