import React from 'react';
import { FlatList, Text, View } from 'react-native';
import RequestRow from './RequestRow'


const RequestsList = ({profile, requests}) => {


    return requests && requests.length > 0 ? (
      <FlatList
      data = {requests}
      keyExtractor = {item => item.id}
      renderItem = {({item}) => <RequestRow requestDetails = {item} profile={profile}/>
    }/>
    ):
    (
      <View style ={{flexDirection:"row", marginVertical:"60%", justifyContent:"center"}}>
        <Text style={{fontWeight:"bold"}}> No Requests At This Time </Text>
      </View>
    )
    
}

export default RequestsList
