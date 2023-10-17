import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';


const MessageModal = ({ isMessageModalVisible, setMessageModalVisible, requestMessage, setRequestMessage, swipeRefMessage }) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);


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
            animationType="slide"
            transparent={true}
            visible={isMessageModalVisible}
            onRequestClose={() => {
                setMessageModalVisible(!isMessageModalVisible);
            }}
        >
            <KeyboardAvoidingView
                // behavior={'padding'}
                style={styles.centeredView}
                // keyboardVerticalOffset={0}
                >
                {/* <View style={styles.centeredView}> */}
                {/* <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss()}
                > */}
                    <View style={{ height:"30%", bottom: isKeyboardVisible? "5%": 0, ...styles.modalView }}>
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 17, color: "white" }}>Send this User a Request:</Text>
                        <TextInput
                            value={requestMessage}
                            onChangeText={setRequestMessage}
                            placeholder={'I love your mission! How can I help?'}
                            multiline
                            numberOfLines={3}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "white", width: "90%", height: "30%" }} />
                        <TouchableHighlight
                            style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "white", width: 120, alignItems: "center", borderRadius: 10 }}
                            onPress={() => {
                                console.log("send this message to user", requestMessage);
                                swipeRefMessage.current.swipeRight();
                                setMessageModalVisible(!isMessageModalVisible);
                            }}
                        >
                            <Text>Send</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "white", width: 120, alignItems: "center", borderRadius: 10 }}
                            onPress={() => {
                                setRequestMessage(null);
                                setMessageModalVisible(!isMessageModalVisible);
                            }}
                        >
                            <Text>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                    {/* </View> */}
                {/* </TouchableWithoutFeedback> */}
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // top:40
    },
    modalView: {
        width: "80%",
        backgroundColor: '#00BFFF',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }

})

export default MessageModal;