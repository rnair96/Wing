import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ValuesList = ({selectedValues, setSelectedValues}) => {


  const values = [
    'Honesty', 'Compassion', 'Integrity', 'Respect', 'Loyalty',
    'Responsibility', 'Perseverance', 'Courage', 'Kindness', 
    'Humility', 'Generosity', 'Gratitude', 'Optimism', 
    'Creativity', 'Wisdom', 'Leadership', 'Teamwork', 
    'Adaptability', 'Curiosity', 'Passion', 'Purposeful','Ambition',
    'Empathy', 'Determination', 'Justice', 'Fairness', 
    'Patience', 'Discipline', 'Diligence', 'Authenticity',
    'Consistency', 'Altruism', 'Harmony', 'Excellence', 
    'Self-control', 'Sincerity', 'Forgiveness', 'Resilience', 
    'Open-mindedness', 'Accountability', 'Appreciation','Service',
    'Tolerance', 'Mindfulness', 'Inclusivity', 'Dependability',
    'Punctuality','Positivity', 'Vigilance', 'Devotion', 'Dedication'
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
    borderRadius: 20,
  },
  selected: {
    backgroundColor: '#00BFFF',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',

  },
});

export default ValuesList;
