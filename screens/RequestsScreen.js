import React from 'react'
import { SafeAreaView, View, Text } from 'react-native';
import RequestsList from './RequestsList';

const RequestsScreen = ({profile, requests}) => {

  return (
      <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
        <RequestsList profile = {profile} requests ={requests}/>
        </SafeAreaView>

  )
}

export default RequestsScreen
