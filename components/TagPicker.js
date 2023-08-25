import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker';


const TagPicker = ({tag, setTag, all_boolean}) => {
// create a 
    return (
      <View>
         {all_boolean ? (
          <Picker
          style={{width:450, height:150, padding:10}}
          selectedValue={tag ? tag : "All"}
          onValueChange={setTag}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Let's Have Fun (Social)" value="Social Outings & Adventures" />
          <Picker.Item label="Let's Train (Fitness)" value="Sports & Fitness" />
          <Picker.Item label="Let's Build Something (Passions)" value="Passions & Pursuits" />
        </Picker>
        ):(
          <Picker
          style={{width:450, height:150}}
          selectedValue={tag ? tag : "Social Outings & Adventures"}
          onValueChange={setTag}
        >
          <Picker.Item label="Let's Have Fun (Social)" value="Social Outings & Adventures" />
          <Picker.Item label="Let's Train (Fitness)" value="Sports & Fitness" />
          <Picker.Item label="Let's Build Something (Passions)" value="Passions & Pursuits" />
        </Picker>
        )}
        
      </View>
    );
}

export default TagPicker

