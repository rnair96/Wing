import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, TextInput, Button, KeyboardAvoidingView, FlatList, Image} from 'react-native';
import useAuth from '../hooks/useAuth';
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../Header';
import Constants from 'expo-constants';
import AnnouncementImageUpload from '../components/AnnouncementImageUpload';
import AnnouncementRecieverMessage from './AnnouncementRecieverMessage';
import * as Sentry from "@sentry/react";


const AnnouncementScreen = () => {

    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState(null);
    const [title, setTitle] = useState(null);
    const [inputOptions, setInputOptions] = useState(false);
    const [picture, setPicture] = useState(null);
    const [link, setLink] = useState(null);



    const { masterAccount, masterId } = Constants.expoConfig.extra

    const canInput = (user.email === masterAccount && user.uid === masterId) ? true : false;

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, global.users, user.uid, "announcements"),
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

    useEffect(() => {
        if (messages.length > 0 && !messages[0].read) {
            updateDoc(doc(db, global.users, user.uid, "announcements", messages[0].id), {
                read: true
            }).then(()=>{
                console.log("updating latest announcement as read")
            }).catch((error)=>{
                console.log("error updating announcement as read", error)
                Sentry.captureMessage(`Error updating latest announcement read for ${user.uid}, ${error.message}`)
            })
        }
    }, [messages])


    //should make message, pic and link - just one field : content
    const sendMessage = () => {
        const timestamp = serverTimestamp();
        addDoc(collection(db, global.announcements), {
            title: title,
            message: input,
            timestamp: timestamp,
            type: "text"
        }).catch((error)=>{
            console.log("error sending announcement", error)
            alert("Error sending announcement.")
            Sentry.captureMessage(`Error sending announcement, ${error.message}`)
        })

        setInput("");
        setTitle("")

    }

    const addPicture = () => {
        console.log("add picture", picture)
        setPicture(null)

        const timestamp = serverTimestamp();
        addDoc(collection(db, global.announcements), {
            title: "News & Promos sent an Image",
            message: "",
            picture: picture,
            timestamp: timestamp,
            type: "image"
        }).catch((error)=>{
            console.log("error adding picture in announcement", error)
            alert("Error adding picture in announcement.")
            Sentry.captureMessage(`Error adding picture in announcement, ${error.message}`)
        })
    }

    const addLink = () => {
        console.log("add link", link);
        setLink(null);

        const timestamp = serverTimestamp();
        addDoc(collection(db, global.announcements), {
            title: "News & Promos sent a link",
            message: "",
            url: link,
            timestamp: timestamp,
            type: "link"
        }).catch((error)=>{
            console.log("error sending link in announcement", error)
            alert("Error sending link in announcement.")
            Sentry.captureMessage(`Error sending link in announcement, ${error.message}`)
        })
    }

    const setOptions = () =>{
        console.log("setting options to",!inputOptions)
        setInputOptions(!inputOptions)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <Header title={"News & Promos"} />

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
                                    style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: "#00308F", borderWidth: 1, borderColor: "#00BFFF" }}
                                    source={require("../images/whitelogo.png")}
                                />
                                    <AnnouncementRecieverMessage key={message.id} message={message} />
                            </View>
                        }
                    />

                }
                {canInput &&
                    <View
                        style={{ borderColor: "grey", borderWidth: 2, borderRadius: 10, margin: 5 }}>
                        {/* <Button onPress={console.log("link function")} title="Add Link" color="#00BFFF" />
                        <Button onPress={console.log("action function")} title="Add Action" color="#00BFFF" /> */}
                        {inputOptions ? (
                            <View style={{ alignItems: "center" }}>
                                <AnnouncementImageUpload url={picture} setURL={setPicture}/>
                                <TextInput
                                    style={{ height: 50, width: "80%", fontSize: 15, padding: 10, borderBottomWidth: 2, borderColor: "grey" }}
                                    placeholder="Give Link"
                                    onChangeText={setLink}
                                    onSubmitEditing={addLink}
                                    placeholderTextColor={"grey"}
                                    value={link}
                                />
                                <Button onPress={addPicture} title="Send Picture" color="#00BFFF" />
                                <Button onPress={addLink} title="Send Link" color="#00BFFF" />
                                <Button onPress={setOptions} title="Return to Text" color="#00BFFF" />
                            </View>
                        ) : (
                            <View style={{ alignItems: "center" }}>
                                <TextInput
                                    style={{ height: 50, width: "80%", fontSize: 15, padding: 10, borderBottomWidth: 2, borderColor: "grey" }}
                                    placeholder="Set Announcement Title"
                                    onChangeText={setTitle}
                                    onSubmitEditing={sendMessage}
                                    placeholderTextColor={"grey"}
                                    value={title}
                                />
                                <TextInput
                                    style={{ height: 100, width: "80%", fontSize: 15, padding: 10, borderBottomWidth: 2, borderColor: "grey" }}
                                    placeholder="Enter Announcement..."
                                    onChangeText={setInput}
                                    onSubmitEditing={sendMessage}
                                    placeholderTextColor={"grey"}
                                    multiline
                                    numberOfLines={10}
                                    value={input}
                                />
                                <Button onPress={setOptions} title="Message Options" color="#00BFFF" />
                                <Button onPress={sendMessage} title="Send Message" color="#00BFFF" />
                            </View>
                        )}

                    </View>
                }
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default AnnouncementScreen
