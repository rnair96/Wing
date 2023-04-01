import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export const UnreadHighlighter= () => {
    return (
      <View 
      style={{position:"absolute",left:250}}
      >
        <MaterialCommunityIcons name="alert-circle" size={30} color="#00BFFF" />
      </View>
    )
}

export default UnreadHighlighter
