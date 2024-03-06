import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, View, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc, collection, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../Header';
import * as Sentry from "@sentry/react";


const GroupsScreen = () => {
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [groupCode, setGroupCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    const incompleteform = !groupCode;

    const navigation = useNavigation();

    useEffect(() => {
        let isCancelled = false; // cancel flag
    
          console.log("fetching user data...")
          const fetchUserData = async () => {
            try {
              const userSnap = await getDoc(doc(db, global.users, user.uid));
              setProfile({
                id: user.uid,
                ...userSnap.data()
              })
            } catch (error) {
              if (!isCancelled) {
                console.log("incomplete fetch data:", error);
                Sentry.captureMessage(`Cancelled fetching user data in groups screen of ${user.uid}, ${error.message}`)
    
              }
              console.log("error fetching userdata")
              Sentry.captureMessage(`error fetching user data in groups screen of ${user.uid}, ${error.message}`)
    
            }
    
    
          }
    
          fetchUserData();
    
          return () => {
            isCancelled = true;
          };
      }, [db])

    const accessCode = async () => {
        console.log("finding group");
        setLoading(true);
        try {
            const cappedCode = groupCode.toUpperCase();
            const groupsRef = collection(db, 'groups')
            const q = query(groupsRef, where("code", "==", cappedCode));

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const documentSnapshot = querySnapshot.docs[0];
                console.log('Document data:', documentSnapshot.data());
                if (documentSnapshot.data()?.group) {
                    setGroup(documentSnapshot.data()?.group)
                } else {
                    console.log("can't find group")
                    alert("Can't find group. Please try again.")
                }
            } else {
                console.log('No matching documents.');
                alert("Can't find group. Please try again.")
            }
        } catch (error) {
            console.error('Error fetching document:', error);
            Sentry.captureMessage(`Error fetching group ${groupCode} for ${user.uid}, ${error.message}`)
            alert("Error find group. Please try again.")
        }
        setLoading(false);
        //check if code exists in collection "groups"
        //if so, set group
        //if not throw an alert that group was not found
    }

    const updateUserProfile = () => {
        updateDoc(doc(db, global.users, user.uid), {
            group: group,
            preferences: {
                group: true,
                ...profile.preferences
            }
        }).then(() => {
            navigation.navigate("SetUp3")
        }).catch((error) => {
            alert("Error updating profile with group. Try again later.")
            Sentry.captureMessage(`Error setting up data in group screen for ${user.uid}, ${error.message}`)
        });
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "white" }}
            keyboardVerticalOffset={10}>

            <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>

                <TouchableWithoutFeedback
                    onPress={() => Keyboard.dismiss()}
                >
                    <View>
                        <Header style={{ right: "25%" }} title={"Group Setup"} />
                    </View>
                </TouchableWithoutFeedback>
                <View>
                    <Text style={styles.formTitle}>Enter Group Code</Text>
                    <TextInput
                        value={groupCode}
                        onChangeText={setGroupCode}
                        placeholder={'XXXXX'}
                        placeholderTextColor={"grey"}
                        style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0" }} />


                    {!group && (
                        <View>
                            <TouchableOpacity
                                disabled={incompleteform}
                                style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10, margin: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                                onPress={accessCode}>
                                <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Find Group</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10, margin: 10, backgroundColor: "#00308F" }]}
                                onPress={() => { navigation.navigate("SetUp3") }}>
                                <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Skip Step</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {loading && (
                    <ActivityIndicator size="small" color="#00BFFF" />
                )}
                {group && !loading && (
                    <View style={{ alignItems: "center" }}>
                        <View style={{ flexDirection: "row", width: "80%", justifyContent: "space-evenly" }}>
                            <Text style={{ fontSize: 15 }}>Found Your Group!</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 15 }}>{group}</Text>
                        </View>
                        <TouchableOpacity
                            disabled={incompleteform}
                            style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                            onPress={updateUserProfile}>
                            <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Next</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </SafeAreaView>
            {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    formTitle: {
        fontSize: 15,
        fontWeight: "bold",
        padding: 20
    },
    button: {
        padding: 5,
        backgroundColor: "blue",
        borderRadius: 20

    }
})

export default GroupsScreen;
