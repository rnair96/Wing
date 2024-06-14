import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform, ActivityIndicator } from 'react-native';
import useAuth from '../hooks/useAuth';
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';



const GCMessageModal = ({ isVisible, setIsVisible, profile, swipes, matches, requests }) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const name = profile?.displayName ? profile?.displayName : "this User";
    const [loading, setLoading] = useState(true)
    const [alreadyMatched, setAlreadyMatched] = useState(false);
    const [sentRequest, setSentRequest] = useState(false);
    const [recievedRequest, setRecievedRequest] = useState(false);
    const [chatItem, setChatItem] = useState(null);
    const [requestMessage, setRequestMessage] = useState(null);
    const { user } = useAuth();
    const navigation = useNavigation();


    //function to send chat request
    const sendRequest = () => {

        const timestamp = serverTimestamp();

        const swipedUser = {
            id: profile.id,
            timeSwiped: timestamp,
            message: requestMessage,
            swipedFrom: "groupchat",

        }

        setDoc(doc(db, global.users, user.uid, "swipes", profile.id), swipedUser)
            .catch(() => {
                alert("Error swiping user from group chat. Try again later.")
                Sentry.captureMessage(`Error setting a swipe for ${user.uid} on ${profile.id} through groupchat, ${error.message}`)
                return;
            });

        setRequestMessage(null);
    }

    const searchForProfile = (arr, isMatches) => {
        let arr_item;
        if (arr && arr.length > 0 && !isMatches) {
            arr_item = arr.filter((item) => item.id === profile.id)[0]
        } else if (arr && arr.length > 0) {
            arr_item = arr.filter((item) => item.id.includes(profile.id))[0]
        } else {
            return false;
        }

        if (arr_item) {
            setChatItem(arr_item);
            return true;
        } else {
            return false;
        }
    }


    useEffect(() => {
        const swipeContains = searchForProfile(swipes, false);
        if (swipeContains) {
            const matchContains = searchForProfile(matches, true)
            if (matchContains) {
                console.log("found user in matches")
                setAlreadyMatched(true);
            } else {
                console.log("found user in swipes")
                setSentRequest(true);
            }
        } else {
            const requestContains = searchForProfile(requests, false);
            if (requestContains) {
                console.log("found user in requests");
                setRecievedRequest(true);
            }
        }

        setLoading(false)
    }, [swipes, matches, requests, profile])

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
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}
        >
            {!loading ? (
                <KeyboardAvoidingView
                    // behavior={'padding'}
                    style={styles.centeredView}
                // keyboardVerticalOffset={0}
                >
                    {/* <View style={styles.centeredView}> */}
                    {/* <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss()}
                > */}
                    {(sentRequest || alreadyMatched || recievedRequest) ? (
                        <View style={styles.modalView}>
                            {sentRequest && <Text style={{ padding: 5, fontWeight: "800", fontSize: 15 }}>Already Sent {name} A Chat Request</Text>}
                            {alreadyMatched &&
                                <TouchableHighlight
                                    style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", alignItems: "center", borderRadius: 10, width: "90%", height: "20%", justifyContent: "center" }}
                                    onPress={() => {
                                        setIsVisible(!isVisible);
                                        navigation.navigate("Message", { matchedDetails: chatItem, otherProfile: profile, profile: null });
                                    }}>
                                    <Text style={{ color: "white", textAlign: "center" }}>Go To Active Chat With {name}</Text>
                                </TouchableHighlight>
                            }
                            {recievedRequest &&
                                <TouchableHighlight
                                    style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", alignItems: "center", borderRadius: 10, width: "90%", height: "20%", justifyContent: "center" }}
                                    onPress={() => {
                                        setIsVisible(!isVisible);
                                        navigation.navigate("RequestMessage", { requestDetails: chatItem, otherProfile: profile, profile: null });
                                    }}>
                                    <Text style={{ color: "white", textAlign: "center" }}>Go To Request From {name}</Text>
                                </TouchableHighlight>}
                            <TouchableHighlight
                                style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", alignItems: "center", borderRadius: 10, width: "90%", height: "20%", justifyContent: "center" }}
                                onPress={() => {
                                    // setRequestMessage(null);
                                    setIsVisible(!isVisible);
                                }}
                            >
                                <Text style={{ color: "white" }}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                    ) : (
                        <View style={{ height: (Platform.OS === "android" && isKeyboardVisible) ? "50%" : "30%", bottom: isKeyboardVisible ? "10%" : 0, ...styles.modalView }}>
                            <Text style={{ padding: 5, fontWeight: "800", fontSize: 15 }}>Send {name} a Chat Request</Text>
                            <TextInput
                                value={requestMessage}
                                onChangeText={setRequestMessage}
                                placeholder={'A compliment or a joke breaks the ice!'}
                                multiline
                                numberOfLines={3}
                                placeholderTextColor={"grey"}
                                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", width: "95%", height: "30%" }} />
                            <TouchableHighlight
                                style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", alignItems: "center", borderRadius: 10, width: "60%", height: "20%", justifyContent: "center" }}
                                onPress={() => {
                                    sendRequest();
                                    setIsVisible(!isVisible);
                                    navigation.navigate("GroupChat", { refresh: true, profile: profile, matches: matches, requests });
                                    //return to group chat
                                }}
                            >
                                <Text style={{ color: "white" }}>Send</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", alignItems: "center", borderRadius: 10, width: "60%", height: "20%", justifyContent: "center" }}
                                onPress={() => {
                                    // setRequestMessage(null);
                                    setIsVisible(!isVisible);
                                }}
                            >
                                <Text style={{ color: "white" }}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                    )}

                    {/* </View> */}
                    {/* </TouchableWithoutFeedback> */}
                </KeyboardAvoidingView>
            ) : (
                <ActivityIndicator size="large" color="#00BFFF" />
            )}
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

export default GCMessageModal;