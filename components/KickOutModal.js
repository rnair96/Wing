import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet, Platform, Keyboard } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import useAuth from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, setDoc, addDoc } from 'firebase/firestore';
import * as Sentry from "@sentry/react";


const KickOutModal = ({ isModalVisible, setIsModalVisible }) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [askOutText, setAskOutText] = useState(false);
    const [name, setName] = useState(null);
    const [number, setNumber] = useState(null);
    const { logout } = useAuth();

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

    const getHerDigits = () => {
        //submit contact to db
        addDoc(collection(db, "DC_Ladies"), {
            name: name,
            number: number
          }).then(() => {
            setIsModalVisible(!isModalVisible);
            logout();
            alert("Got it. Talk Soon Sweetheart ;)")
          }).catch((error) => {
            alert("An Error Occured. Looks Like We Can't Get Your Number. Maybe Next Time ;)")
            console.log("ERROR, there was an error in sending a message", error);
            Sentry.captureMessage(`there was an error in sending a message ${error.message}`)
            setIsModalVisible(!isModalVisible);
            logout();
          });

    }

    return (

        <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setIsModalVisible(!isModalVisible);
            }}
        >
            <View style={styles.centeredView}>
                {askOutText ? (
                    <View style={{...styles.modalView, height:(Platform.OS==="android" && isKeyboardVisible)? "50%": "60%", bottom: isKeyboardVisible? "10%": 0}}>
                        <Text style={{ padding: 10, fontWeight: "800", fontSize: 15, textAlign: "center" }}>You're So Understanding. Tell You What? If You're In The DC Area, How About You Leave Your Name And Number And We'll Let You Know About One Of Our Upcoming Bar Crawls?</Text>
                        <Text style={{ padding: 10, fontWeight: "800", fontSize: 15, textAlign: "center" }}>{`P.S: A Drink On Us If You Wear That Top ;)`}</Text>

                        {/* <Text style={{ padding: 5, fontWeight: "700", paddingBottom: 10 }}>Sound Fair Enough?</Text> */}
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder={'Name'}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", width: "95%", margin:10}} />
                        <TextInput
                            value={number}
                            onChangeText={setNumber}
                            keyboardType='numeric'
                            placeholder={'Phone Number'}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", width: "95%", margin:10}} />
                        <TouchableHighlight
                            style={{ backgroundColor: "#00308F", width: "80%", padding:25 , alignItems: "center", borderRadius: 10, justifyContent: "center", margin:10}}
                            onPress={() => {
                                //submit name and number to database
                                getHerDigits();
                            }}
                        >
                            <Text style={{ color: "white", fontWeight:"bold" }}>{`*Eyes Roll* Sure, Fine.`}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ backgroundColor: "#00308F", width: "80%", padding:25, alignItems: "center", borderRadius: 10, justifyContent: "center", margin:10}}
                            onPress={() => {
                                setIsModalVisible(!isModalVisible);
                                logout();
                            }}
                        >
                            <Text style={{ color: "white", fontWeight:"bold" }}>Sorry, I Have A Boyfriend</Text>
                        </TouchableHighlight>
                    </View>
                ) : (
                    <View style={styles.modalView}>
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 15, textAlign: "center" }}>Sorry, This Is Currently A Networking App For Men As Our Priority Is Helping With Men's Dating And Mental Health Issues.</Text>
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 15, paddingBottom: 10, textAlign: "center" }}>Trust Me, You'll Thank Us For This.</Text>
                        <TouchableHighlight
                            style={{ backgroundColor: "#00308F", width: "70%", height: "20%", alignItems: "center", borderRadius: 10, justifyContent: "center" }}
                            onPress={() => {
                                setAskOutText(true);
                            }}
                        >
                            <Text style={{ color: "white", fontWeight:"bold" }}>Ok</Text>
                        </TouchableHighlight>
                    </View>
                )}

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
    modalView: {
        height: "30%",
        width: "80%",
        backgroundColor: 'white',
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

export default KickOutModal;