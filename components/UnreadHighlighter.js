import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export const UnreadHighlighter= () => {
    return (
      <View 
      style={{left:10, bottom:8}}
      >
        <MaterialCommunityIcons name="alert-circle" size={25} color="#00BFFF" />
      </View>
    )
}

export default UnreadHighlighter
