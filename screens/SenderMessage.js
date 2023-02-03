import React, { Component } from 'react'
import { Text, View } from 'react-native'

const SenderMessage = ({ message }) => {
    return (
      <View style={{right:5, maxWidth:300, padding:10, marginLeft:"auto", alignSelf:"flex-start"}}>
        <View style={{backgroundColor:"#A9A9A9", borderTopRightRadius:20, borderBottomLeftRadius:20, borderTopLeftRadius:20}}>
          <Text style={{color:"white", padding:10, fontSize:20}}> {message.message} </Text>
        </View>
      </View>
    )
}

export default SenderMessage
