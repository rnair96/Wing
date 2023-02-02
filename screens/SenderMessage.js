import React, { Component } from 'react'
import { Text, View } from 'react-native'

const SenderMessage = ({ message }) => {
    return (
      <View style={{right:10, padding:5, marginLeft:"auto", alignSelf:"flex-start"}}>
        <Text style={{backgroundColor:"#A9A9A9", color:"white", padding:10, fontSize:20, borderRadius:20}}> {message.message} </Text>
      </View>
    )
}

export default SenderMessage
