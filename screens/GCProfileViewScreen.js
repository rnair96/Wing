import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import * as Sentry from "@sentry/react";
import useAuth from '../hooks/useAuth';
import GCMessageModal from '../components/GCMessageModal';
import ProfileViewComponent from '../components/ProfileViewComponent';
import { Entypo } from '@expo/vector-icons';


export const GCProfileViewScreen = () => {
    const { params } = useRoute();
    const { profileId, swipes, matches, requests } = params;
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const { user } = useAuth();
    const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
    const navigation = useNavigation();


    useEffect(() => {
        let isCancelled = false; // cancel flag

        // if (!profile) {
        console.log("fetching user data...")
        const fetchUserData = async () => {
            try {
                const userSnap = await getDoc(doc(db, global.users, profileId));
                setProfile({
                    id: profileId,
                    ...userSnap.data()
                })
            } catch (error) {
                if (!isCancelled) {
                    console.log("incomplete fetch data:", error);
                    Sentry.captureMessage(`Cancelled fetching user data in group chat profileview of ${profileId} for ${user.uid}, ${error.message}`)

                }
                console.log("error fetching userdata")
                Sentry.captureMessage(`error fetching user data in group chat profile view of ${profileId} for ${user.uid}, ${error.message}`)

            }

            setLoading(false);
        }

        fetchUserData();

        return () => {
            isCancelled = true;
        };
        // }

    }, [profileId, db])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-up-outline" size={40} color="#00308F" />
            </TouchableOpacity>
            {/* <View> */}
            {(!loading && profile) ? (
                <View>
                    <ProfileViewComponent profile={profile} setFlag={true} flagged_type={"groupchat"} />
                    <View style={{ alignItems: "center", bottom:200 }}>
                        <TouchableOpacity style={styles.swipeButtonHeart} onPress={() => setIsMessageModalVisible(true)}>
                            <Entypo name="mail" size={17} color="green" />
                        </TouchableOpacity>
                    </View>
                    <GCMessageModal isVisible={isMessageModalVisible} setIsVisible={setIsMessageModalVisible} profile={profile} swipes={swipes} matches={matches} requests={requests} />
                </View>
            ) : (
                <View style={{ marginVertical: "60%", justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#00BFFF" />
                </View>
            )}

        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    swipeButtonHeart: {
        bottom: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#32de84",
        // shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 2.41,
        elevation: 5
    },
});

export default GCProfileViewScreen;
