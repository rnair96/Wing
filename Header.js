import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const Header = ({title, style}) => {
    const navigator = useNavigation();

    return (
      <View style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, flexDirection:"row", justifyContent:"flex-start"}}>
        <TouchableOpacity onPress={() => navigator.goBack()} style={{padding: 2}}>
            <Ionicons name="chevron-back-outline" size={34} color="#00308F"/>
        </TouchableOpacity>
        {title.length < 10? (
          <Text style={{ padding:10, fontWeight:"bold", fontSize:20, color:"#00308F",  marginHorizontal:"28%", ...style}}> {title} </Text>
        ):(
          <Text style={{ padding:10, fontWeight:"bold", fontSize:20, color:"#00308F",  marginHorizontal:"23%", ...style}}> {title} </Text>
        )}
      </View>
    )
}

export default Header
