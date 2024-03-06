import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button } from 'react-native';

const InterestsList = ({ selectedInterests, setSelectedInterests }) => {
  const [interests, setInterests] = useState([
    "Traveling", "Gym", "Work", "Sports", "Basketball", "Football", "Soccer", "MMA", "Boxing",
    "Hiking", "Hunting", "Fishing", "Camping", "Cooking", "Movies/Shows", "Art",
    "Comedy", "Music", "Reading", "Writing", "Meditation", "Yoga",
    "Volunteering", "Animal Lover", "Outdoors", "Cars",
    "Video Games", "Dancing", "Fashion", "Sneakers", "Technology", "Cultures", "Languages",
    "Religion", "Stoicism", "Philosophy", "Science", "Politics", "Business", "Entrepreneur", "Conspiracies",
    "History", "Podcasts", "Books", "Relationships",
    "Nightlife", "Cafes", "Restaurants",
    "Concerts", "Board Games", "Anime", "420", "Fasting", "Nutrition", "God"
  ]);
  const [newInterest, setNewInterest] = useState('');

  const toggleInterests = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(v => v !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const addInterest = () => {
    const interestTrimmed = newInterest.trim();
    if (interestTrimmed && !interests.includes(interestTrimmed)) {
      setInterests(prevInterests => [...prevInterests, interestTrimmed]);
      setNewInterest('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add Custom Interest"
          maxLength={13}
          value={newInterest}
          onChangeText={setNewInterest}
        />
        <Button title="Add" onPress={addInterest} />
      </View>
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
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    flex: 1,
  },
  item: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    margin: 5,
    borderRadius: 20,
    width: '45%', // Adjust size for better alignment
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
