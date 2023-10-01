import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, TextInput, Button, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, Image } from 'react-native';
import ChatHeader from '../components/ChatHeader';
import useAuth from '../hooks/useAuth';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import sendPush from '../lib/sendPush';
import Header from '../Header';
import Constants from 'expo-constants';


const AnnouncementScreen = () => {

    const { user } = useAuth();
    // const {params} = useRoute();
    // const profile = params;
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState(null);
    const [title, setTitle] = useState(null);
    const { masterAccount, masterAccount2 } = Constants.expoConfig.extra

    const canInput = (user.email === masterAccount || user.email === masterAccount2) ? true : false;

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "announcements"),
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
            })

        setLoading(false);

        return () => {
            unsub();
        };

    }, [db]);

    // useEffect(() => {
    //     if (messages.length > 0 && profile && messages[0].id !== profile?.latest_read_announcement) {
    //       updateDoc(doc(db, global.users, user.uid), {
    //         latest_read_announcement: messages[0].id,
    //       })
    //       console.log("updating latest announcement as read")
    //     }
    //   }, [messages])


    const sendMessage = () => {
        const timestamp = serverTimestamp();
        addDoc(collection(db, "announcements"), {
            title: title,
            message: input,
            timestamp: timestamp,
        })

        setInput("");
        setTitle("")

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            {/* <ChatHeader matchedDetails={matchedDetails} profile={profile} /> */}
            <Header title={"Announcements"} />

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

                            <View style={{ padding: 10, maxWidth: 250, marginRight: "auto", alignSelf: "flex-start", flexDirection: "row" }}>
                                <Image
                                    style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: "#00BFFF" }}
                                    source={require("../images/logo.png")}
                                />
                                <RecieverMessage key={message.id} message={message} />
                            </View>
                        }
                    />

                }
                {canInput &&
                    <View
                        style={{ borderColor: "#E0E0E0", borderWidth: 2, borderRadius: 10, alignItems: "center" }}>
                        <TextInput
                            style={{ height: 50, width: "80%", fontSize: 15, padding: 10, color: "white", borderBottomWidth:2, borderColor: "#E0E0E0"}}
                            placeholder="Set Announcement Title"
                            onChangeText={setTitle}
                            onSubmitEditing={sendMessage}
                            placeholderTextColor={"#E0E0E0"}
                            value={title}
                        />
                        <TextInput
                            style={{ height: 100, width: "80%", fontSize: 15, padding: 10, color: "white" ,borderBottomWidth:2, borderColor: "#E0E0E0"}}
                            placeholder="Enter Announcement..."
                            onChangeText={setInput}
                            onSubmitEditing={sendMessage}
                            placeholderTextColor={"#E0E0E0"}
                            multiline
                            numberOfLines={5}
                            value={input}
                        />
                        <Button onPress={sendMessage} title="Send" color="#00BFFF" />
                    </View>
                }
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default AnnouncementScreen
