import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const InterestsList = ({selectedInterests, setSelectedInterests}) => {
  
const interests = [
  "Traveling", "Gym", "Work", "Sports", 
  "Hiking", "Cooking", "Movies", "Art",
  "Comedy", "Music", "Reading", "Writing", "Meditation",
  "Volunteering", "Animal Lover", "Outdoors",
  "Gaming", "Dancing", "Fashion", "Technology", "Cultures/Languages",
  "Religion", "Science", "Politics", "Business", 
  "History", "Podcasts", "Relationships", 
  "Exploring Nightlife", "Cafe-Hopping", "Food/Restaurants", 
  "Live Concerts", "Board Games", "Anime", "420",
];


  const toggleInterests = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter(v => v !== interest));
    } else if (selectedInterests.length < 3) {
      setSelectedInterests((prev) => [...prev, interest]);
    }
  };

  return (
    <View style={styles.container}>
      {interests.map((interest) => (
        <TouchableOpacity 
          key={interest} 
          style={[styles.item, selectedInterests.includes(interest) && styles.selected]}
          onPress={() => toggleInterests(interest)}
        >
          <Text style={styles.text}>{interest}</Text>
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

export default InterestsList;
