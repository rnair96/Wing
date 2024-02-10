import React, { Component, useEffect, useState } from 'react'
import { Text, View, Image, Linking, TouchableOpacity } from 'react-native'
import getTime from '../lib/getTime';
import ImageExpanded from '../components/ImageExpanded';

const RecieverMessage = ({ message }) => {
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [isExpandedImageVisible, setIsExpandedImageVisible] = useState(false);

  useEffect(() => {

    if (message && message?.timestamp && message.timestamp.seconds && message.timestamp.nanoseconds) {
      let milliseconds = message.timestamp.seconds * 1000 + Math.floor(message.timestamp.nanoseconds / 1000000);
      setTime(getTime(new Date(milliseconds)));
    }
    setLoading(false);

  }, [message]);

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
      <View style={{ alignItems: "center" }}>
        {message?.status && message.status === "blocked" ? (
          <View style={{ left: 10, borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: "grey" }}>
            <Text style={{ color: "grey", padding: 10, fontSize: 13 }}> Message Removed By Moderator </Text>
          </View>
        ) : (
          <View style={{ left: 5, backgroundColor: "#00BFFF", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopRightRadius: 20 }}>
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
            {message?.type && message.type === "image" && message?.message &&
              <TouchableOpacity onPress={() => setIsExpandedImageVisible(!isExpandedImageVisible)}>
                <Image source={{ uri: message.message }} style={{ width: 200, height: 200, borderRadius: 5, margin: 10 }} />
              </TouchableOpacity>
            }
            {message?.type && message.type === 'link' && (
              <TouchableOpacity onPress={() => handleURL(message.message)}>
                <Text style={{ color: 'blue', padding: 10, fontSize: 20, textDecorationLine: "underline" }}>{message.message}</Text>
              </TouchableOpacity>
            )}

          </View>
        )}

        <Text style={{ fontSize: 12, color: "grey" }}>{time}</Text>
        <ImageExpanded isVisible={isExpandedImageVisible} setIsVisible={setIsExpandedImageVisible} image={message.message} />
      </View>
    )

  )
}

export default RecieverMessage
