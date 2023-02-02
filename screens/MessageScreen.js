import { useRoute } from '@react-navigation/native'
import React, { Component } from 'react'
import { Text, SafeAreaView, View } from 'react-native';
import Header from '../Header';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';

const MessageScreen = () => {

    const { params } = useRoute();
    const { matchedDetails } = params;
    const user = useAuth();

    console.log("matchedDetails in Messages----", matchedDetails.users);
    console.log("user in messages----", user);


    //debug header to pull name of match
    return (
      <SafeAreaView>
        {/* <Header title={getMatchedUserInfo(matchedDetails.users, user.uid)}/> */}
        <Text> MessageScreen </Text>
      </SafeAreaView>
    )
}

export default MessageScreen
