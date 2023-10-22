import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, TextInput, TouchableHighlight, Image, TouchableOpacity, Text, Modal, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native';
import useAuth from '../hooks/useAuth';
import RecieverMessage from './RecieverMessage';
import { collection, serverTimestamp, updateDoc, doc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import sendPush from '../lib/sendPush';
import { useNavigation, useRoute } from '@react-navigation/core';
import Header from '../Header';
import generateId from '../lib/generateId'
import { Entypo } from '@expo/vector-icons';
import * as Sentry from "@sentry/react";


const RequestMessageScreen = () => {

    const { params } = useRoute();
    const { requestDetails, profile } = params;
    const { user } = useAuth();
    const [isMessageModalVisible, setMessageModalVisible] = useState(false);
    const [secondModal, setSecondModal] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const name = profile ? profile.displayName : "Account User";
    const navigation = useNavigation();
    const batch = writeBatch(db);

    useEffect(() => {
        if (!requestDetails.read) {
            console.log("updating read")
            updateDoc(doc(db, global.users, user.uid, "requests", requestDetails.id), {
                read: true,
            })
        }
    }, [])

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
        const matchDoc = {
            userMatched: [user.uid, requestDetails.id],
            match_timestamp: timestamp,
            latest_message_timestamp: timestamp
        }

        const swipedRef = doc(db, global.users, user.uid, "swipes", requestDetails.id)
        const swipeDoc = {
            id: requestDetails.id,
            message: message,
            timeSwiped: timestamp,
            isResponse: true
            //add boolean variable for isResponse and have onswipe function deal with that
        }

        try {

            batch.set(doc(db, global.matches, id), matchDoc);

            batch.set(swipedRef, swipeDoc);

            batch.delete(doc(db, global.users, user.uid, "requests", requestDetails.id))

            const messageRefOne = doc(collection(db, global.matches, id, "messages"));

            const messageOne = {
                timestamp: requestDetails.timestamp,
                userId: requestDetails.id,
                displayName: profile.displayName,
                message: requestDetails.message,
                read: true,
            }

            batch.set(messageRefOne, messageOne);

            if (message && message !== "") {
                const messageRefTwo = doc(collection(db, global.matches, id, "messages"));

                const messageTwo = {
                    timestamp: timestamp,
                    userId: user.uid,
                    displayName: user.displayName,
                    message: message,
                    read: false,
                }

                batch.set(messageRefTwo, messageTwo);
            }

            // const userSnapshot = await getDoc(doc(db, global.users, user.uid))
            // let userProfile;

            // if (userSnapshot.exists()) {
            //     userProfile = userSnapshot.data();
            //   } else {
            //     console.log('cannot get current user data!');
            //     userProfile = null;
            //   }


            await batch.commit().then(() => {
                console.log("Added match, swipe doc and deleted request doc and messages to match doc");
                // const matchedDetails = { id: requestDetails.id, ...matchDoc };


                navigation.navigate("ToggleChat");

                if (profile.notifications.messages && profile.token && profile.token !== "testing" && profile.token !== "not_granted") {// && userProfile !== null

                    // const messageDetails = { "matchedDetails": matchedDetails, "profile": userProfile };// should be my user profile

                    const userName = user.displayName.split(" ")[0];

                    console.log("user", user)

                    Sentry.captureMessage(`match & move sending message token to ${profile.token}`)
                    // Sentry.captureMessage(`match & move sending message details ${messageDetails}`)
                    Sentry.captureMessage(`match & move sending message from ${userName}`)

                    // console.log(`match & move sending message token to ${profile.token}`)
                    // console.log(`match & move sending message details ${messageDetails}`)
                    // console.log(`match & move sending message from ${userName}`)


                    sendPush(profile.token, `${userName} has Matched and Messaged you!`, message, { type: "match" })
                }

            });


        } catch (error) {
            console.log("ERROR, there was an error in moving this request and messages to Match", error)
        }

    }

    const deleteRequest = async () => {
        // delete doc from Request
        //add id to passedIds containing just id
        try {
            batch.delete(doc(db, global.users, user.uid, "requests", requestDetails.id));


            batch.set(doc(db, global.users, user.uid, "passes", requestDetails.id), {
                id: requestDetails.id
            })

            await batch.commit().then(() => {
                console.log("Request has been deleted from db and user has been moved to passed collection.")
            })

            navigation.navigate("ToggleChat");


        } catch (error) {
            console.log("ERROR, there was an error in deleting request", error)
        }

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <Header title={name} />

            <ScrollView>
            <View>
            <View style={{ padding: 10, maxWidth: 250, marginRight: "auto", alignSelf: "flex-start", flexDirection: "row" }}>
                {/* <Image
                    style={{ height: 50, width: 50, borderRadius: 50 }}
                    source={{ uri: profile.images[0] }}
                /> */}
                {profile ? (
                    <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }}
                        source={{ uri: profile.images[0] }} />
                ) : (
                    <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }}
                        source={require("../images/account.jpeg")} />
                )}
                <RecieverMessage message={requestDetails} />

            </View>

            {profile ? (
                <TouchableOpacity style={styles.cardcontainer} onPress={() => navigation.navigate("ProfileSwipe", { card: profile })}>
                    <View style={{ alignItems: "center", padding: 20 }}>
                        <Text style={{ color: "white", margin:5 }}>Mission: </Text>
                        <Text style={styles.text}>{profile.mission}</Text>
                    </View>
                    <View style={{ justifyContent: "space-evenly", height: 400, width: "100%", backgroundColor: "#002D62" }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: "center" }}>
                            <View style={{ flexDirection: "column" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 20, color: "white", paddingBottom: 5 }}>{profile.displayName}</Text>
                                <Text style={{ color: "white", fontSize: 15 }}>{profile.age}</Text>
                                {profile?.university_student && profile.university_student.status === "active" ? (
                                    <View style={{ flexDirection: "column" }}>
                                        <Text style={{ color: "white", fontSize: 13 }}>{profile.school}</Text>
                                        <Text style={{ color: "#00BFFF", fontWeight: "800", fontSize: 15 }}>WING-U</Text>
                                    </View>
                                ) : (
                                    <Text style={{ color: "white", fontSize: 15 }}>{profile.job}</Text>
                                )}
                            </View>
                            <Image style={{ height: 120, width: 120, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }} source={{ uri: profile?.images[0] }} />
                        </View>
                        {profile?.medals && profile.medals.length > 2 ? (
                            <View style={{ flexDirection: "column", marginLeft:5, marginRight:7}}>
                                <View style={{ flexDirection: "row", padding: 10}}>
                                    <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                    <Text style={styles.cardtext}>{profile.medals[0]}</Text>
                                </View>
                                <View style={{ flexDirection: "row", padding: 10 }}>
                                    <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                    <Text style={styles.cardtext}>{profile.medals[1]}</Text>
                                </View>
                                <View style={{ flexDirection: "row", padding: 10 }}>
                                    <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                    <Text style={styles.cardtext}>{profile.medals[2]}</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={{ flexDirection: "column", width:"100%", alignItems:"center" }}>
                                <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                    <Image style={{ height: 25, width: 20, right: 20 }} source={require("../images/medals_white.png")}></Image>
                                    <Text style={styles.cardtext}>-- --</Text>
                                </View>
                                <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                    <Image style={{ height: 25, width: 20, right: 20 }} source={require("../images/medals_white.png")}></Image>
                                    <Text style={styles.cardtext}>-- --</Text>
                                </View>
                                <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                    <Image style={{ height: 25, width: 20, right: 20 }} source={require("../images/medals_white.png")}></Image>
                                    <Text style={styles.cardtext}>-- --</Text>
                                </View>
                            </View>
                        )}
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                            <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{profile.values[0]}</Text>
                            <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{profile.values[1]}</Text>
                            <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{profile.values[2]}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: "center", flexDirection: "row", width: "100%", padding: 20 }}>
                        <Image style={{ height: 25, width: 10 }} source={require("../images/droppin_white.png")}></Image>
                        <Text style={{ color: "white", fontSize: 15, left: 5 }}>{profile.location}</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "50%" }}>
                    <Text style={{ fontSize: 20 }}>User profile no longer exists</Text>
                </View>
            )}
            </View>
            </ScrollView>

            <View style={{ flexDirection: "row", justifyContent: "space-evenly", top: "3%" }}>
                <TouchableOpacity
                    style={styles.swipeButtonCross}
                    onPress={() => setSecondModal(true)}>
                    {/* <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text> */}
                    <Entypo name="cross" size={24} color="red" />
                </TouchableOpacity>
                {profile &&
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
                    <View style={{ bottom: isKeyboardVisible ? "10%" : 0, ...styles.modalView }}>
                        <Text style={{ padding: 5, fontWeight: "bold", fontSize: 17, textAlign:"center" }}>Reply and Match with {name}</Text>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder={'I love your mission! How can I help?'}
                            multiline
                            numberOfLines={5}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0", width: "95%", height: "30%" }} />
                        <TouchableHighlight
                            style={{ paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", borderRadius: 10, alignItems:"center", width: "60%", height:"20%", justifyContent:"center"}}
                            onPress={() => {
                                matchThenMove();
                                setMessageModalVisible(!isMessageModalVisible);
                            }}
                        >
                            <Text style={{color:"white"}}>Match</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", borderRadius: 10, alignItems:"center", width: "60%", height:"20%", justifyContent:"center"}}
                            onPress={() => {
                                setMessageModalVisible(!isMessageModalVisible);
                            }}
                        >
                            <Text style={{color:"white"}}>Cancel</Text>
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
                        <Text style={{ padding: 5, fontWeight: "bold", fontSize: 17, textAlign:"center" }}>Are You Sure You Want To Delete This Request? {name} Will Not Be Shown Again.</Text>
                        <TouchableHighlight
                            style={{ paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", borderRadius:10, width: 120, alignItems:"center", width: "60%", height:"20%", justifyContent:"center" }}
                            onPress={() => {
                                setSecondModal(!secondModal);
                                deleteRequest();
                            }}
                        >
                            <Text style={{color:"white"}}>Yes</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", borderRadius:10, width: 120, alignItems:"center", width: "60%", height:"20%", justifyContent:"center" }}
                            onPress={() => {
                                setSecondModal(!secondModal);
                            }}
                        >
                            <Text style={{color:"white"}}>No</Text>
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
        borderColor: "#002D62",
        borderWidth: 5,
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
        height: "30%",
        width: "80%",
        maxHeight: 400,
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
