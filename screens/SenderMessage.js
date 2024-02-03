import React, { Component, useEffect, useState } from 'react'
import { Text, View, Image, TouchableOpacity, Linking } from 'react-native'
import getTime from '../lib/getTime'
import ImageExpanded from '../components/ImageExpanded';

const SenderMessage = ({ message }) => {
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [isExpandedImageVisible, setIsExpandedImageVisible] = useState(false);

  useEffect(() => {

    if (message && message?.timestamp) {
      let milliseconds = message.timestamp.seconds * 1000 + Math.floor(message.timestamp.nanoseconds / 1000000);
      setTime(getTime(new Date(milliseconds)));
      setLoading(false);
    }

  }, [message])

  const handleURL = (url) => {
    Linking.openURL(url)
      .then(() => {
        // Successfully opened URL. You can add any additional logic here if needed.
        console.log("url works!")
      })
      .catch(e => {
        console.log("error opening url", e);
        alert("URL not working, cannot open.");
      });
  }

  return (
    !loading && (
      <View style={{ right: 5, maxWidth: 300, padding: 10, marginLeft: "auto", alignSelf: "flex-start" }}>
        <View style={{ alignItems: "center" }}>
          {message?.status && message.status === "blocked" ? (
            <View style={{ left: 10, borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: "grey" }}>
              <Text style={{ color: "grey", padding: 10, fontSize: 13 }}> Message Removed By Moderator </Text>
            </View>
          ) : (
            <View style={{ backgroundColor: "#A9A9A9", borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderTopLeftRadius: 20 }}>
              {message?.tagType && message.tagType === 'reply' && message.taggedName && (
                <Text style={{ color: "white", padding: 10, fontSize: 20, fontWeight: "bold" }}>Replied to {message.taggedName}:</Text>
              )}
              {message?.tagType && message.tagType === 'tag' && message.taggedName && (
                <Text style={{ color: "white", padding: 10, fontSize: 20, fontWeight: "bold" }}>Tagged {message.taggedName}:</Text>
              )}
              {message?.title && (
                <Text style={{ color: "white", padding: 10, fontSize: 20, fontWeight: "bold", textDecorationLine: "underline" }}>Announcement:</Text>
              )}
              {((message?.type === undefined) || (message?.type && message.type === "text")) &&
                <Text style={{ color: "white", padding: 10, fontSize: 20 }}> {message.message} </Text>
              }
              {message?.type && message.type === "image" &&
                <TouchableOpacity onPress={() => setIsExpandedImageVisible(!isExpandedImageVisible)}>
                  <Image source={{ uri: message.message }} style={{ width: 200, height: 200, borderRadius: 5, margin: 10 }} />
                </TouchableOpacity>

              }
              {message?.type && message.type === 'link' && (
                <TouchableOpacity onPress={() => handleURL(message.message)}>
                  <Text style={{ color: 'blue', padding: 10, fontSize: 20, textDecorationLine: "underline" }}>{message.message}</Text>
                </TouchableOpacity>
              )}
              {/* {message?.type && message.type === 'reply' && (
                <View style={{ alignItems: "center" }}>
                  <View style={{ padding:5, color:"black"}}>
                  <Text style={{ color: "white", padding: 10, fontSize: 20, fontWeight:"bold" }}>Replied to {message.taggedName}</Text>
                  </View>
                  <Text style={{ color: "white", padding: 10, fontSize: 20 }}>{message.message}</Text>
                </View>
              )} */}
            </View>
          )}
          <Text style={{ fontSize: 12, color: "grey" }}>{time}</Text>
        </View>
        <ImageExpanded isVisible={isExpandedImageVisible} setIsVisible={setIsExpandedImageVisible} image={message.message} />
      </View>
    )
  )
}

export default SenderMessage
