import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker';


const GenderPicker = ({gender, setGender, both_boolean}) => {
// create a 
    return (
      <View style={{height:200, backgroundColor:"white", borderRadius:10}}>
        {both_boolean ? (
          <Picker
          style={{width:150, height:150}}
          selectedValue={gender ? gender : "both"}
          onValueChange={setGender}
        >
          <Picker.Item label="Both" value="both" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
        ):(
          <Picker
        style={{width:150, height:150}}
        selectedValue={gender ? gender : "male"}
        onValueChange={setGender}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>
        )}
        
      </View>
    );
}

export default GenderPicker

