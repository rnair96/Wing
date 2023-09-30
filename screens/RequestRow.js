import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import getTime from '../lib/getTime';
import UnreadHighlighter from '../components/UnreadHighlighter';


const RequestRow = ({ requestDetails }) => {

    const [lastMessage, setLastMessage] = useState();
    const [loadingMessage, setLoadingMessage] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [timestamp, setTimeStamp] = useState();
    const [name, setName] = useState("Account User");
    const [profilePic, setProfilePic] = useState(null);
    const [profile, setProfile] = useState(null);
    const [read, setRead]  = useState(true);
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

        if(data && data?.read){
            setRead(data.read)
        }

        setLoadingMessage(false);
    }

    useEffect(() => {

       setVars(requestDetails);

    }, [db]);


    useEffect(() => {
        async function fetchData() {
                const other_user_snapshot = await getDoc(doc(db, global.users, requestDetails.id)); // replace 'YOUR_COLLECTION_NAME' with the name of your collection
                if (other_user_snapshot.exists) { // check if the document exists
                    setName(other_user_snapshot.data().displayName);
                    setProfilePic(other_user_snapshot.data().images[0]);
                    setProfile(other_user_snapshot.data());
                } else {
                    console.log("No such document!");
                }
                setLoadingProfile(false);
        }

        fetchData();

    }, [db])

    //add useEffect that fetches user info from id and pass it into params

    return (
        !loadingMessage && !loadingProfile && (
            <View style={{ padding: 10, width: "95%" }}>
                <TouchableOpacity style={styles.container} onPress={() => navigator.navigate("RequestMessage", {
                    requestDetails, profile
                })}>
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
                                <Text style={{ paddingLeft: 10, color: "white" }}>{lastMessage}</Text>
                        </View>
                        <View style={{ position: "absolute", left: 170, top: 20, flexDirection: "row" }}>
                            <Text style={{ fontSize: 10, color: "white" }}>{timestamp}</Text>
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


export default RequestRow
