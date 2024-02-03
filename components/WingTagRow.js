import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import * as Sentry from "@sentry/react";


const WingTagRow = ({ wingId, selectWing }) => {

    const [name, setName] = useState("Account User");
    const [otherProfilePic, setOtherProfilePic] = useState(null);
    const [otherProfile, setOtherProfile] = useState(null);



    useEffect(() => {
        async function fetchData() {
            if (wingId) { 

                const other_user_snapshot = await getDoc(doc(db, global.users, wingId))
                .catch((error)=>{
                    console.log("there was an error in fetching other user data in chatrow", error)
                    Sentry.captureMessage(`error fetching other user data in chatrow ${wingId}, ${error.message}`)
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

    }, [db])

    //add useEffect that fetches user info from id and pass it into params

    return (
            <View style={{ padding: 10, margin:10, width: "100%", right:10}}>
                <TouchableOpacity style={{padding: 5, borderWidth: 0.5, borderColor: "grey", borderRadius: 10 }} onPress={() => selectWing(wingId, name, otherProfile.token)}>
                    <View style={{ flexDirection: "row", alignItems:"center"}}>
                    {otherProfilePic ? (
                        <Image style={{ height: 30, width: 30, borderRadius: 50, borderWidth: 0.5, borderColor: "#00BFFF" }}
                            source={{ uri: otherProfilePic }} />
                    ) : (
                        <Image style={{ height: 30, width: 30, borderRadius: 50, borderWidth: 0.5, borderColor: "#00BFFF" }} source={require("../images/account.jpeg")} />
                    )
                    }
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 15, paddingLeft: 10, paddingBottom: 5 }}>{name}</Text>
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


export default WingTagRow
