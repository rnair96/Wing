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

const ChatRow = ({ matchedDetails }) => {

    const { user } = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState();
    const [read, setRead] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [timestamp, setTimeStamp] = useState();
    const [name, setName] = useState("Account User");
    const [profilePic, setProfilePic] = useState(null);
    const [profile, setProfile] = useState(null);
    const navigator = useNavigation();


    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchedDetails.userMatched, user.uid));
    }, [matchedDetails, user]);


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

        if (data && data?.userId !== user.uid) {
            setRead(data.read);
        } else if (data && data?.userId === user.uid) {
            setRead(true);
        } else {
            setRead(false);
        }
        setLoadingMessage(false);
    }

    useEffect(() => {

        const unsub = onSnapshot(query(collection(db, global.matches, matchedDetails.id, "messages"),
            orderBy("timestamp", "desc")), (snapshot) =>
            setVars(snapshot.docs[0]?.data())
            ,
            (error) => {
                console.log("there was an error in chatrow snapshot", error)
            }
        )

        return () => {
            unsub();
        };

    }, [matchedDetails, db]);


    useEffect(() => {
        async function fetchData() {
            if (matchedUserInfo) { // check if you can access matched_user[1].id safely
                const other_user_snapshot = await getDoc(doc(db, global.users, matchedUserInfo)); // replace 'YOUR_COLLECTION_NAME' with the name of your collection
                if (other_user_snapshot.exists) { // check if the document exists
                    setName(other_user_snapshot.data().displayName);
                    setProfilePic(other_user_snapshot.data().images[0]);
                    setProfile(other_user_snapshot.data());

                } else {
                    console.log("No such document!");
                }
                setLoadingProfile(false);
            } else {
                console.log("matched_user might be empty or doesn't have enough items!");
                setLoadingProfile(false);
            }
        }

        fetchData();

    }, [matchedUserInfo, db])

    //add useEffect that fetches user info from id and pass it into params

    return (
        !loadingMessage && !loadingProfile && (
            <View style={{ padding: 10, width: "95%" }}>
                <TouchableOpacity style={styles.container} onPress={() => navigator.navigate("Message", {
                    matchedDetails, profile
                })}>
                    {/* {!read ? <UnreadHighlighter/>:<View style={{padding:15}}></View>} */}
                    {profilePic ? (
                        <Image style={{ height: 60, width: 60, borderRadius: 50, borderWidth: !read ? 3 : 1, borderColor: "#00BFFF" }}
                            source={{ uri: profilePic }} />
                    ) : (
                        <Image style={{ height: 60, width: 60, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }} source={require("../images/account.jpeg")} />
                    )
                    }
                    {/* source = {{uri:matchedUserInfo[1]?.images[0]}} */}
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 20, paddingLeft: 10, paddingBottom: 5, color: "white" }}>{name}</Text>
                            {/* {matchedUserInfo[1]?.displayName} */}
                            {!read ? (
                                <Text style={{ paddingLeft: 10, color: "white", fontWeight: "bold" }}>{lastMessage || "Say Hi!"}</Text>
                            ) : (
                                <Text style={{ paddingLeft: 10, color: "white" }}>{lastMessage || "Say Hi!"}</Text>
                            )}
                        </View>
                        <View style={{ position: "absolute", left: 170, top: 20, flexDirection: "row" }}>
                            <Text style={{ fontSize: 10, color: "white" }}>{timestamp || "New Match"}</Text>
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
        backgroundColor: "#00308F",
        alignItems: "center",
        padding: 5,
        shadowColor: "#000",
        borderRadius: 15,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    }
})


export default ChatRow
