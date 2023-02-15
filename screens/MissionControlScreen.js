import React, { Component, useState } from 'react';
import { Text, SafeAreaView, View, TextInput, Button, FlatList, StyleSheet} from 'react-native';
import Header from '../Header';
import axios from 'axios';
import SenderMC from './SenderMC';
import RecieverMC from './RecieverMC';
import { Picker } from '@react-native-picker/picker';


const MissionControlScreen = () => {
    const inputs = [
        "What are 5 collaborative goals can someone who wants to help with relationships and an online marketer do together?",
        "What's a good icebreaker line to someone who does online marketing?",
        "What's a weekly goal to attain for two guys who want to build an online relationship business together?"
    ]
    const [userText, setUserText] = useState(inputs[0]);
    const [data, setData] = useState([]);
    const apiKey = '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'
    const apiURL = 'https://api.openai.com/v1/completions'
    const [count, setCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState(inputs[0]);

    const handleOptionChange = (option) => {
      setSelectedOption(option);
    //   setUserText(option);
      console.log("user text", selectedOption);
    };
    


    const handleSend = async ()=> {
        const prompt = selectedOption
        const response = await axios.post(apiURL, {
            prompt: prompt,
            max_tokens: 1024,
            temperature:  0.5,
            model: "text-davinci-001",
        },{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${apiKey}`
            }
        }).catch(function (error) {
            return {
                type: "REGISTER_USER",
                api_response: {success: false}
            }
        });

        const text = response.data.choices[0].text;
        setData([...data, {type: 'user', 'text':selectedOption}, {type: 'bot', 'text': text}]);
        // setUserText('');
        }


    return (
        <SafeAreaView style={{flex:1}}>
        <Header title={"Mission Control"}/>
        <FlatList
            data = {data}
            style={styles.container}
            keyExtractor = {(item, index) => index.toString()}
            renderItem = {({item}) => (
                item.type === 'user' ? (
                    <SenderMC key = {1} message={item.text}/>
                ):(
                    <RecieverMC key = {2} message={item.text}/>
                )
            )}
        />
        <View 
        style={{flexDirection:"row", borderColor:"#E0E0E0", borderWidth:2, alignItems:"center"}}>
            <Picker
            style={{height:200, width:'80%'}}
        selectedValue={selectedOption}
        onValueChange={handleOptionChange}
        enabled='true'
      >
        <Picker.Item label="Ask for a Mission" value={inputs[0]} />
        <Picker.Item label="Ask for an Icebreaker" value={inputs[1]} />
        <Picker.Item label="Ask for a Goal" value={inputs[2]} />
      </Picker>
            {/* <TextInput
            style={{height:50, width: 300, fontSize:15, padding:10}}
            placeholder = "Ask Mission Control..."
            onChangeText={setUserText}
            onSubmitEditing={handleSend}
            value={userText}
            /> */}
            <Button onPress={handleSend} title="Radio" color="#00BFFF"/>
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container :{
        width:'90%',
        margin:10,
    },
    message: {

    }, 
    title:{

    }

})

export default MissionControlScreen
