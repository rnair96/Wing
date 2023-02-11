import React, { Component, useState } from 'react';
import { Text, SafeAreaView, View, TextInput, Button, FlatList } from 'react-native';
import Header from '../Header';
import axios from 'axios';


const MissionControlScreen = () => {
    const [userText, setUserText] = useState('');
    const [data, setData] = useState();
    const apiKey = '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'
    const apiURL = 'https://api.openai.com/v1/engines/text-davinci-002/completions'


    const handleSend = async ()=> {
        const prompt = userText
        const response = await axios.post(apiURL, {
            prompt: prompt,
            max_tokens: 1024,
            temperature:  0.5,
        },{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${apiKey}`
            }
        });
        const text = response.data.choices[0].text;
        setData([...data, {type: 'user', 'text':userText}, {type: 'bot', 'text': text}])
        setUserText('')
    } 



    return (
        <SafeAreaView style={{flex:1}}>
        <Header title={"Mission Control"}/>
        <FlatList
            data = {data}
            keyExtractor = {(item, index) => index.toString()}
            renderItem = {({item}) => (
                <View style ={{flexDirection:'row', padding:10}}>
                    <Text style={{fontWeight:'bold', color: item.type === 'user' ? 'blue' : 'red'}}>{item.type === 'user' ? 'Wing' : 'Mission Control'}</Text>
                    <Text>{item.text}</Text>
                </View>
            )}
        />
        <View 
        style={{flexDirection:"row", borderColor:"#E0E0E0", borderWidth:2, alignItems:"center"}}>
            <TextInput
            style={{height:50, width: 300, fontSize:15, padding:10}}
            placeholder = "Ask Mission Control..."
            onChangeText={setUserText}
            onSubmitEditing={handleSend}
            value={userText}
            />
            <Button onPress={handleSend} title="Send" color="#00BFFF"/>
        </View>
        </SafeAreaView>
    )
}

export default MissionControlScreen
