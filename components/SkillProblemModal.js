import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet, TextInput, Image, Keyboard, Platform, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import * as Sentry from "@sentry/react";


const SkillProblemModal = ({ isModalVisible, setIsModalVisible, reload, setReload }) => {
    const [strength, setStrength] = useState(null);
    // const [weakness, setWeakness] = useState(null);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const { user } = useAuth();

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


    const incompleteform = strength === null //|| weakness === null;

    const updateUserProfile = () => { 

        console.log("setting attributes");

        updateDoc(doc(db, global.users, user.uid), {
            strength: strength,
            // weakness: weakness
        }).then(() => {
            setIsModalVisible(!isModalVisible);
            setReload(!reload)
        }).catch((error) => {
            alert("Error updating profile with attributes. Try again later.")
            Sentry.captureMessage(`Error setting attributes for ${user.uid}, ${error.message}`)
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
                {/* <TouchableWithoutFeedback
                onPress={()=>Keyboard.dismiss()}
                style={styles.centeredView}> */}
                <TouchableWithoutFeedback
                onPress={()=>Keyboard.dismiss()}>
                <View style={{height:(Platform.OS==="android" && isKeyboardVisible)? "50%": "30%", bottom: isKeyboardVisible? "10%": 0, ...styles.modalView }}>

                <Text style={styles.formTitle}>Share Your Skill</Text>
            <Text style={{ paddingBottom: 10, color: "grey", width: "80%", textAlign:"center" }}>Tell us at least one strength/skill you have a Wing might find useful.</Text>
            <Text style={{ paddingBottom: 10, color: "grey", width: "80%", textAlign:"center" }}>This can range from a fun personality quirk to an interesting business skill. Get creative!</Text>

            {/* <KeyboardAvoidingView
                onPress={()=>Keyboard.dismiss()}> */}
            <View 
                onPress={()=>Keyboard.dismiss()}
                style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
              {/* <Text>Skill: </Text> */}
              <View style={{backgroundColor:"black", borderRadius:20, padding:5}}>
              <Image style={{ height: 20, width: 20, alignItems:"center"}} source={require("../images/bicep.png")}></Image>
              </View>
              <TextInput
                value={strength}
                multiline
                numberOfLines={2}
                maxLength={50}
                onChangeText={setStrength}
                placeholder={"I'm great at hosting parties."}
                placeholderTextColor="#888888"
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", margin: 10, }} />
            </View>
            {/* </KeyboardAvoidingView> */}


            {/* <Text style={styles.formTitle}>Problem</Text> */}
            {/* <Text style={{ paddingBottom: 10, color: "grey", width: "80%" }}>Tell us one problem a Wing can assist you on. {`(We all got one).`}</Text> */}
            {/* <Text style={{ paddingBottom: 10, color: "grey" }}>{`(We all got one)`}</Text> */}
            {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}> */}
              {/* <Text>Problem: </Text> */}
              {/* <View style={{backgroundColor:"black", borderRadius:20, padding:5}}>
              <Image style={{ height: 25, width: 25, alignItems:"center"}} source={require("../images/cracked_shield.png")}></Image>
              </View>
              <TextInput
                value={weakness}
                multiline
                numberOfLines={2}
                maxLength={50}
                onChangeText={setWeakness}
                placeholder={"I'm terrible at making jokes"}
                placeholderTextColor="#888888"
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", margin: 10, }} />
            </View> */}
                    <TouchableHighlight
                        disabled={incompleteform}
                        style={[{ ...styles.button }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                        onPress={updateUserProfile}>
                        <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Save</Text>
                    </TouchableHighlight>
                </View>
                </TouchableWithoutFeedback>
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
        height: "40%",
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
    },
    formTitle: {
        fontSize: 15,
        fontWeight: "bold",
        // color: "#00308F",
        // color:"#00BFFF",
        padding: 20
      },
      button: {
        margin: 5,
        paddingVertical: 5,
        paddingHorizontal: 30,
        backgroundColor: "#00308F",
        alignItems: "center",
        borderRadius: 10,
        width: "50%",
        height: "10%",
        justifyContent: "center"
    }


})

export default SkillProblemModal;