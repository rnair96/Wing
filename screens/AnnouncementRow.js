import { useNavigation } from '@react-navigation/native'
import { onSnapshot, orderBy, query, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import UnreadHighlighter from '../components/UnreadHighlighter';
import getTime from '../lib/getTime';

const AnnouncementRow = ({profile}) => {

    const { user } = useAuth();
    const [lastMessage, setLastMessage] = useState();
    const [read, setRead] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState(true);
    const [timestamp, setTimeStamp] = useState();
    const navigator = useNavigation();


    const setVars = (data) => {
        if (data && data?.message?.length > 15) {
            const message = data?.message?.slice(0, 15) + "..."
            setLastMessage(message);
        } else {
            setLastMessage(data?.message)
        }

        if (data && data?.timestamp) {
            let milliseconds = data?.timestamp.seconds * 1000 + Math.floor(data?.timestamp.nanoseconds / 1000000);
            const time = getTime(new Date(milliseconds))
            setTimeStamp(time);
        }

        if(data && data.read!==null && data.read!==undefined){
            setRead(data.read);
        }

        setLoadingMessage(false);
    }

    useEffect(() => {

        const unsub = onSnapshot(query(collection(db, global.users, user.uid, "announcements"),
            orderBy("timestamp", "desc")), (snapshot) =>
            setVars({
                id: snapshot.docs[0]?.id,
                ...snapshot.docs[0]?.data()})
            ,
            (error) => {
                console.log("there was an error in announcement snapshot", error)
            }
        )

        return () => {
            unsub();
        };

    }, [db]);

    return (
        !loadingMessage && (
            <View style={{ padding: 10, width: "95%" }}>
                <TouchableOpacity style={styles.container} onPress={() => navigator.navigate("Announcements")}>
                        <Image style={{ height: 60, width: 60, borderRadius: 50, backgroundColor: "#00BFFF" }} source={require("../images/logo.png")} />
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 15, paddingLeft: 5, paddingBottom: 5 }}>News & Promos</Text>
                                <Text style={{ paddingLeft: 10, fontWeight: !read? "bold":"normal" }}>{lastMessage}</Text>
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
        borderBottomWidth:1,
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


export default AnnouncementRow
