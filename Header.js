import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const Header = ({title, style}) => {
    const navigator = useNavigation();

    return (
      <View style={{flexDirection:"row", justifyContent:"flex-start"}}>
        <TouchableOpacity onPress={() => navigator.goBack()} style={{padding: 2}}>
            <Ionicons name="chevron-back-outline" size={34} color="#00BFFF"/>
        </TouchableOpacity>
        {title.length < 10? (
          <Text style={{ padding:10, fontWeight:"bold", fontSize:20, color:"#00BFFF",  marginHorizontal:"27%", ...style}}> {title} </Text>
        ):(
          <Text style={{ padding:10, fontWeight:"bold", fontSize:20, color:"#00BFFF",  marginHorizontal:"20%", ...style}}> {title} </Text>
        )}
      </View>
    )
}

export default Header
