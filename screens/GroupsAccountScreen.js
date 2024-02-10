import React, { useState, useEffect } from 'react'
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, View, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc, collection, getDocs, query, where, deleteField } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../Header';
import * as Sentry from "@sentry/react";


const GroupsAccountScreen = () => {
    const { user } = useAuth();
    const [oldGroup, setOldGroup] = useState(null);
    const [newGroup, setNewGroup] = useState(null);
    const [groupCode, setGroupCode] = useState(null);
    const [loading, setLoading] = useState(false);

    const incompleteform = !groupCode;

    const navigation = useNavigation();

    const { params } = useRoute();
    const profile = params;


    useEffect(() => {
        if (profile) {

            if (profile?.group) {
                setOldGroup(profile.group);
            }
        }

    }, [profile])

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
                    setNewGroup(documentSnapshot.data()?.group)
                } else {
                    console.log("can't find group")
                }
            } else {
                console.log('No matching documents.');
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
        setGroupCode(null)
        setLoading(false);
        //check if code exists in collection "groups"
        //if so, set group
        //if not throw an alert that group was not found
    }

    const updateUserProfile = (deleteCheck) => {

        if (deleteCheck) {
            setOldGroup(null);
            updateDoc(doc(db, global.users, user.uid), {
                group: deleteField()
            }).then(() => {
                navigation.navigate("Home", { refresh: true });
                alert("Group Removed")
            }).catch((error) => {
                alert("Error removing group from profile. Try again later.")
                Sentry.captureMessage(`Error updating group screen for ${user.uid}, ${error.message}`)
            });
        } else {
            updateDoc(doc(db, global.users, user.uid), {
                group: newGroup,
                preferences: {
                    group: true,
                    ...profile.preferences
                }
            }).then(() => {
                navigation.navigate("Home", { refresh: true });
                alert("Group Updated")
            }).catch((error) => {
                alert("Error updating profile with group. Try again later.")
                Sentry.captureMessage(`Error updating group screen for ${user.uid}, ${error.message}`)
            });
        }

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
                        <Header style={{ right: "25%" }} title={"Edit Group"} />
                    </View>
                </TouchableWithoutFeedback>

                {!oldGroup && !newGroup ? (
                    <View>
                        <Text style={styles.formTitle}>Enter Group Code</Text>

                        <TextInput
                            value={groupCode}
                            onChangeText={setGroupCode}
                            placeholder={'XXXXX'}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor: "#E0E0E0" }} />
                        <TouchableOpacity
                            disabled={incompleteform}
                            style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10, margin: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                            onPress={accessCode}>
                            <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Find Group</Text>
                        </TouchableOpacity>
                        {loading && (
                            <ActivityIndicator size="small" color="#00BFFF" />
                        )}
                    </View>

                ) : (
                    <View style={{ alignItems: "center", height: "90%", width: "80%", justifyContent: "space-evenly" }}>
                        <View style={{height:"40%", justifyContent:"space-evenly", alignItems:"center"}}>
                        <Text style={{ fontSize: 15 }}>{oldGroup? `Your Group:`: `Found Your Group!`}</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>{oldGroup ? oldGroup : newGroup}</Text>
                        </View>
                        {oldGroup && (
                            <TouchableOpacity
                                style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10, backgroundColor: "#00308F" }]}
                                onPress={() => updateUserProfile(true)}>
                                <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Remove Group</Text>
                            </TouchableOpacity>
                        )}
                        {newGroup && (
                            <TouchableOpacity
                                style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10, backgroundColor: "#00308F" }]}
                                onPress={()=>updateUserProfile(false)}>
                                <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Add Group</Text>
                            </TouchableOpacity>
                        )}
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

export default GroupsAccountScreen;
