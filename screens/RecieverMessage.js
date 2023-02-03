import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'

const RecieverMessage = ({ message })  => {
    return (
    <View style={{ padding:5, maxWidth: 250, marginRight:"auto", alignSelf:"flex-start", flexDirection:"row"}}>
        <Image
            style = {{height: 50, width: 50, borderRadius:50}}
            source = {{uri: message.photoURL}}
        />
        <View style={{left:5, backgroundColor:"#00BFFF", borderBottomLeftRadius:20, borderBottomRightRadius:20, borderTopRightRadius:20}}>
            <Text style={{color:"white", padding:10, fontSize:20}}> {message.message} </Text>
        </View>
    </View>
    )
}

export default RecieverMessage
