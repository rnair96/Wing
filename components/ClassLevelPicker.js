import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ClassLevelPicker = ({selectedLevel, setSelectedLevel}) => {
//   const [selectedLevel, setSelectedLevel] = useState('undergraduate');

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedLevel}
        onValueChange={(itemValue) => setSelectedLevel(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Undergraduate" value="Undergraduate" />
        <Picker.Item label="Graduate" value="Graduate" />
        <Picker.Item label="Masters" value="Masters" />
        <Picker.Item label="PhD" value="PhD" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  picker: {
    height: 50,
    width: 300,
  }
});

export default ClassLevelPicker;
