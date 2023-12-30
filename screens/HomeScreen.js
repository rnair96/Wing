import React, { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TouchableHighlight, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { onSnapshot, doc, updateDoc, } from "firebase/firestore";
import { db } from '../firebase';
import * as WebBrowser from 'expo-web-browser';
import SwipeScreen from './SwipeScreen';
import getLocation from '../lib/getLocation';
import * as Sentry from "@sentry/react";




WebBrowser.maybeCompleteAuthSession();

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [loggedProfile, setLoggedProfile] = useState(null);
    const route = useRoute();
    const [islocationChanged, setIsLocationChanged] = useState(false);


    useLayoutEffect(() => {
        const unsub = onSnapshot(doc(db, global.users, user?.uid), (snapshot) => {
            if (!snapshot.exists()) {
                navigation.navigate("SetUp0");
            } else if (!snapshot.data().university_student && !snapshot.data().job || !snapshot.data().images) {
                navigation.navigate("SetUp1");
            } else if (!snapshot.data().prompts || !snapshot.data().values) {
                navigation.navigate("SetUp3", { id: user.uid });
            }

            else {
                const info =
                {
                    id: snapshot.id,
                    ...snapshot.data()
                }
                setLoggedProfile(info);
            }
        },
            (error) => {
                console.log("there was an error in homescreen layout snapshot", error)
                Sentry.captureMessage("error at getting user snapshot at homescreen ",user?.uid,", ", error.message)

                
            }
        )

        return () => {
            unsub();
        };

    }, [db]);

    useEffect(() => {
        if (route.params?.refresh) {
            // Perform the refresh operation here
            console.log("refreshing profile")
            const unsub = onSnapshot(doc(db, global.users, user?.uid), (snapshot) => {
                const info =
                {
                    id: snapshot.id,
                    ...snapshot.data()
                }
                setLoggedProfile(info);
            },
                (error) => {
                    console.log("there was an error in refreshing loggedprofile", error)
                    Sentry.captureMessage("error at loggedprofile refresh for ",user.uid,", ", error.message)
                }
            )

            return () => {
                unsub();
            };
        }
    }, [route.params, islocationChanged])

    useEffect(() => {
        (async () => {
            //check if given permission, user is in a new location, if so, update
            if (loggedProfile && loggedProfile.location?.permission && loggedProfile.location.permission === "Always") {
                console.log("getting new location")
                const location = await getLocation();
                if (location && (loggedProfile?.location.text !== location.text)) {
                    console.log("Updating location")
                    updateDoc(doc(db, global.users, user.uid), {
                        location: {
                            permission: "Always",
                            ...location
                        }
                    }).then(() => {
                        setIsLocationChanged(true);
                    }).catch((error) => {
                        console.log("could not refresh location");
                        Sentry.captureMessage("error at location refresh for ",user.uid,", ", error.message)

                    });
                }
            }

        })();
    }, [loggedProfile]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                <TouchableOpacity
                    // style={{padding:5, borderRadius: 50, shadowOffset: {width: 0,height: 2}, shadowOpacity: 0.3, shadowRadius: 2.41, elevation: 5, backgroundColor: 'white' }} 
                    onPress={() => navigation.navigate("ToggleProfile", loggedProfile)}>
                    {/* left: 20, top:10 */}
                    <Ionicons name="person" size={30} color="#00308F" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ borderRadius: 50, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5, backgroundColor: 'white' }}
                    onPress={() => navigation.navigate("Menu", loggedProfile)}>
                    <Image style={styles.iconcontainer} source={require("../images/whitelogo.png")} />
                </TouchableOpacity>
                {/* right:20, top:10 */}
                <TouchableOpacity
                    // style={{padding:5, borderRadius: 50, shadowOffset: {width: 0,height: 2}, shadowOpacity: 0.3, shadowRadius: 2.41, elevation: 5, backgroundColor: 'white'}} 
                    onPress={() => navigation.navigate("ToggleChat", loggedProfile)}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#00308F" />
                </TouchableOpacity>
            </View>
            {/* End of Header */}
            {/* Cards */}
            <SwipeScreen loggedProfile={loggedProfile} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    iconcontainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        backgroundColor: "#00308F",
    }
});


export default HomeScreen

