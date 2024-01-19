import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, Image, TouchableOpacity, Text } from 'react-native';
import useAuth from '../hooks/useAuth';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import sendPush from '../lib/sendPush';
import * as Sentry from "@sentry/react";
import Header from '../Header';
import Constants from 'expo-constants';
import ModeratorModal from '../components/ModeratorModal';
import { Ionicons } from '@expo/vector-icons';
import ChatInput from '../components/ChatInput';


const GroupChatScreen = () => {

    const route = useRoute();
    const profile = route.params?.profile;
    const matches = route.params?.matches;
    const requests = route.params?.requests;
    const [input, setInput] = useState();
    const [messages, setMessages] = useState([])
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [swipes, setSwipes] = useState(null)
    const { masterAccount, masterId } = Constants.expoConfig.extra;
    const canModerate = (user.email === masterAccount && user.uid === masterId) ? true : false;
    const [messageToModerate, setMessageToModerate] = useState(null)
    const [isModerateModalVisible, setIsModerateModalVisible] = useState(false);


    const navigation = useNavigation();


    
    useEffect(() => {
        console.log("fetching swipes")
        const unsub = onSnapshot(query(
            collection(db, global.users, user.uid, "swipes"),
            orderBy("timeSwiped", "desc")),
            (snapshot) =>
                setSwipes(
                    snapshot.docs.map((doc) => (
                        {
                            id: doc.id,
                            ...doc.data(),
                        }
                    ))
                )
            ,
            (error) => {
                console.log("there was an error in groupchat screen snapshot for swipes", error)
                Sentry.captureMessage(`error fetching swipes in groupchat screen of ${user.uid}, ${error.message}`)
                alert("Error getting swipes in group chat. Try again later.")

            })

        // setLoading(false);

        return () => {
            unsub();
        };

    }, [db, route.params?.refresh]);

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "groupChat"),
            orderBy("timestamp", "desc")),
            (snapshot) => {
                setMessages(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })
                ))
            },
            (error) => {
                console.log("there was an error in groupchat screen snapshot", error)
                Sentry.captureMessage(`error fetching messages in groupchat screen of ${user.uid}, ${error.message}`)
                alert("Error getting group chat messages. Try again later.")

            })

        setLoading(false);

        return () => {
            unsub();
        };

    }, [db]);

    // useEffect(() => {
    //     if (messages.length > 0 && messages[0].userId !== user.uid && !(messages[0].read)) {
    //         updateDoc(doc(db, global.matches, matchedDetails.id, "messages", messages[0].id), {
    //             read: true,
    //         })
    //     }
    // }, [messages])


    const sendMessage = (type) => {
        const name = profile.displayName
        const timestamp = serverTimestamp();

        try {

            addDoc(collection(db, "groupChat"), {
                timestamp: timestamp,
                userId: user.uid,
                photoURL: profile.images[0],
                displayName: name,
                message: input,
                type: type
            })

            //   updateDoc(doc(db, global.matches, matchedDetails.id), {
            //     latest_message_timestamp: timestamp
            //   })

            //create push notifications, also give option to mute
            //   if (userProfile && otherProfile?.notifications && otherProfile.notifications.messages && otherProfile.token && otherProfile.token !== "testing" && otherProfile.token !== "not_granted") {

            // const messageDetails = { "matchedDetails": matchedDetails, "otherProfile": userProfile }

            // Sentry.captureMessage(`sending message from ${name}`)
            // Sentry.captureMessage(`sending message to ${otherProfile.displayName} with token ${otherProfile.token}`)

            // sendPush(otherProfile.token, `New Message from ${name}`, input, { type: "message", message: messageDetails })

            //   }
        } catch (error) {
            console.log("ERROR, there was an error in sending a message to groupchat", error);
            Sentry.captureMessage(`there was an error in sending a message to groupchat ${error.message} for ${user.uid}}`)
            alert("Error sending message. Try again later.")

        }

        setInput("");

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <Header style={{ marginHorizontal: "22%" }} title={"Community"} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={10}>

                {!loading &&
                    <TouchableWithoutFeedback
                    // onPress={Keyboard.dismiss()}
                    >

                        <FlatList
                            data={messages}
                            style={{}}
                            inverted={-1}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item: message }) =>
                                message.userId === user.uid ? (
                                    <SenderMessage key={message.id} message={message} />
                                ) : (
                                    <View style={{ padding: 10, maxWidth: 250, marginRight: "auto", alignSelf: "flex-start", flexDirection: "row" }}>
                                        {/* {message && message?.userId && message?.photoURL && message.displayName ? ( */}
                                        
                                        <TouchableOpacity style={{ flexDirection: "column", alignItems: "center", paddingBottom: 20 }} onPress={() => navigation.navigate("GCProfileView", { profileId: message.userId, swipes: swipes, matches: matches, requests: requests })}>
                                            <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF", bottom: 10 }}
                                                source={{ uri: message.photoURL }} />
                                            <Text style={{ fontWeight: "bold" }}>{message.displayName}</Text>
                                        </TouchableOpacity>
                                        {/* ) : (
                                            <TouchableOpacity>
                                                <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }}
                                                    source={require("../images/account.jpeg")} />
                                                <Text>User</Text>

                                            </TouchableOpacity>

                                        )} */}

                                        {canModerate ? (
                                             <TouchableOpacity style={{paddingBottom:20}} onPress={()=>{
                                                setMessageToModerate(message);
                                                setIsModerateModalVisible(true);
                                                }}>
                                                <RecieverMessage key={message.id} message={message} />
                                             </TouchableOpacity>
                                        ):(
                                            <RecieverMessage key={message.id} message={message} />
                                        )}
                                       

                                    </View>
                                )
                            }
                        />

                    </TouchableWithoutFeedback>
                }
                {/* <View style={{flexDirection:"row", justifyContent:"flex-end", bottom:10, padding:10}}>
        <TouchableOpacity style={styles.missionControl} onPress={()=>navigation.navigate("MissionControl")}>
                <Entypo name="aircraft-take-off" size={30} color="blue"/>
        </TouchableOpacity>
    </View> */}


                {/* <View
                    style={{ flexDirection: "row", borderColor: "grey", borderWidth: 2, borderRadius: 10, alignItems: "center", margin: 5 }}>
                        <TouchableOpacity onPress={()=>console.log("access pictures")}>
                    <Ionicons name="image-outline" size={20} color="#00308F" />
                    </TouchableOpacity>
                    <TextInput
                        style={{ height: 50, width: "80%", fontSize: 15, padding: 10, paddingTop: 15 }}
                        placeholder="Send Message..."
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        placeholderTextColor={"grey"}
                        multiline={true}
                        numberOfLines={5}
                        value={input}
                    />
                    <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 20 }}>
                        <Text style={{ color: "#00BFFF", fontSize: 15 }}>Send</Text>
                    </TouchableOpacity>
                </View> */}
                <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} fileLocation={"groupChat"}/>
            </KeyboardAvoidingView>
            <ModeratorModal isVisible={isModerateModalVisible} setIsVisible={setIsModerateModalVisible} message={messageToModerate}/>
        </SafeAreaView>
    )
}

export default GroupChatScreen
