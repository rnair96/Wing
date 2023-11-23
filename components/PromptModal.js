import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, Keyboard, StyleSheet, TouchableHighlight } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

const PromptModal = ({ prompt, navigation, onClose }) => {
    const [response, setResponse] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    //   const navigation = useNavigation();

    const handleSave = () => {
        onClose();
        navigation.navigate("SetUp3", { tagline: response, prompt: prompt })
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
            visible={true}
            animationType="fade"
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={{ height: "30%", bottom: isKeyboardVisible ? "10%" : 0, ...styles.modalView }}>
                    <Text>{prompt}</Text>
                    <TextInput
                        value={response}
                        onChangeText={setResponse}
                        placeholder="Your answer"
                        multiline
                        numberOfLines={3}
                        placeholderTextColor={"grey"}
                        style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", width: "95%", height: "30%" }}
                    />
                    <TouchableHighlight
                        style={styles.button}
                        onPress={onClose}
                    >
                        <Text style={{ color: "white" }}>Cancel</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.button}
                        onPress={handleSave}
                    >
                        <Text style={{ color: "white" }}>Save</Text>
                    </TouchableHighlight>
                    {/* <Button title="Cancel" onPress={onClose} /> */}
                    {/* <Button title="Save" onPress={handleSave} /> */}
                </View>
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
        height: "20%", 
        justifyContent: "center"
    }

})

export default PromptModal;
