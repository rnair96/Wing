import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import useAuth from '../hooks/useAuth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import * as Sentry from "@sentry/react";


const ModeratorModal = ({ isVisible, setIsVisible, message }) => {
    const { user } = useAuth();

    // const navigation = useNavigation();

    const blockMessageAndFlagUser = () => {
        updateDoc(doc(db, "groupChat", message.id), {
            status: "blocked"
        }).catch((error) => {
            console.log(error.message)
            Sentry.captureMessage(`error blocking message ${error.message} for message id ${message.id}`)
            alert("There was an error blocking message. Try again later.")
        });

        updateDoc(doc(db, global.users, message.userId), {
            flags: arrayUnion({
                type: "Abusive Behavior/Messaging",
                reported_by: user.uid,
            }),
            flagged_status: "unresolved"
        }).then(() => {
            alert("The message has been moderated and user has been flagged.");
        }).catch(()=>{
            console.log(error.message)
            Sentry.captureMessage(`error flagging user ${error.message} for user id ${message.userId}`)
            alert("There was an error flagging user. Try again later.")
        })
    }

    const changeMessageStatus = (status) =>{
        updateDoc(doc(db, "groupChat", message.id), {
            status: status
        }).then(() => {
            alert("The message status has been updated.");
        }).catch((error) => {
            console.log(error.message)
            Sentry.captureMessage(`error changing message status ${error.message} for message id ${message.id}`)
            alert("There was an error changing message status. Try again later.")
            //   navigation.navigate("GroupChat");
        });
    }


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={{ padding: 20, fontWeight: "bold", fontSize: 20 }}>Moderator Options</Text>
                    {message?.status && message.status==="blocked" ? (
                        <TouchableHighlight
                        style={styles.opacitystyle}
                        onPress={() => {
                            changeMessageStatus("resolved")
                            setIsVisible(!isVisible)
                        }}
                    >
                        <Text style={styles.textStyle}>Unblock Message</Text>
                    </TouchableHighlight>
                    ):(
                        <TouchableHighlight
                        style={styles.opacitystyle}
                        onPress={() => {
                            changeMessageStatus("blocked")
                            setIsVisible(!isVisible)
                        }}
                    >
                        <Text style={styles.textStyle}>Block Message</Text>
                    </TouchableHighlight>
                    )}

                    <TouchableHighlight
                        style={styles.opacitystyle}
                        onPress={() => {
                            blockMessageAndFlagUser();
                            setIsVisible(!isVisible)
                        }}
                    >
                        <Text style={styles.textStyle}>Block Message & Flag User</Text>
                    </TouchableHighlight>


                    <TouchableHighlight
                        style={styles.opacitystyle}
                        onPress={() => {
                            setIsVisible(!isVisible);
                        }}
                    >
                        <Text style={styles.textStyle}>Cancel</Text>
                    </TouchableHighlight>
                </View>
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
        height: "60%",
        width: "70%",
        // maxHeight:500,
        // maxWidth:"90%",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    opacitystyle: {
        // borderColor: "#00308F",
        // borderWidth: 2,
        paddingVertical: 5,
        paddingHorizontal: 30,
        backgroundColor: "#00308F",
        width: "90%",
        height: "10%",
        alignItems: "center",
        borderRadius: 10,
        justifyContent: "center"
    }

})

export default ModeratorModal;