import React, { Component, useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, TextInput, Modal, TouchableHighlight, ImageBackground } from 'react-native';
import useAuth from '../hooks/useAuth';
import Header from '../Header';
import { useNavigation, useRoute } from '@react-navigation/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';


const AccountScreen = () => {
    const { user, deleteAll, logout } = useAuth();
    const navigation = useNavigation();
    // const [notifications, setNotifications] = useState(true);


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
        }

    }, [profile])


    // const editNotifications = () => {
    //     if(notifications){
    //         console.log("Notifications set to false");
    //         setNotifications(false);

    //     }else{
    //         console.log("Notifications set to true");
    //         setNotifications(true);

    //     }
    //     //update db for notifications of user
    // }

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

    const handleModalDelete = async() => {
       if( user.providerData[0].providerId === "password"){
        setModalVisible(false);
        setpwdModalVisible(true);
       } else {
        setModalVisible(false);
        deleteAll(false);
        // navigation.navigate("Login");
       }
    }


    return (
        <View style={{backgroundColor:"black", height:"100%"}}>
            <SafeAreaView>
            <Header style={{ fontSize: 20, fontWeight: "bold", padding: 20 }} title={"Account"} />
            </SafeAreaView>
            <View style={{ height: "90%", width: "100%", alignItems: "center", justifyContent: "space-evenly" }}>


                {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => editNotifications}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Edit Push Notifications</Text>
        </TouchableOpacity> */}

                {activeStudent && (
                    <View style={{ alignItems: "center", justifyContent: "space-evenly", padding: 10, height: "30%", width: "100%" }}>
                        <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", color:"white" }}>Leave Wing-U?</Text>
                        <Text style={{ fontSize: 12, margin: 10, color:"white" }}>Graduate Wing University and upgrade your profile and matching as a Professional!</Text>
                        <TouchableOpacity style={{ ...styles.savebuttonContainer, width: 200 }} onPress={() => updateUniversitySetting()}>
                            <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "bold", color: "white" }}>Yes, Upgrade to Professional</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", color:"white"}}>Contact Email</Text>
                <View style={{ flexDirection: "row" }}>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color:"white" }} />
                    <TouchableOpacity style={styles.savebuttonContainer} onPress={() => updateEmail()}>
                        <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "bold", color: "white" }}>Update</Text>
                    </TouchableOpacity>
                </View>

                {/* should actually cycle through all providerData for potential password authentication */}
                {user.providerData[0].providerId === "password" && (<TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("ChangePassword")}>
                    <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", color:"white" }}>Change Password</Text>
                </TouchableOpacity>)}

                <TouchableOpacity
                    style={{ width: 200, height: 50, padding: 15, borderRadius: 10 , backgroundColor: "#00308F" }}
                    onPress={()=>{
                        // navigation.navigate("Login");
                        logout();
                    }}>
                    <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[{ width: 200, height: 50, padding: 15, borderRadius: 10 }, { backgroundColor: "red" }]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Delete Account</Text>
                </TouchableOpacity>

            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 14, textAlign: "center", paddingBottom: 10 }}>Are you sure you want to delete your account? All data will be permanantly lost</Text>
                        <TouchableHighlight
                            style={{ borderColor: "grey", borderWidth: 2, padding: 15, width: 300 }}
                            onPress={() => {handleModalDelete()}}
                        >
                            <Text style={styles.textStyle}>Yes</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ borderColor: "grey", borderWidth: 2, padding: 15, width: 300 }}
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
                animationType="slide"
                transparent={true}
                visible={pwdmodalVisible}
                onRequestClose={() => {
                    setpwdModalVisible(!pwdmodalVisible)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 14, textAlign: "center"}}>Please input your password to confirm deletion.</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder='**********'
                            secureTextEntry
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, margin:20}} />
                        <TouchableHighlight
                            style={{ borderColor: "grey", borderWidth: 2, padding: 15, width: 300 }}
                            onPress={() => {
                                setpwdModalVisible(false)
                                deleteAll(true, password);
                                // navigation.navigate("Login");
                            }}
                        >
                            <Text style={styles.textStyle}>Delete Account</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ borderColor: "grey", borderWidth: 2, padding: 15, width: 300 }}
                            onPress={() => {
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
        backgroundColor: "green"
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 50,
        margin: 10,
        borderRadius:10,
        // borderWidth: 1,
        // borderColor: '#ccc',
        backgroundColor: "#00308F"
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
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

export default AccountScreen;