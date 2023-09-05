import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const YNRadioButton = ({selectedOption, setSelectedOption}) => {
//   const [selectedOption, setSelectedOption] = useState(null);

  const options = ['Yes', 'No'];

  return (
    <View style={styles.container}>
      {options.map(option => (
        <TouchableOpacity 
          key={option} 
          style={styles.optionContainer} 
          onPress={() => setSelectedOption(option)}>
          
          <View style={[styles.circle, selectedOption === option && styles.selected]} />
          <Text style={styles.text}>{option}</Text>
          
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  selected: {
    backgroundColor: '#00BFFF',
  },
  text: {
    fontSize: 16,
    color:"white"
  },
});

export default YNRadioButton;
