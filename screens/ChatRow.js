import { useNavigation } from '@react-navigation/native'
import { onSnapshot, orderBy, query, collection, limit } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import UnreadHighlighter from '../components/UnreadHighlighter';
import getTime from '../lib/getTime';
import * as Sentry from "@sentry/react";


const ChatRow = ({ matchedDetails, profile }) => {

    const { user } = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState();
    const [read, setRead] = useState(true);
    const [timestamp, setTimeStamp] = useState(null);
    const [name, setName] = useState("Account User");
    const [otherProfilePic, setOtherProfilePic] = useState(null);
    const [otherProfile, setOtherProfile] = useState(null);
    const navigator = useNavigation();


    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchedDetails.userMatched, user.uid));
    }, [matchedDetails, user]);


    const setVars = (data) => {
        if(data && data?.likes && data?.likes.length > 0 && data?.userId === user.uid){
            setLastMessage("Your Message Was Liked")
        } else if (data && data?.likes && data?.likes.length > 0 && data?.userId !== user.uid){
            setLastMessage("Their Message Was Liked")
        } else if (data && (!data?.type || data?.type==="text") && data?.message?.length > 15) {
            const message = data?.message?.slice(0, 15) + "..."
            setLastMessage(message);
        } else if (data && (!data?.type || data?.type==="text")) {
            setLastMessage(data?.message)
        } else if (data && data?.type==="image"){
            setLastMessage("Image Shared")
        } else if (data && data?.type==="link"){
            setLastMessage("Link Shared")
        } else {
            setLastMessage(data?.message)
        }

        if (data && data?.timestamp) {
            let milliseconds = data?.timestamp.seconds * 1000 + Math.floor(data?.timestamp.nanoseconds / 1000000);
            const time = getTime(new Date(milliseconds))
            setTimeStamp(time);
        }

        if (data && data?.userId !== user.uid) {
            setRead(data.read);
        } else if (data && data?.userId === user.uid) {
            setRead(true);
        } else {
            setRead(false);
        }
    }

    useEffect(() => {

        const unsub = onSnapshot(query(collection(db, global.matches, matchedDetails.id, "messages"),
            orderBy("timestamp", "desc"), limit(1)), (snapshot) =>
            setVars(snapshot.docs[0]?.data())
            ,
            (error) => {
                console.log("there was an error in chatrow snapshot", error)
                Sentry.captureMessage(`error getting chatrow snapshot for ${matchedDetails?.id}, ${error.message}`)
            }
        )

        return () => {
            unsub();
        };

    }, [matchedDetails, db]);


    useEffect(() => {
        async function fetchData() {
            if (matchedUserInfo) { 

                const other_user_snapshot = await getDoc(doc(db, global.users, matchedUserInfo))
                .catch((error)=>{
                    console.log("there was an error in fetching other user data in chatrow", error)
                    Sentry.captureMessage(`error fetching other user data in chatrow ${matchedUserInfo}, ${error.message}`)
                });

                if (other_user_snapshot.exists && other_user_snapshot.data()?.displayName) { // check if the document exists
                    setName(other_user_snapshot.data().displayName);
                    setOtherProfilePic(other_user_snapshot.data().images[0]);
                    setOtherProfile(other_user_snapshot.data());

                } else {
                    console.log("No such document!", matchedUserInfo);
                }
            } 
            
        }

        fetchData();

    }, [matchedUserInfo, db])

    //add useEffect that fetches user info from id and pass it into params

    return (
            <View style={{ padding: 10, width: "95%" }}>
                <TouchableOpacity style={styles.container} onPress={() => navigator.navigate("Message", {
                    matchedDetails, otherProfile, profile
                })}>
                    {otherProfilePic ? (
                        <Image style={{ height: 60, width: 60, borderRadius: 50, borderWidth: !read ? 3 : 1, borderColor: "#00BFFF" }}
                            source={{ uri: otherProfilePic }} />
                    ) : (
                        <Image style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }} source={require("../images/account.jpeg")} />
                    )
                    }
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 20, paddingLeft: 10, paddingBottom: 5 }}>{name}</Text>
                            {!read ? (
                                <Text style={{ paddingLeft: 10, fontWeight: "bold" }}>{lastMessage || "Say Hi!"}</Text>
                            ) : (
                                <Text style={{ paddingLeft: 10 }}>{lastMessage || "Say Hi!"}</Text>
                            )}
                        </View>
                        <View style={{ position: "absolute", left: 170, top: 20, flexDirection: "row" }}>
                            <Text style={{ fontSize: 10 }}>{timestamp || "New Match"}</Text>
                            {!read && <UnreadHighlighter />}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
    )


}

const styles = StyleSheet.create({
    container: {
        left: 15,
        flexDirection: "row",
        // backgroundColor: "#00308F",
        backgroundColor: "white",
        alignItems: "center",
        padding: 5,
        borderBottomWidth:1,
        borderColor:"#E0E0E0"
        // shadowColor: "#000",
        // borderRadius: 15,
        // shadowOffset: {
        //     width: 0,
        //     height: 3
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 2.41,
        // elevation: 5
    }
})


export default ChatRow
