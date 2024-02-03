import { useNavigation } from '@react-navigation/native'
import { onSnapshot, orderBy, query, collection, limit } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import UnreadHighlighter from '../components/UnreadHighlighter';
import getTime from '../lib/getTime';
import * as Sentry from "@sentry/react";


const GroupChatRow = ({profile, matches, requests}) => {

    const { user } = useAuth();
    const [lastMessage, setLastMessage] = useState(null);
    const [read, setRead] = useState(true);
    const [userMessaged, setUserMessaged] = useState("User: ")
    const [loadingMessage, setLoadingMessage] = useState(true);
    const [timestamp, setTimeStamp] = useState();
    const navigator = useNavigation();


    const setVars = (data) => {
        setRead(true);
        
        if (data && data?.type==="text" &&  data?.message?.length > 7) {
            const message = data?.message?.slice(0, 7) + "..."
            setLastMessage(message);
        } else if (data && data?.type==="text") {
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

        if(data && data?.displayName){
            setUserMessaged(`${data.displayName}: `)
        }

        if(data && data?.taggedId && data?.taggedId===user.uid && data?.displayName){
            setUserMessaged(``);
            if(data?.tagType && data.tagType==="tag"){
                setLastMessage(`${data.displayName} Tagged You`);
            } else {
                setLastMessage(`${data.displayName} Replied To You`);
            }
            setRead(false);

        }

        if(data && data?.title){
            setUserMessaged(``);
            setLastMessage("New Announcement")
            setRead(false)
        }

        setLoadingMessage(false);
    }

    useEffect(() => {
        //could limit this snapshot to just one document
        const unsub = onSnapshot(query(collection(db, "groupChat"),
            orderBy("timestamp", "desc"), limit(1)), (snapshot) =>
            setVars({
                id: snapshot.docs[0]?.id,
                ...snapshot.docs[0]?.data()})
            ,
            (error) => {
                console.log("there was an error in groupchat snapshot", error)
                Sentry.captureMessage(`error getting groupchat row data for ${user.uid}, ${error.message}`)
                
            }
        )

        return () => {
            unsub();
        };

    }, [db]);

    return (
        !loadingMessage && (
            <View style={{ padding: 10, width: "95%" }}>
                <TouchableOpacity style={styles.container} onPress={() => navigator.navigate("GroupChat", {profile, matches, requests})}>
                        <Image style={{ height: 60, width: 60, borderRadius: 50, backgroundColor: "white", borderWidth: 1, borderColor: "#00BFFF"}} source={require("../images/bizdudes.jpg")} />
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 15, paddingLeft: 5, paddingBottom: 5 }}>Community</Text>
                            <Text style={{ paddingLeft: 10, fontWeight: "bold" }}>{userMessaged}{lastMessage}</Text>
                        </View>
                        <View style={{ position: "absolute", left: 170, top: 20, flexDirection: "row" }}>
                            <Text style={{ fontSize: 10}}>{timestamp}</Text>
                            {!read && <UnreadHighlighter />}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    )


}

const styles = StyleSheet.create({
    container: {
        left: 15,
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center",
        padding: 5,
        // shadowColor: "#000",
        // borderRadius: 15,
        borderBottomWidth:2,
        borderColor:"#E0E0E0"
        // shadowOffset: {
        //     width: 0,
        //     height: 3
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 2.41,
        // elevation: 5
    }
})


export default GroupChatRow
