import React, { useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Header from '../Header';
import { useNavigation, useRoute } from '@react-navigation/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import registerNotifications from '../lib/registerNotifications';


const NotificationsScreen = () => {
    const navigation = useNavigation();
    const [messageNotifications, setMessageNotifications] = useState(true);
    const [eventNotifications, setEventNotifications] = useState(true);
    // const [token, setToken] = useState(true);


    const { params } = useRoute();
    const profile = params;


    useEffect(() => {
        if (profile) {

            if (profile?.notifications && profile.notifications?.messages) {
                setMessageNotifications(profile.notifications.messages);
            }

            if (profile?.notifications && profile.notifications?.events) {
                setEventNotifications(profile.notifications.events);
            }
        }

    }, [profile])


    const saveNotifications = async () => {
        let token = profile.token;
        if ((profile.token === "testing" || profile.token === "not_granted") && (messageNotifications || eventNotifications)) {
            token = await registerNotifications();
        }

        updateDoc(doc(db, global.users, user.uid), {
            notifications: { "messages": messageNotifications, "events": eventNotifications },
            token: token
        }).then(() => {
            navigation.navigate("Home");
            console.log("notifications saved")
        }).catch((error) => {
            alert(error.message)
        });

        // }
        //update db for notifications of user
    }



    return (
        <SafeAreaView style={{ backgroundColor: "white" }}>
            {/* <SafeAreaView> */}
            <Header title={"Notifications"} />
            <View style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "space-evenly", margin: 10 }}>

                {/* <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 10, width: "100%" }}> */}
                {/* <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}>Edit Push Notifications</Text> */}
                <View style={{ flexDirection: "column", justifyContent: "space-evenly", margin: 30 }}>
                    <Text style={{ fontSize: 12, width: "60%", padding: 10 }}>Recieve Notifications For Messages, Chat Requests, & New Matches</Text>
                    {/* <TouchableOpacity style={{ ...styles.savebuttonContainer, width: 200, backgroundColor: notifications? "red":"green" }} onPress={() => editNotifications()}>
                            <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "bold", color: "white" }}>{notifications?`Currently On.. Turn Off?`:`Currently Off.. Turn On?`}</Text>
                        </TouchableOpacity> */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:"center"  }}>
                        <Text style={{ marginRight: 10 }}>{messageNotifications ? "Yes" : "No"}</Text>
                        <Switch
                            trackColor={{ false: "red", true: "grey" }}
                            thumbColor={messageNotifications ? "white" : "grey"}
                            onValueChange={setMessageNotifications}
                            value={messageNotifications}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: "column", justifyContent: "space-evenly", margin: 30 }}>
                    <Text style={{ fontSize: 12, width: "40%", padding:10}}>Recieve Notifications For Community News, Promotional Offers & Events?</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:"center" }}>
                        <Text style={{ marginRight: 10 }}>{eventNotifications ? "Yes" : "No"}</Text>
                        <Switch
                            trackColor={{ false: "red", true: "grey" }}
                            thumbColor={eventNotifications ? "white" : "grey"}
                            onValueChange={setEventNotifications}
                            value={eventNotifications}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.savebuttonContainer} onPress={() => saveNotifications()}>
                    <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "bold", color: "white" }}>Save Notifications</Text>
                </TouchableOpacity>
                {/* </View> */}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    savebuttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: "40%",
        height: "7%",
        margin: 10,
        borderRadius: 10,
        backgroundColor: "green",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5
    }
});

export default NotificationsScreen;