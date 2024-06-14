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
          <Picker.Item label="No Clue. Let's Just Have Fun" value="None" />
          <Picker.Item label="The Icebreaker: You have great energy and can approach a girl, guy, or group and make a fast friend" value="The Icebreaker" />
          <Picker.Item label="The Conversationalist: You can have deep conversations and make powerful connections" value="The Conversationalist" />
          <Picker.Item label="The Closer: The leader of a good time and know when and where to take things to the next level" value="The Closer" />
          <Picker.Item label="The Comedian: You have the best jokes, tricks, and stories that keep a party engaged." value="The Comedian" />

        </Picker>
        )}
        
      </View>
    );
}

export default TagPicker

