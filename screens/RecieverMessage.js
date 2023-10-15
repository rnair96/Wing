import React, { Component, useEffect, useState } from 'react'
import { Text, View, Image } from 'react-native'
import getTime from '../lib/getTime';

const RecieverMessage = ({ message }) => {
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (message && message?.timestamp && message.timestamp.seconds && message.timestamp.nanoseconds) {
      let milliseconds = message.timestamp.seconds * 1000 + Math.floor(message.timestamp.nanoseconds / 1000000);
      setTime(getTime(new Date(milliseconds)));
    }
    setLoading(false);

  }, [message])


  return (
    !loading && (
      <View style={{alignItems: "center"}}>
        <View style={{ left: 5, backgroundColor: "#00BFFF", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopRightRadius: 20 }}>
          <Text style={{ color: "white", padding: 10, fontSize: 20 }}> {message.message} </Text>
        </View>
        <Text style={{ fontSize: 12, color: "grey" }}>{time}</Text>
      </View>
    )

  )
}

export default RecieverMessage
