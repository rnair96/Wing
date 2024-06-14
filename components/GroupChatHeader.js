import React, { Component, useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';



const GroupChatHeader = ({ profile }) => {
    const navigator = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [secondModal, setSecondModal] = useState(false);
    const [option, setOption] = useState(null)
    const { welcomeImage1, welcomeImage2 } = Constants.expoConfig.extra;
    const [messageNotifications, setMessageNotifications] = useState(false);
    const [announcementNotifications, setAnnouncementNotifications] = useState(false);
    const [groupChatNotifications, setGroupChatNotifications] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(false);

    //call useEffect to update Mute state
    useEffect(() => {
        if (profile) {

            if (profile?.notifications && profile.notifications?.messages !== undefined && profile.notifications?.messages !== null) {
                setMessageNotifications(profile.notifications.messages);
            }

            if (profile?.notifications && profile.notifications?.events !== undefined && profile.notifications?.announcements !== null) {
                setAnnouncementNotifications(profile.notifications.announcements);
            }

            if (profile?.notifications && profile.notifications?.groupchat !== undefined && profile.notifications?.groupchat !== null) {
                setGroupChatNotifications(profile.notifications.groupchat);
            }

            if (profile?.notifications && profile.notifications?.emails !== undefined && profile.notifications?.emails !== null) {
                setEmailNotifications(profile.notifications.emails);
            }
        }

    }, [profile])


    const editNotifications = () => {
        if (groupChatNotifications) {
            updateDoc(doc(db, global.users, profile.id), {
                notifications: { "messages": messageNotifications, "announcements": announcementNotifications, "groupchat": false, "emails": emailNotifications },
            }).then(() => {
                console.log("Group Chat Muted")
                alert("Group Chat Muted.")
            }).catch((error) => {
                console.log("there was an error", error.message);
                Sentry.captureMessage("error at setting notifications", error.message)
                alert("Error saving edits. Try again later.")
            });
            setModalVisible(!modalVisible)
        } else {
                updateDoc(doc(db, global.users, profile.id), {
                    notifications: { "messages": messageNotifications, "announcements": announcementNotifications, "groupchat": true, "emails": emailNotifications },
                }).then(() => {
                    console.log("Group Chat Unmuted.")
                    alert("Group Chat Unmuted")
                }).catch((error) => {
                    console.log("there was an error", error.message);
                    Sentry.captureMessage("error at setting notifications", error.message)
                    alert("Error saving edits. Try again later.")
                });
                setModalVisible(!modalVisible)
        }
    }


    return (
        <View style={{ flexDirection: "row", justifyContent: 'space-evenly', backgroundColor: "white", paddingBottom: 5, borderBottomWidth: 1, borderColor: "#E0E0E0", margin: 5 }}>
            <TouchableOpacity onPress={() => navigator.goBack()} style={{ padding: 2 }}>
                <Ionicons name="chevron-back-outline" size={34} color="#00308F" />
            </TouchableOpacity>
            <View style={{ paddingVertical: 2, flexDirection: "row", marginHorizontal: "25%", left: "4%" }}>
                <Image style={{ height: 40, width: 40, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }} source={require("../images/darkbluelogocorrect.png")} />
                <Text style={{ padding: 10, fontWeight: "bold", fontSize: 12 }}> Community </Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ padding: 2, flexDirection: "row" }}>
                <Ionicons name="menu" size={34} color="#00308F" />
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* Mute Notifications */}

                        {/* Unmatch function */}

                        <Text style={{ padding: 20, fontWeight: "bold", fontSize: 20 }}>Community Chat Options</Text>

                        <TouchableHighlight
                            style={styles.opacityStyle}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setOption("rules");
                                setSecondModal(true);
                            }}
                        >
                            <Text style={styles.textStyle}>Chat Rules</Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                            style={styles.opacityStyle}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setOption("story");
                                setSecondModal(true);
                            }}
                        >
                            <Text style={styles.textStyle}>Our Story & Mission</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.opacityStyle}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                navigator.navigate("Workshop");
                            }}
                        >
                            <Text style={styles.textStyle}>Dating Workshop</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.opacityStyle}
                            onPress={() => {
                                editNotifications();
                            }}
                        >
                            <Text style={styles.textStyle}>{groupChatNotifications ? ("Mute Notifications") : ("Unmute Notifications")}</Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                            style={styles.opacityStyle}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableHighlight>

                    </View>
                </View>
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
                    <View style={{ ...styles.modalView, width: "70%" }}>
                        <Text style={{ padding: 12, fontWeight: "bold", fontSize: 17, textAlign: "center" }}>{option === "rules" ? "Chat Rules" : "Our Story & Mission"}</Text>
                        {option === "rules" ? (
                            <ScrollView style={{ padding: 5, borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: "grey", margin: 10 }}>
                                <Text style={{ fontWeight: "bold", padding: 5 }}>Failure to follow the rules below will lead to your message being removed from the Chat and your account getting flagged. </Text>
                                {/* <Text style={{ fontWeight: "bold", padding: 5 }}>Flagged accounts are blocked from engaging in the app until the flag is resolved by reaching out to our support team.</Text> */}
                                <View style={{ borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: "#00BFFF", margin: 5 }}>
                                    <Text style={styles.boldtext}>1. Be Respectful {`(Consensual Teasing/Roasting Is Fine But No Discrimination Or Bullying Is Tolerated)`}</Text>
                                    <Text style={styles.boldtext}>2. Use Appropriate Language {`(No Excessive Swearing)`}</Text>
                                    <Text style={styles.boldtext}>3. No Spamming/Advertising or Promotions</Text>
                                    <Text style={styles.boldtext}>4. Do Not Share Yours or Other's Personal Info</Text>
                                    <Text style={styles.boldtext}>5. Do Not Share Illegal Content, Activities or Encourage Criminal Behavior</Text>
                                </View>
                                <Text style={{ fontWeight: "bold", padding: 5 }}>If you witness any rule breaking from other members, you can anonymously flag inappropriate behavior by clicking on their profile picture.</Text>
                            </ScrollView>
                        ) : (
                            <ScrollView style={{ padding: 5, borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: "grey", margin: 10 }}>
                                <View style={{ width: "100%", alignItems: "center" }}>
                                    <Image style={{ height: 150, width: 150, borderRadius: 20, borderWidth: 1, borderColor: "#00BFFF" }} source={{ uri: welcomeImage1 }} />
                                </View>
                                <Text style={styles.boldtext}>Hey Wing, Raj and Darren here!</Text>
                                <Text style={styles.boldtext}>Here's a little about us:</Text>
                                <Text style={styles.boldtext}>First we were lifting buddies at the gym, then we were Wingmen exploring the nightlife in DC, and then afterwards we became business partners passionate about solving massive problems in the world.</Text>
                                <Text style={styles.boldtext}>It was through our friendship and our mission that led us to the creation of Wing.</Text>
                                <View style={{ width: "100%", alignItems: "center" }}>
                                    <Image style={{ height: 150, width: 150, borderRadius: 20, borderWidth: 1, borderColor: "#00BFFF" }} source={{ uri: welcomeImage2 }} />
                                </View>
                                <Text style={styles.boldtext}>The mission of Wing is to help men create an inspiring network of friends that help each other become the best version of ourselves.</Text>
                                <Text style={styles.boldtext}>This is a community built on respect, teamwork and acts of service towards our fellow Wing.</Text>
                                <Text style={styles.boldtext}>So when in doubt on this app, ask yourself - “How can I be of service today?”</Text>
                                <Text style={styles.boldtext}>If you'd like a chance to connect and get a tip on how to meet great Wings here, see our Chat Request in your Requests screen!</Text>
                            </ScrollView>
                        )}
                        <TouchableHighlight
                            style={styles.opacityStyle}
                            onPress={() => {
                                setSecondModal(!secondModal);
                            }}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
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
        height: "65%",
        width: "70%",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
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
    boldtext: {
        fontSize: 14,
        fontWeight: "bold",
        padding: 5,
        margin: 10,
        // fontFamily:"Calibri"
    },
    opacityStyle: {
        paddingVertical: 5,
        paddingHorizontal: 30,
        backgroundColor: "#00308F",
        width: "90%",
        height: "15%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10
    }
})

export default GroupChatHeader