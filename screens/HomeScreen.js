import React from 'react'
import { Button, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/core';

const HomeScreen = () => {
    const navigation = useNavigation();

  return (
   <View>
    <Text>I am the Homescreen</Text> 
    <Button title="Go to Chat Screen" onPress={() => navigation.navigate("Chat")}/>
   </View>
  )
}

export default HomeScreen
