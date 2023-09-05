import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker';


const TagPicker = ({tag, setTag, all_boolean}) => {
// create a 
    return (
      <View style={{backgroundColor:"white", borderRadius:20, height:200}}>
         {all_boolean ? (
          <Picker
          style={{width:350, height:150, padding:10}}
          selectedValue={tag ? tag : "All"}
          onValueChange={setTag}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Let's Have Fun (Social)" value="Let's Have Fun" />
          <Picker.Item label="Let's Train (Fitness)" value="Let's Train" />
          <Picker.Item label="Let's Build Something (Passions)" value="Let's Build Something" />
        </Picker>
        ):(
          <Picker
          style={{width:350, height:150}}
          selectedValue={tag ? tag : "Let's Have Fun"}
          onValueChange={setTag}
        >
          <Picker.Item label="Let's Have Fun (Social)" value="Let's Have Fun" />
          <Picker.Item label="Let's Train (Fitness)" value="Let's Train" />
          <Picker.Item label="Let's Build Something (Passions)" value="Let's Build Something" />
        </Picker>
        )}
        
      </View>
    );
}

export default TagPicker

