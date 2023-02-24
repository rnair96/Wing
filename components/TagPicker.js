import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker';


const TagPicker = ({tag, setTag, all_boolean}) => {
// create a 
    return (
      <View>
         {all_boolean ? (
          <Picker
          style={{width:250, height:150, padding:10}}
          selectedValue={tag ? tag : "All"}
          onValueChange={setTag}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Career-Focused" value="Career-Focused" />
          <Picker.Item label="Personal Growth" value="Personal Growth" />
          <Picker.Item label="Make an Impact" value="Make an Impact" />
        </Picker>
        ):(
          <Picker
          style={{width:250, height:150}}
          selectedValue={tag ? tag : "Personal Growth"}
          onValueChange={setTag}
        >
          <Picker.Item label="Career-Focused" value="Career-Focused" />
          <Picker.Item label="Personal Growth" value="Personal Growth" />
          <Picker.Item label="Make an Impact" value="Make an Impact" />
        </Picker>
        )}
        
      </View>
    );
}

export default TagPicker

