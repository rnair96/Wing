import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'

const RecieverMessage = ({ message })  => {
    return (
    <View style={{ padding:5, marginRight:"auto", alignSelf:"flex-start", flexDirection:"row"}}>
        <Image
            style = {{height: 50, width: 50, borderRadius:50}}
            source = {{uri: message.photoURL}}
        />
        <Text style={{left:10,backgroundColor:"#00BFFF", color:"white", padding:10, fontSize:20, borderRadius:20}}> {message.message} </Text>
    </View>
    )
}

export default RecieverMessage
