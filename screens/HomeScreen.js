import React from 'react'
import { Button, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    console.log("HomeScreen user ", user);

    // const showUserData = () => {
    //     if (user) {
    //       return (
    //         <View style = {styles.userInfo}>
    //           <Image source={{ uri: user.picture }} style={styles.profilePic} />
    //           <Text> Welcome {userInfo.name}</Text>
    //           <Text>{user.email}</Text>
    //         </View>
    //       )
    //     }
      
    //   };

  return (
   <SafeAreaView>
    {/* Header */}
    <View>
        <TouchableOpacity>
            <Image style = {styles.imagecontainer} source={{ uri: user.picture }}/>
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
        alignItems: 'center',
       justifyContent: 'center'
    }
});

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: 'white',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     profilePic: {
//       width: 50,
//       height: 50
//     },
//     userInfo: {
//       alignItems: 'center'
//     }
  
//   })


export default HomeScreen
