import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const InterestsList = ({selectedInterests, setSelectedInterests}) => {
  
const interests = [
  "Traveling", "Gym", "Work", "Sports", "Basketball", "Football", "Soccer", "MMA", "Boxing",
  "Hiking", "Hunting", "Fishing", "Camping", "Cooking", "Movies/Shows", "Art",
  "Comedy", "Music", "Reading", "Writing", "Meditation", "Yoga",
  "Volunteering", "Animal Lover", "Outdoors", "Cars",
  "Video Games", "Dancing", "Fashion", "Sneakers", "Technology", "Cultures", "Languages",
  "Religion", "Stoicism", "Philosophy", "Science", "Politics", "Business", "Entrepreneur", "Conspiracies",
  "History", "Podcasts", "Books", "Relationships", 
  "Nightlife", "Cafes", "Restaurants", 
  "Concerts", "Board Games", "Anime", "420", "Fasting", "Nutrition", "God"
];


  const toggleInterests = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter(v => v !== interest));
    } else if (selectedInterests.length < 5) {
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
