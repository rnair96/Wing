import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';


const MessageModal = ({ isMessageModalVisible, setMessageModalVisible, requestMessage, setRequestMessage, swipeRefMessage, currentCard }) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const name = currentCard?.displayName ? currentCard?.displayName: "this User";

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
            animationType="fade"
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
                    <View style={{ height:(Platform.OS==="android" && isKeyboardVisible)? "50%": "30%", bottom: isKeyboardVisible? "10%": 0, ...styles.modalView }}>
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 15 }}>Send {name} a Chat Request</Text>
                        <TextInput
                            value={requestMessage}
                            onChangeText={setRequestMessage}
                            placeholder={'A compliment or a joke breaks the ice!'}
                            multiline
                            numberOfLines={3}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor:"#E0E0E0", width: "95%", height: "30%" }} />
                        <TouchableHighlight
                            style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", alignItems: "center", borderRadius: 10, width: "60%", height:"20%", justifyContent:"center" }}
                            onPress={() => {
                                console.log("send this message to user", requestMessage);
                                swipeRefMessage.current.swipeRight();
                                setMessageModalVisible(!isMessageModalVisible);
                            }}
                        >
                            <Text style={{color:"white"}}>Send</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", alignItems: "center", borderRadius: 10, width: "60%", height:"20%", justifyContent:"center"}}
                            onPress={() => {
                                setRequestMessage(null);
                                setMessageModalVisible(!isMessageModalVisible);
                            }}
                        >
                            <Text style={{color:"white"}}>Cancel</Text>
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
        // backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background

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
    }

})

export default MessageModal;