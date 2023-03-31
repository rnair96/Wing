import React, { Component } from 'react'
import { Text, View } from 'react-native'
import getTime from '../lib/getTime'

const SenderMessage = ({ message }) => {
  let milliseconds = message.timestamp.seconds * 1000 + Math.floor(message.timestamp.nanoseconds / 1000000);
  const time = getTime(new Date(milliseconds))
    return (
      <View style={{right:5, maxWidth:300, padding:10, marginLeft:"auto", alignSelf:"flex-start"}}>
        <View style={{alignItems:"center"}}>
        <View style={{backgroundColor:"#A9A9A9", borderTopRightRadius:20, borderBottomLeftRadius:20, borderTopLeftRadius:20}}>
          <Text style={{color:"white", padding:10, fontSize:20}}> {message.message} </Text>
        </View>
        <Text style={{fontSize:15, color:"grey"}}>{time}</Text>
        </View>
      </View>
    )
}

export default SenderMessage
