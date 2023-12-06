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
          <Picker.Item label="Open to Outdoor Activities" value="Open to Outdoor Activities" />
          <Picker.Item label="Open to Workout" value="Open to Workout" />
          <Picker.Item label="Open to Building Something Cool" value="Open for Building Something Cool" />
          <Picker.Item label="Open to Charitable Services" value="Open to Charitable Services" />
        </Picker>
        ):(
          <Picker
          style={{width:350, height:150}}
          selectedValue={tag ? tag : "None"}
          onValueChange={setTag}
          itemStyle={{ fontSize: 13 }}

        >
          <Picker.Item label="Let's Keep It Simple And Just Have Fun" value="None" />
          <Picker.Item label="Need Some Sun. Let's Do Something Outside" value="Open to Outdoor Activities" />
          <Picker.Item label="No Pain, No Gain. Let's Workout" value="Open to Workout" />
          <Picker.Item label="No More Dreaming. Let's Build Something Cool" value="Open to Build Something Cool" />
          <Picker.Item label="Gotta Feed the Spirit. Let's Do A Service" value="Open to Charitable Services" />

        </Picker>
        )}
        
      </View>
    );
}

export default TagPicker

