import React from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet, FlatListComponent } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import { db } from '../firebase';
import { doc } from 'firebase/firestore';
import likeMessage from '../lib/likeMessage';





const ReplyModal = ({ isVisible, setIsVisible, message, setInput, setReplyToken, setUserIdReply, setUserNameReply, matches, swipes, requests, navigation }) => {
    const { user } = useAuth();
    const did_user_like = message?.likes ? message.likes.includes(user.uid): false



    const replyToUser = () => {
        const nameReply = "@" + message.displayName + " ";
        setUserNameReply(message.displayName)
        setUserIdReply(message.userId);
        setReplyToken(message.userToken)
        setInput(nameReply)
    }

    const viewUserProfile = () => {
        // const navigation = useNavigation();
        navigation.navigate("GCProfileView", { profileId: message.taggedId, swipes: swipes, matches: matches, requests: requests })
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
                    <Text style={{ padding: 20, fontWeight: "bold", fontSize: 20 }}>Reply Options</Text>
                    <TouchableHighlight
                        style={styles.opacitystyle}
                        onPress={() => {
                            replyToUser();
                            setIsVisible(!isVisible)
                        }}
                    >
                        <Text style={styles.textStyle}>Reply To {message?.displayName ? message.displayName : "User"}</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={styles.opacitystyle}
                        onPress={() => {
                            likeMessage(message, user.uid, doc(db, global.groupchat, message.id))
                            setIsVisible(!isVisible)
                        }}
                    >
                        <Text style={styles.textStyle}>{did_user_like? "UnLike Message": "Like Message"}</Text>
                    </TouchableHighlight>

                    {message?.taggedName && message?.taggedName !== "N/A" && message.taggedId !== user.uid && (
                        <TouchableHighlight
                            style={styles.opacitystyle}
                            onPress={() => {
                                setIsVisible(!isVisible);
                                viewUserProfile();
                            }}
                        >
                            <Text style={styles.textStyle}>View {message.taggedName}'s Profile</Text>
                        </TouchableHighlight>
                    )}


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
        height: "20%",
        alignItems: "center",
        borderRadius: 10,
        justifyContent: "center"
    }

})

export default ReplyModal;