import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker';


const AgePicker = ({age, setAge}) => {

    const renderPickerItems = () => {
      const items = [];
      for (let i = 18; i <= 100; i++) {
        items.push(
          <Picker.Item key={i} label={i.toString()} value={i} />
        );
      }
      return items;
    };
  
    return (
      <View>
        <Picker
          selectedValue={age ? age: 18}
          onValueChange={(itemValue) => setAge(itemValue)}
          style={{width:100, height:200}}
        >
          {renderPickerItems()}
        </Picker>
      </View>
    );
}

export default AgePicker
