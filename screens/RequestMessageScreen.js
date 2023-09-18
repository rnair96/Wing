import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, TextInput, Button, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, Image, TouchableOpacity, Text } from 'react-native';
import ChatHeader from '../components/ChatHeader';
import useAuth from '../hooks/useAuth';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query, updateDoc, doc, writeBatch, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import sendPush from '../lib/sendPush';
import { useNavigation, useRoute } from '@react-navigation/core';
import Header from '../Header';
import generateId from '../lib/generateId'

const RequestMessageScreen = () => {

    const { params } = useRoute();
    const { requestDetails, profile } = params;
    const { user } = useAuth();
    const navigation = useNavigation();

    const matchThenMove = async () => {
        const id = generateId(user.uid, requestDetails.id)
        const timestamp = serverTimestamp();
        const matchDoc = {
            id: id,
            userMatched: [user.uid, requestDetails.id],
            match_timestamp: timestamp,
            latest_message_timestamp: timestamp
        }

        const swipedRef = doc(db, global.users, user.uid, "swipes", requestDetails.id)
        const swipeDoc = {
            id:requestDetails.id
        }
        const batch = writeBatch(db);

        try {
        
            batch.set(doc(db, global.matches, id),matchDoc);

            batch.set(swipedRef, swipeDoc);

            batch.delete(doc(db, global.users, user.uid, "requests", requestDetails.id))

            await batch.commit().then(()=>{
                console.log("Added match and swipe doc and deleted request doc")
            })

            await addDoc(collection(db, global.matches, id, "messages"), {
                timestamp: requestDetails.timestamp,
                userId: requestDetails.id,
                displayName: profile.displayName,
                message: requestDetails.message,
                read: true,
            }).then(() => {
                console.log("Message has been moved over to match.")
            })

            //send push notification

            navigation.navigate("Message", { matchDoc, profile });

        } catch (error) {
            console.log("ERROR, there was an error in moving this request to Match", error)
        }

    }

    const deleteRequest = async () => {
        // delete doc from Request
        //add id to passedIds containing just id
        try {
            await deleteDoc(doc(db, global.users, user.uid, "requests", requestDetails.id)).then(() => {
                console.log("Request has been deleted successfully from DB.")
            })

            await setDoc(doc(db, global.users, user.uid, "passes", requestDetails.id), {
                id: requestDetails.id
            }).then(() => {
                console.log("Requesting user has been moved to passed collection.")
            });

            navigation.navigate("ToggleChat");


        } catch (error) {
            console.log("ERROR, there was an error in deleting request", error)
        }

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <Header title={profile.displayName} />


            <View style={{ padding: 10, maxWidth: 250, marginRight: "auto", alignSelf: "flex-start", flexDirection: "row" }}>
                <Image
                    style={{ height: 50, width: 50, borderRadius: 50 }}
                    source={{ uri: profile.images[0] }}
                />
                <RecieverMessage message={requestDetails} />

            </View>

            <TouchableOpacity style={styles.cardcontainer} onPress={() => navigation.navigate("ProfileSwipe", { card: profile })}>
                <View style={{ alignItems: "center", padding: 20 }}>
                    <Text style={{ color: "white" }}>Mission: </Text>
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
                    <View style={{ flexDirection: "column" }}>
                        <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                            <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                            <Text style={styles.cardtext}>{profile.medals[0]}</Text>
                        </View>
                        <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                            <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                            <Text style={styles.cardtext}>{profile.medals[1]}</Text>
                        </View>
                        <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                            <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                            <Text style={styles.cardtext}>{profile.medals[2]}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                        <Text style={{ borderWidth: 0.5, borderColor: "white", borderRadius: 10, color: "white", padding: 5 }}>{profile.values[0]}</Text>
                        <Text style={{ borderWidth: 0.5, borderColor: "white", borderRadius: 10, color: "white", padding: 5 }}>{profile.values[1]}</Text>
                        <Text style={{ borderWidth: 0.5, borderColor: "white", borderRadius: 10, color: "white", padding: 5 }}>{profile.values[2]}</Text>
                    </View>
                </View>
                <View style={{ justifyContent: "center", flexDirection: "row", width: "100%", padding: 20 }}>
                    <Image style={{ height: 25, width: 10 }} source={require("../images/droppin_white.png")}></Image>
                    <Text style={{ color: "white", fontSize: 15, left: 5 }}>{profile.location}</Text>
                </View>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <View
                    style={{ borderColor: "#E0E0E0", borderWidth: 2, borderRadius: 10, alignItems: "center", justifyContent: "center", padding: 20, bottom: 10, backgroundColor: "red", width: "50%" }}>
                    <TouchableOpacity onPress={deleteRequest}>
                        <Text style={{ color: "white" }}>Delete</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderColor: "#E0E0E0", borderWidth: 2, borderRadius: 10, alignItems: "center", justifyContent: "center", padding: 20, bottom: 10, backgroundColor: "#00BFFF", width: "50%" }}>
                    <TouchableOpacity onPress={matchThenMove}>
                        <Text style={{ color: "white" }}>Match & Respond</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        borderRadius: 20,
        borderColor: "#002D62",
        borderWidth: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
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
        fontSize: 24,
        fontWeight: 'bold',
        // textAlign: 'center',
        // textShadowColor: 'rgba(0, 0, 0, 0.9)', // Shadow color
        // textShadowOffset: { width: -1, height: 1 },
        // textShadowRadius: 9
    }
})

export default RequestMessageScreen
