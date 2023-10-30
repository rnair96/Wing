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
// import LinearGradient from 'react-native-linear-gradient';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import getLocation from '../lib/getLocation';



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
            } else if (!snapshot.data().mission || !snapshot.data().values) {
                navigation.navigate("SetUp3", { id: user.uid });
            }

            // else if (!snapshot.data().genderPreference){
            //     navigation.navigate("Preferences", {id: user.uid});
            // } 

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
                }
            )

            return () => {
                unsub();
            };
        }
    }, [route.params, islocationChanged])

    useEffect(() => {
        (async () => {
            //check if user is in a new location, if so, update
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                console.log("status", finalStatus);
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
            }


            const location = await getLocation();
            if (loggedProfile && location && loggedProfile?.location.text !== location.text) {
                console.log("Updating location")
                updateDoc(doc(db, global.users, user.uid), {
                    location: location
                }).then(()=>{
                    setIsLocationChanged(true);
                }).catch((error) => {
                    console.log("could not refresh location");
                });
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
                    <Ionicons name="person" size={30} color="#00BFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ borderRadius: 50, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5, backgroundColor: 'white' }}
                    onPress={() => navigation.navigate("Menu", loggedProfile)}>
                    <Image style={styles.iconcontainer} source={require("../images/logo.png")} />
                </TouchableOpacity>
                {/* right:20, top:10 */}
                <TouchableOpacity
                    // style={{padding:5, borderRadius: 50, shadowOffset: {width: 0,height: 2}, shadowOpacity: 0.3, shadowRadius: 2.41, elevation: 5, backgroundColor: 'white'}} 
                    onPress={() => navigation.navigate("ToggleChat", loggedProfile)}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#00BFFF" />
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
        backgroundColor: "#00BFFF",
    }
});


export default HomeScreen
