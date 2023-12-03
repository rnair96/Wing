import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, Keyboard, StyleSheet, TouchableHighlight, FlatList, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

const PromptModal = ({ setTagline, setPrompt, isVisible, setIsVisible }) => {

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

        "My worst Wingman story is...",

        "My best Wingman story is...",

        "Here\’s what the ladies love about me...",
        
        "Here\’s what the ladies hate about me...",
        
        "Don\’t let me rant about this in front of the ladies...",
        
        "I\’ll need a Wing to intervene if I...",
        
        "My favorite catchphrase is...",
        
        "My favorite thing to say when things go wrong is...",
        ];
        
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    const [response, setResponse] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    // const screenObj = { "name": screen }

    //   const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedPrompt(item)} style={{margin:10, padding:5, borderWidth:0.5, borderColor:"grey", borderRadius:10}}>
          <Text>{item}</Text>
        </TouchableOpacity>
      );

    const handleSave = () => {
        // onClose();
        // navigation.navigate({ name: screenObj, params: { tagline: response, prompt: prompt } })
        setTagline(response);
        setPrompt(selectedPrompt);
        setResponse(null);
        setSelectedPrompt(null);
        setIsVisible(false);

        // You may want to save the response somewhere
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <Modal
            visible={isVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => {
                setIsVisible(!isVisible);
              }}
        >
            <View style={styles.centeredView}>
                {selectedPrompt ? (
                    <View style={{ height: "70%", bottom: isKeyboardVisible ? "10%" : 0, ...styles.modalView }}>
                        <Text>{selectedPrompt}</Text>
                        <TextInput
                            value={response}
                            onChangeText={setResponse}
                            placeholder="Your answer"
                            multiline
                            numberOfLines={3}
                            maxLength={50}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", width: "95%", height: "30%" }}
                        />
                                                                        <Text style={{color:"grey"}}>50 character limit</Text>

                        <TouchableHighlight
                            style={styles.button}
                            onPress={handleSave}
                        >
                            <Text style={{ color: "white" }}>Save</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => setSelectedPrompt(null)}
                        >
                            <Text style={{ color: "white" }}>Back</Text>
                        </TouchableHighlight>

                    </View>
                ) : (
                    <View style={{ height: "70%", ...styles.modalView }}>
                        <Text style={{ fontSize: 15, fontWeight: "bold", padding: 10 }}>Select A Prompt</Text>
                        <FlatList
                            data={prompts}
                            renderItem={renderItem}
                            keyExtractor={item => item}
                        />
                         <TouchableHighlight
                            style={{...styles.button}}
                            onPress={() => setIsVisible(!isVisible)}
                        >
                            <Text style={{ color: "white" }}>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                )}

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background

        // top:40
    },
    modalView: {
        width: "80%",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderColor: "#00308F",
        borderWidth: 2,
        paddingVertical: 5,
        paddingHorizontal: 30,
        backgroundColor: "#00308F",
        alignItems: "center",
        borderRadius: 10,
        width: "60%",
        height: "10%",
        justifyContent: "center"
    }

})

export default PromptModal;
