import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ValuesList = ({selectedValues, setSelectedValues}) => {


  const values = [
    'Honesty', 'Compassion', 'Integrity', 'Respect', 'Loyalty',
    'Responsibility', 'Perseverance', 'Courage', 'Kindness', 
    'Humility', 'Generosity', 'Gratitude', 'Optimism', 
    'Creativity', 'Wisdom', 'Leadership', 'Teamwork', 
    'Adaptability', 'Curiosity', 'Passion', 'Ambition'
  ];

  const toggleValue = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues((prev) => prev.filter(v => v !== value));
    } else if (selectedValues.length < 3) {
      setSelectedValues((prev) => [...prev, value]);
    }
  };

  return (
    <View style={styles.container}>
      {values.map((value) => (
        <TouchableOpacity 
          key={value} 
          style={[styles.item, selectedValues.includes(value) && styles.selected]}
          onPress={() => toggleValue(value)}
        >
          <Text style={styles.text}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  item: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    margin: 5,
    borderRadius: 5,
  },
  selected: {
    backgroundColor: '#00BFFF',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color:"white",

  },
});

export default ValuesList;
