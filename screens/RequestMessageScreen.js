import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, TextInput, TouchableHighlight, Image, TouchableOpacity, Text, Modal, KeyboardAvoidingView, Keyboard, ScrollView, Platform } from 'react-native';
import useAuth from '../hooks/useAuth';
import RecieverMessage from './RecieverMessage';
import { collection, serverTimestamp, updateDoc, doc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import sendPush from '../lib/sendPush';
import { useNavigation, useRoute } from '@react-navigation/core';
import ChatHeader from '../components/ChatHeader';
import generateId from '../lib/generateId'
import { Entypo } from '@expo/vector-icons';
import deleteRequest from '../lib/deleteRequest';
import * as Sentry from "@sentry/react";
import ProfileCardComponent from "../components/ProfileCardComponent"

const RequestMessageScreen = () => {

    const { params } = useRoute();
    const { requestDetails, otherProfile, profile } = params;
    const { user } = useAuth();
    const [isMessageModalVisible, setMessageModalVisible] = useState(false);
    const [secondModal, setSecondModal] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [message, setMessage] = useState(null);

    const name = otherProfile ? otherProfile.displayName : "Account User";
    const navigation = useNavigation();
    const batch = writeBatch(db);
    const [userProfile, setUserProfile] = useState(profile);

    useEffect(() => {
        if (!requestDetails.read) {
            console.log("updating read")
            updateDoc(doc(db, global.users, user.uid, "requests", requestDetails.id), {
                read: true,
            })
        }
    }, [])

    useEffect(() => {
        let isCancelled = false; // cancel flag

        if (!profile) {
            console.log("fetching user data...")
            const fetchUserData = async () => {
                try {
                    const userSnap = await getDoc(doc(db, global.users, user.uid));
                    setUserProfile({
                        id: user.uid,
                        ...userSnap.data()
                    })
                } catch (error) {
                    if (!isCancelled) {
                        console.log("incomplete fetch data:", error);
                        Sentry.captureMessage(`Cancelled fetching user data in request screen of ${user.uid}, ${error.message}`)

                    }
                    console.log("error fetching userdata");
                    Sentry.captureMessage(`Error fetching user data in request screen of ${user.uid}, ${error.message}`)

                }


            }

            fetchUserData();

            return () => {
                isCancelled = true;
            };
        }


    }, [profile, db])

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


    const matchThenMove = async () => {
        const id = generateId(user.uid, requestDetails.id)
        const timestamp = serverTimestamp();
        const from = requestDetails?.swipedFrom ? requestDetails.swipedFrom : "N/A";

        const matchDoc = {
            userMatched: [user.uid, requestDetails.id],
            match_timestamp: timestamp,
            latest_message_timestamp: timestamp,
            matchedFrom: from
        }


        const swipedRef = doc(db, global.users, user.uid, "swipes", requestDetails.id)
        const swipeDoc = {
            id: requestDetails.id,
            message: message,
            timeSwiped: timestamp,
            swipedFrom: from,
            isResponse: true,
            match_id: id,
            //add boolean variable for isResponse and have onswipe function deal with that
        }

        try {
            //should move all db operations to onSwipe function and handle if isResponse, only keep setting swipe doc

            batch.set(doc(db, global.matches, id), matchDoc);

            batch.set(swipedRef, swipeDoc);

            batch.delete(doc(db, global.users, user.uid, "requests", requestDetails.id))

            const messageRefOne = doc(collection(db, global.matches, id, "messages"));

            const messageOne = {
                timestamp: requestDetails.timestamp,
                userId: requestDetails.id,
                displayName: otherProfile.displayName,
                message: requestDetails.message,
                read: true,
                type: "text"
            }

            batch.set(messageRefOne, messageOne);

            const username = userProfile ? userProfile.displayName : user.displayName.split(" ")[0]

            if (message && message !== "") {
                const messageRefTwo = doc(collection(db, global.matches, id, "messages"));

                const messageTwo = {
                    timestamp: timestamp,
                    userId: user.uid,
                    displayName: username,
                    message: message,
                    read: false,
                    type: "text"
                }

                batch.set(messageRefTwo, messageTwo);
            }


            await batch.commit().then(() => {
                console.log("Added match, swipe doc and deleted request doc and messages to match doc");

                navigation.navigate("ToggleChat", userProfile);

                if (userProfile && otherProfile?.notifications && otherProfile.notifications.messages && otherProfile.token && otherProfile.token !== "testing" && otherProfile.token !== "not_granted") {

                    const matchedDetails = { id: id, ...matchDoc }

                    const messageDetails = { matchedDetails: matchedDetails, otherProfile: userProfile }

                    sendPush(otherProfile.token, `${username} has Matched and Messaged you!`, message, { type: "message", message: messageDetails })
                }

            });


        } catch (error) {
            console.log("ERROR, there was an error in moving this request and messages to Match", error);
            Sentry.captureMessage(`there was an error in moving this request and messages to Match of ${requestDetails.id} for ${userProfile.id}, ${error.message}`)

        }

    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            {/* <Header title={name} /> */}
            <ChatHeader details={requestDetails} type={"request"} profile={otherProfile} />


            <ScrollView>
                <View>
                    <View style={{ padding: 10, maxWidth: 250, marginRight: "auto", alignSelf: "flex-start", flexDirection: "row" }}>
                        {otherProfile ? (
                            <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }}
                                source={{ uri: otherProfile.images[0] }} />
                        ) : (
                            <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }}
                                source={require("../images/account.jpeg")} />
                        )}
                        <RecieverMessage message={requestDetails} />

                    </View>
                    <View style={{height:700, width:"93%", marginHorizontal:"3.5%"}}>
                    <ProfileCardComponent profile={otherProfile} canFlag={false}/>
                    </View>
                </View>
            </ScrollView>

            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <TouchableOpacity
                    style={styles.swipeButtonCross}
                    onPress={() => setSecondModal(true)}>
                    {/* <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text> */}
                    <Entypo name="cross" size={24} color="red" />
                </TouchableOpacity>
                {otherProfile &&
                    <TouchableOpacity
                        style={styles.swipeButtonHeart}
                        onPress={() => setMessageModalVisible(true)}>
                        {/* <Text style={{ color: "white", fontWeight: "bold" }}>Respond & Match</Text> */}
                        <Entypo name="mail" size={17} color="green" />
                    </TouchableOpacity>}
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isMessageModalVisible}
                onRequestClose={() => {
                    setMessageModalVisible(!isMessageModalVisible);
                }}
            >
                <KeyboardAvoidingView
                    // behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.centeredView}
                // keyboardVerticalOffset={10}
                >
                    {/* <View style={styles.centeredView}> */}
                    <View style={{ bottom: isKeyboardVisible ? "10%" : 0, ...styles.modalView, height:(Platform.OS==="android" && isKeyboardVisible)? "50%": "30%"}}>
                        <Text style={{ padding: 5, fontWeight: "bold", fontSize: 17, textAlign: "center" }}>Reply and Match with {name}</Text>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder={'Send A Reply...'}
                            multiline
                            numberOfLines={5}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", width: "95%", height: "30%" }} />
                        <TouchableHighlight
                            style={{ paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", borderRadius: 10, alignItems: "center", width: "60%", height: "20%", justifyContent: "center" }}
                            onPress={() => {
                                matchThenMove();
                                setMessageModalVisible(!isMessageModalVisible);
                            }}
                        >
                            <Text style={{ color: "white" }}>Match</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", borderRadius: 10, alignItems: "center", width: "60%", height: "20%", justifyContent: "center" }}
                            onPress={() => {
                                setMessageModalVisible(!isMessageModalVisible);
                            }}
                        >
                            <Text style={{ color: "white" }}>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                    {/* </View> */}
                </KeyboardAvoidingView>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={secondModal}
                onRequestClose={() => {
                    setSecondModal(!secondModal);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ padding: 5, fontWeight: "bold", fontSize: 17, textAlign: "center" }}>Are You Sure You Want To Delete This Request? {name} Will Not Be Shown Again.</Text>
                        <TouchableHighlight
                            style={{ paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", borderRadius: 10, width: 120, alignItems: "center", width: "60%", height: "20%", justifyContent: "center" }}
                            onPress={() => {
                                setSecondModal(!secondModal);
                                deleteRequest(requestDetails.id, user.uid).then(() => {
                                    navigation.navigate("ToggleChat", userProfile)
                                });
                            }}
                        >
                            <Text style={{ color: "white" }}>Yes</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", borderRadius: 10, width: 120, alignItems: "center", width: "60%", height: "20%", justifyContent: "center" }}
                            onPress={() => {
                                setSecondModal(!secondModal);
                            }}
                        >
                            <Text style={{ color: "white" }}>No</Text>
                        </TouchableHighlight>
                    </View>
                </View>


            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    formTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#00308F",
        padding: 20
    },
    imagecontainer: {
        height: 440,
        width: "90%",
        borderRadius: 20
    },
    iconcontainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        bottom: 25,
        borderColor: "#00BFFF",
        borderWidth: 2
    },
    cardscontainer: {
        //  flex: 1,
        //  marginTop:-30,
    },
    cardcontainer: {
        backgroundColor: "#00308F",
        // height: 600,
        margin: 10,
        borderRadius: 20,
        // borderColor: "#002D62",
        // borderWidth: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.41,
        elevation: 5
    },
    infocontainer: {
        //  bottom:70 ,
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30
    },
    cardtext: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold"
    },
    text: {
        // position: 'absolute', 
        top: 10,  // This will place the text near the top of the image
        // left: 0,
        // right: 0,
        color: "white",
        fontSize: 22,
        fontWeight: 'bold',
        margin: 3
        // textAlign: 'center',
        // textShadowColor: 'rgba(0, 0, 0, 0.9)', // Shadow color
        // textShadowOffset: { width: -1, height: 1 },
        // textShadowRadius: 9
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background

    },
    modalView: {
        width: "80%",
        // maxHeight: 400,
        maxWidth: "90%",
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
    swipeButtonCross: {
        bottom: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF5864",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 2.41,
        elevation: 5
    },
    swipeButtonHeart: {
        bottom: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#32de84",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.3,
        shadowRadius: 2.41,
        elevation: 5
    },
})

export default RequestMessageScreen
