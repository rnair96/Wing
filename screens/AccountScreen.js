import React, { Component, useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, TextInput, Modal, TouchableHighlight, Switch } from 'react-native';
import useAuth from '../hooks/useAuth';
import Header from '../Header';
import { useNavigation, useRoute } from '@react-navigation/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import registerNotifications from '../lib/registerNotifications';


const AccountScreen = () => {
    const { user, deleteAll, logout } = useAuth();
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState(true);



    const [modalVisible, setModalVisible] = useState(false);
    const [pwdmodalVisible, setpwdModalVisible] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState(null)
    const [activeStudent, setActiveStudent] = useState(false);
    const { params } = useRoute();
    const profile = params;


    useEffect(() => {
        if (profile) {
            setEmail(profile.email);

            if (profile?.university_student && profile.university_student.status === "active") {
                setActiveStudent(true);
            }

            if (profile.token === "testing" || profile.token === "not_granted") {
                setNotifications(false);
            }
        }

    }, [profile])


    const editNotifications = async () => {
        if (notifications) {
            console.log("Notifications set to false");
            setNotifications(false);
            updateDoc(doc(db, global.users, user.uid), {
                token: "not_granted"
            }).then(() => {
                navigation.navigate("Home");
                console.log("notifications restricted")
            }).catch((error) => {
                alert(error.message)
            });
            //really should create another field that stores permission seperately from token

        } else {
            console.log("Notifications set to true");
            setNotifications(true);
            const token = await registerNotifications();
            updateDoc(doc(db, global.users, user.uid), {
                token: token
            }).then(() => {
                navigation.navigate("Home");
                console.log("new token set", token)
            }).catch((error) => {
                alert(error.message)
            });

        }
        //update db for notifications of user
    }

    const updateEmail = () => {
        updateDoc(doc(db, global.users, user.uid), {
            email: email
        }).then(() => {
            navigation.navigate("Home");
            console.log("new email for user set to:", email)
        }).catch((error) => {
            alert(error.message)
        });
    }


    const updateUniversitySetting = async () => {

        await updateDoc(doc(db, global.users, user.uid), {
            universityPreference: "No",
            university_student: {
                status: "inactive",
                class_level: profile.university_student.class_level,
                grad_year: profile.university_student.grad_year
            },
        }).then(() => {
            navigation.navigate("Home")
            alert("Congrats on graduating to Wing Professional! Make sure to update your profile to optimize matching.")
        }).catch((error) => {
            alert(error.message)
        });
    }

    const handleModalDelete = async () => {
        if (user.providerData[0].providerId === "password") {
            setModalVisible(false);
            setpwdModalVisible(true);
        } else {
            setModalVisible(false);
            deleteAll(false);
            // navigation.navigate("Login");
        }
    }


    return (
        <View style={{ backgroundColor: "white", height: "100%" }}>
            <SafeAreaView>
                <Header title={"Account"} />
            </SafeAreaView>
            <View style={{ height: "90%", width: "100%", alignItems: "center", justifyContent: "space-evenly" }}>

                <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 10, height: "20%", width: "100%" }}>
                    <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}>Edit Push Notifications</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                        <Text style={{ fontSize: 12, width: "60%", padding: 10 }}>Messages, Chat Requests, & New Matches</Text>
                        {/* <TouchableOpacity style={{ ...styles.savebuttonContainer, width: 200, backgroundColor: notifications? "red":"green" }} onPress={() => editNotifications()}>
                            <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "bold", color: "white" }}>{notifications?`Currently On.. Turn Off?`:`Currently Off.. Turn On?`}</Text>
                        </TouchableOpacity> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: "white", marginRight: 10 }}>{notifications ? "Yes" : "No"}</Text>
                            <Switch
                                trackColor={{ false: "red", true: "grey" }}
                                thumbColor={notifications ? "white" : "grey"}
                                onValueChange={editNotifications}
                                value={notifications}
                            />
                        </View>
                    </View>
                    {/* <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                        <Text style={{ fontSize: 12, width: "60%" }}>Community News, Promotional Offers & Events?</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: "white", marginRight: 10 }}>{notifications ? "Yes" : "No"}</Text>
                            <Switch
                                trackColor={{ false: "red", true: "grey" }}
                                thumbColor={notifications ? "white" : "grey"}
                                onValueChange={editNotifications}
                                value={notifications}
                            />
                        </View>
                    </View> */}
                </View>


                {activeStudent && (
                    <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 10, height: "20%", width: "100%" }}>
                        <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}>Leave Wing-U?</Text>
                        <Text style={{ fontSize: 12, margin: 10 }}>Graduate Wing University and upgrade your profile and matching as a Professional!</Text>
                        <TouchableOpacity style={{ ...styles.savebuttonContainer, width: 200 }} onPress={() => updateUniversitySetting()}>
                            <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "bold", color: "white" }}>Yes, Upgrade to Professional</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}>Contact Email</Text>
                <View style={{ flexDirection: "row" }}>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15 }} />
                    <TouchableOpacity style={styles.savebuttonContainer} onPress={() => updateEmail()}>
                        <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "bold", color: "white" }}>Update</Text>
                    </TouchableOpacity>
                </View>

                {/* should actually cycle through all providerData for potential password authentication */}
                {user.providerData[0].providerId === "password" && (<TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("ChangePassword")}>
                    <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", color: "white" }}>Change Password</Text>
                </TouchableOpacity>)}

                <TouchableOpacity
                    style={{
                        width: 200, height: 50, padding: 15, borderRadius: 10, backgroundColor: "#00308F", shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: 5
                    }}
                    onPress={() => {
                        // navigation.navigate("Login");
                        logout();
                    }}>
                    <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[{
                        width: 200, height: 50, padding: 15, borderRadius: 10, backgroundColor: "red", shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: 5
                    }]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", color: "white" }}>Delete Account</Text>
                </TouchableOpacity>

            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 15, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>Are you sure you want to delete your account? All data will be permanantly lost</Text>
                        <TouchableHighlight
                            style={styles.opacityStyle}
                            onPress={() => { handleModalDelete() }}
                        >
                            <Text style={styles.textStyle}>Yes</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            // style={{ borderColor: "grey", borderWidth: 2, padding: 15, width: 300 }}
                            style={styles.opacityStyle}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>No</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={pwdmodalVisible}
                onRequestClose={() => {
                    setpwdModalVisible(!pwdmodalVisible)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 15, textAlign: "center", fontWeight: "bold" }}>Please input your password to confirm deletion.</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder='**********'
                            secureTextEntry
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, margin: 20 }} />
                        <TouchableHighlight
                            // style={{ borderColor: "grey", borderWidth: 2, padding: 15, width: 300 }}
                            style={styles.opacityStyle}
                            onPress={() => {
                                setpwdModalVisible(false)
                                deleteAll(true, password);
                                // navigation.navigate("Login");
                            }}
                        >
                            <Text style={styles.textStyle}>Delete Account</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            // style={{ borderColor: "grey", borderWidth: 2, padding: 15, width: 300 }}
                            style={styles.opacityStyle}
                            onPress={() => {
                                setPassword(null)
                                setpwdModalVisible(!pwdmodalVisible)
                            }}
                        >
                            <Text style={styles.textStyle}>Go Back</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    savebuttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 40,
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
    },
    buttonContainer: {
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
    },
    iconcontainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        borderColor: "#00BFFF",
        borderWidth: 2
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        height: "40%",
        width: "80%",
        // maxHeight:500,
        // maxWidth:"90%",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    opacityStyle: {
        // borderColor: "#00308F",
        // borderWidth: 2,
        // paddingVertical: 5,
        // paddingHorizontal: 30,
        backgroundColor: "#00308F",
        width: "90%",
        height: "15%",
        alignItems: "center",
        borderRadius: 10,
        justifyContent: "center"
    }
});

export default AccountScreen;