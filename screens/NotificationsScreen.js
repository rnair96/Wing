import React, { useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Header from '../Header';
import useAuth from '../hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import registerNotifications from '../lib/registerNotifications';
import * as Sentry from "@sentry/react";
import YNRadioButton from '../components/YNRadioButton';


const NotificationsScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [messageNotifications, setMessageNotifications] = useState(false);
    const [eventNotifications, setEventNotifications] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [locationPermission, setLocationPermission] = useState("Only Once");




    const { params } = useRoute();
    const profile = params;


    useEffect(() => {
        if (profile) {

            if (profile?.notifications && profile.notifications?.messages!==undefined && profile.notifications?.messages!==null) {
                setMessageNotifications(profile.notifications.messages);
            }

            if (profile?.notifications && profile.notifications?.events!==undefined && profile.notifications?.events!==null) {
                setEventNotifications(profile.notifications.events);
            }

            if (profile?.notifications && profile.notifications?.emails!==undefined && profile.notifications?.emails!==null) {
                setEmailNotifications(profile.notifications.emails);
            }

            if (profile?.location && profile.location?.permission!==undefined && profile.notifications?.permission!==null) {
                setLocationPermission(profile.location.permission);
            }
        }

    }, [profile])


    const saveNotifications = async () => {
        let token = profile.token;
        if ((profile.token === "testing" || profile.token === "not_granted") && (messageNotifications || eventNotifications)) {
            token = await registerNotifications();
        }

        console.log("token",token)

        updateDoc(doc(db, global.users, user.uid), {
            notifications: { "messages": messageNotifications, "events": eventNotifications, "emails": emailNotifications},
            token: token,
            location: {
                permission: locationPermission,
                city: profile.location.city,
                state: profile.location.state,
                text: profile.location.text,
                longitude: profile.location.longitude,
                latitude: profile.location.latitude
            }
        }).then(() => {
            navigation.navigate("Home");
            console.log("notifications saved")
        }).catch((error) => {
            console.log("there was an error", error.message);
            Sentry.captureMessage("error at setting notifications", error.message)
        });

        // }
        //update db for notifications of user
    }



    return (
        <SafeAreaView style={{ backgroundColor: "white" }}>
            {/* <SafeAreaView> */}
            <Header style={{marginHorizontal:"10%"}} title={"Location & Notifications"} />
            <View style={{height: "92%", alignItems: "center", justifyContent: "space-evenly", margin: 10 }}>

                {/* <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 10, width: "100%" }}> */}
                {/* <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}>Edit Push Notifications</Text> */}
                <View style={{ flexDirection: "column", justifyContent: "space-evenly" }}>
                    <Text style={{ textAlign: "center", fontSize: 15 , padding: 10 }}>Push Notifications for Messages, Chat Requests, & New Matches</Text>
                    {/* <TouchableOpacity style={{ ...styles.savebuttonContainer, width: 200, backgroundColor: notifications? "red":"green" }} onPress={() => editNotifications()}>
                            <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "bold", color: "white" }}>{notifications?`Currently On.. Turn Off?`:`Currently Off.. Turn On?`}</Text>
                        </TouchableOpacity> */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:"center"  }}>
                        <Text style={{ marginRight: 10, fontWeight: "bold", fontSize: 15, }}>{messageNotifications ? "On" : "Off"}</Text>
                        <Switch
                            trackColor={{ false: "red", true: "#00BFFF" }}
                            thumbColor={messageNotifications ? "white" : "grey"}
                            onValueChange={setMessageNotifications}
                            value={messageNotifications}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: "column", justifyContent: "space-evenly"}}>
                    <Text style={{ textAlign: "center", fontSize: 15,  padding:10}}>Push Notifications for Community News, Promotional Offers & Events</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:"center" }}>
                        <Text style={{ marginRight: 10, fontWeight: "bold", fontSize: 15, }}>{eventNotifications ? "On" : "Off"}</Text>
                        <Switch
                            trackColor={{ false: "red", true: "#00BFFF" }}
                            thumbColor={eventNotifications ? "white" : "grey"}
                            onValueChange={setEventNotifications}
                            value={eventNotifications}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: "column", justifyContent: "space-evenly"}}>
                    <Text style={{ textAlign: "center", fontSize: 15,  padding:10}}>Emails</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:"center" }}>
                        <Text style={{ marginRight: 10, fontWeight: "bold", fontSize: 15, }}>{emailNotifications ? "On" : "Off"}</Text>
                        <Switch
                            trackColor={{ false: "red", true: "#00BFFF" }}
                            thumbColor={emailNotifications ? "white" : "grey"}
                            onValueChange={setEmailNotifications}
                            value={emailNotifications}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: "column", justifyContent: "space-evenly"}}>
                    <Text style={{ textAlign: "center", fontSize: 15,  paddingBottom:10}}>Tracking Location on App</Text>
                    <YNRadioButton selectedOption={locationPermission} setSelectedOption={setLocationPermission} optionsArray={['Always','Only Once']}/>
                </View>
                <TouchableOpacity style={styles.savebuttonContainer} onPress={() => saveNotifications()}>
                    <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Save Notifications</Text>
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
        width: 200,
        height: 50,
        margin: 10,
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#ccc',
        backgroundColor: "#00308F",
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