import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';


const SearchModal = ({ isSearchModalVisible, setSearchModalVisible, name, setName, email, setEmail, searchProfiles, swipeRefSearch}) => {
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
            animationType="fade"
            transparent={true}
            visible={isSearchModalVisible}
            onRequestClose={() => {
                setSearchModalVisible(!isSearchModalVisible);
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
                <TouchableWithoutFeedback
                    onPress={() => Keyboard.dismiss()}>
                    <View style={{ height: (Platform.OS === "android" && isKeyboardVisible) ? "60%" : "40%", bottom: isKeyboardVisible ? "10%" : 0, ...styles.modalView }}>
                        <Text style={{ padding: 10, fontWeight: "800", fontSize: 15 }}>Search Profiles Using Name And/Or Email:</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder={'First Name'}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", width: "95%" }} />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder={'Email'}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", width: "95%" }} />
                        <TouchableHighlight
                            style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", alignItems: "center", borderRadius: 10, width: "60%", height: "20%", justifyContent: "center" }}
                            onPress={() => {
                                searchProfiles(name, email, swipeRefSearch);
                                setName(null);
                                setEmail(null);
                                setSearchModalVisible(!isSearchModalVisible);
                            }}
                        >
                            <Text style={{ color: "white" }}>Search</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", alignItems: "center", borderRadius: 10, width: "60%", height: "20%", justifyContent: "center" }}
                            onPress={() => {
                                setSearchModalVisible(!isSearchModalVisible);
                            }}
                        >
                            <Text style={{ color: "white" }}>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                </TouchableWithoutFeedback>
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
    }

})

export default SearchModal;