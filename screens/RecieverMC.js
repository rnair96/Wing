import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'

const RecieverMC = ({ message })  => {
    return (
    <View style={{ padding:5, maxWidth: 250, marginRight:"auto", alignSelf:"flex-start", flexDirection:"row"}}>
        <Image
            style = {{height: 50, width: 50, borderRadius:50}}
            source = {require("../images/control_room.jpeg")}
        />
        <View style={{left:5, backgroundColor:"#00308F", borderBottomLeftRadius:20, borderBottomRightRadius:20, borderTopRightRadius:20}}>
            <Text style={{color:"white", paddingTop:10, paddingHorizontal:10, fontSize:20, fontWeight:'bold'}}>Mission Control to Wing: </Text>
            <Text style={{color:"white", padding:10, fontSize:20}}>{message} </Text>
        </View>
    </View>
    )
}

export default RecieverMC