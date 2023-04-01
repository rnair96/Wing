import React, { Component, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import getTime from '../lib/getTime'

const SenderMessage = ({ message }) => {
  const [time, setTime ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    
    if(message && message?.timestamp){
      let milliseconds = message.timestamp.seconds * 1000 + Math.floor(message.timestamp.nanoseconds / 1000000);
      setTime(getTime(new Date(milliseconds)));
      setLoading(false);
    }
    
  },[message])
  
    return (
      !loading && (
        <View style={{right:5, maxWidth:300, padding:10, marginLeft:"auto", alignSelf:"flex-start"}}>
        <View style={{alignItems:"center"}}>
        <View style={{backgroundColor:"#A9A9A9", borderTopRightRadius:20, borderBottomLeftRadius:20, borderTopLeftRadius:20}}>
          <Text style={{color:"white", padding:10, fontSize:20}}> {message.message} </Text>
        </View>
        <Text style={{fontSize:15, color:"grey"}}>{time}</Text>
        </View>
      </View>
      )
    )
}

export default SenderMessage
