import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PromptModal from '../components/PromptModal';
import { SafeAreaView } from 'react-native-safe-area-context';


const prompts = [
"The ideal girl my Wing can help me find...",

"I need my Wing to keep me away from this type of girl...",

"The first thing my Wing and I should do when we enter a bar...", 

"The ideal bar my Wing and I should go to is...",

"The reason my Wing should buy the first round is...",

"I\’ll buy the first round if...",

"A great night with my Wing looks like...",

"Looking for a Wing to help me...",
 
"What makes me a great Wing is that I...",

"How I can guarantee my Wing and I have a great night is...",

"Here\’s what the ladies love about me...",

"Here\’s what the ladies hate about me...",

"Don\’t let me rant about this in front of the ladies...",

"I\’ll need a Wing to intervene if I...",

"My favorite catchphrase is...",

"My favorite thing to say when things go wrong is...",
];

const TaglinePromptScreen = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const navigation = useNavigation();


  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedPrompt(item)} style={{margin:10, padding:5, borderWidth:0.5, borderColor:"grey", borderRadius:10}}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex:1, justifyContent:"center", alignItems:"center"}}>
    <Text style={{fontSize: 15, fontWeight: "bold", padding: 10}}>Select A Prompt</Text>
      <FlatList
        data={prompts}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
      {selectedPrompt && (
        <PromptModal
          prompt={selectedPrompt}
          navigation = {navigation}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </SafeAreaView>
  );
};

export default TaglinePromptScreen;
