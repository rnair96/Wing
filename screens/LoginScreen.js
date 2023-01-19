import React, { Component } from 'react'
import { Text, View } from 'react-native'
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
    const { user } = useAuth();

    console.log(user);

    return (
      <View>
        <Text> Login to the app </Text>
      </View>
    )

}

export default LoginScreen
