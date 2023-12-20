import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuestionComponent = ({ question, answers, setSelectedAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleAnswerSelect = (index) => {
    setSelected(index);
    setSelectedAnswer(index); // Update the parent component state
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.answersContainer}>
        {answers.map((answer, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.answerButton, selected === index && styles.selectedAnswer]}
            onPress={() => handleAnswerSelect(index)}
          >
            <Text style={styles.answerText}>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    textAlign:"center"
  },
  answersContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  answerButton: {
    padding: 10,
    margin:10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  selectedAnswer: {
    backgroundColor: '#00BFFF',
  },
  answerText: {
    fontSize: 16,
  },
});

export default QuestionComponent;
