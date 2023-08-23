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
          <Picker.Item label="Let's Hit The Town (Social)" value="Social" />
          <Picker.Item label="Let's Workout (Fitness)" value="Health & Fitness" />
          <Picker.Item label="Let's Do Something Cool (Passions)" value="Hobbies/Passions" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
        ):(
          <Picker
          style={{width:450, height:150}}
          selectedValue={tag ? tag : "Personal Growth"}
          onValueChange={setTag}
        >
          <Picker.Item label="Let's Hit The Town (Social)" value="Social" />
          <Picker.Item label="Let's Workout (Fitness)" value="Health & Fitness" />
          <Picker.Item label="Let's Do Something Cool (Passions)" value="Hobbies/Passions" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
        )}
        
      </View>
    );
}

export default TagPicker

