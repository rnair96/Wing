import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, TextInput, Button, KeyboardAvoidingView, FlatList, Image } from 'react-native';
import useAuth from '../hooks/useAuth';
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../Header';
import Constants from 'expo-constants';
import * as Sentry from "@sentry/react";
import RecieverMessage from './RecieverMessage';
import ChatInput from '../components/ChatInput';


const AnnouncementScreen = ({profile}) => {

    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState(null);
    const [title, setTitle] = useState(null);

    // const { masterAccount, masterId } = Constants.expoConfig.extra

    // const canInput = (user.email === masterAccount && user.uid === masterId) ? true : false;

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, global.announcements),
            orderBy("timestamp", "desc")),
            (snapshot) => {
                setMessages(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })
                ))
            },
            (error) => {
                console.log("there was an error in announcements snapshot", error)
                Sentry.captureMessage(`error getting announcements snapshot for ${user.uid}, ${error.message}`)

            })

        setLoading(false);

        return () => {
            unsub();
        };

    }, [db]);

    // useEffect(() => {
    //     if (messages.length > 0 && !messages[0].read) {
    //         updateDoc(doc(db, global.users, user.uid, "announcements", messages[0].id), {
    //             read: true
    //         }).then(() => {
    //             console.log("updating latest announcement as read")
    //         }).catch((error) => {
    //             console.log("error updating announcement as read", error)
    //             Sentry.captureMessage(`Error updating latest announcement read for ${user.uid}, ${error.message}`)
    //         })
    //     }
    // }, [messages])


    //should make message, pic and link - just one field : content
    const sendMessage = (type) => {
        let messageTitle;
        if (type === "image") {
            messageTitle = "Wing Community shared an Image"
        } else if (type === "link") {
            messageTitle = "Wing Community shared a Link"
        } else {
            messageTitle = title;
        }

        const timestamp = serverTimestamp();
        addDoc(collection(db, global.announcements), {
            title: messageTitle,
            displayName: profile.displayName,
            photoURL: profile.images[0],
            userId: user.uid,
            message: input,
            timestamp: timestamp,
            type: type
        }).catch((error) => {
            console.log("error sending announcement", error)
            alert("Error sending announcement.")
            Sentry.captureMessage(`Error sending announcement, ${error.message}`)
        })

        setInput("");
        setTitle("")

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <Header title={"News & Events"} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={10}>

                {!loading &&

                    <FlatList
                        data={messages}
                        style={{}}
                        inverted={-1}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item: message }) =>

                            <View style={{ padding: 10, maxWidth: "80%", marginRight: "auto", alignSelf: "flex-start", flexDirection: "row" }}>
                                <Image
                                    style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: "white", borderWidth: 1, borderColor: "#00BFFF" }}
                                    source={require("../images/darkbluelogocorrect.png")}
                                />
                                <RecieverMessage key={message.id} message={message} />
                            </View>
                        }
                    />

                }
                {/* {canInput && */}
                    <View style={{ alignItems: "center"}}>
                        <TextInput
                            style={{ height: 50, width: "80%", fontSize: 15, padding: 10, borderBottomWidth: 2, borderTopWidth:2, borderColor: "grey" }}
                            placeholder="Set Announcement Title"
                            onChangeText={setTitle}
                            onSubmitEditing={sendMessage}
                            placeholderTextColor={"grey"}
                            value={title}
                        />
                        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} fileLocation={"announements"}/>
                    </View>
                {/* } */}
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default AnnouncementScreen
