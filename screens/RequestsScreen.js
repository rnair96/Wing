import React from 'react'
import { SafeAreaView, View, Text } from 'react-native';
import ChatList from './ChatList';
import RequestsList from './RequestsList';
import Header from '../Header';

const RequestsScreen = () => {

  return (
    // <View style={{flex:1, backgroundColor:"black"}}>
      <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
        {/* <View style={{alignItems:'center', justifyContent:"center", width:"100%"}}> */}
        {/* <Text style={{color:"#00BFFF", padding:10, fontWeight:"bold", fontSize:20}}>Requests</Text> */}

        {/* </View> */}
        


        <RequestsList/>
        </SafeAreaView>
    // </View>

  )
}

export default RequestsScreen
