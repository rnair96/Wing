import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../Header';


const SetUp2Screen = () => {
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [company, setCompany] = useState(null);
    const [school, setSchool] = useState(null);


    const incompleteform = !job;


    const navigation = useNavigation();

    const updateUserProfile = () => {
        updateDoc(doc(db, global.users, user.uid), {
            job: job,
            company: company,
            school: school,
        }).then(() => {

            navigation.navigate("SetUp3")
        }).catch((error) => {
            alert(error.message)
        });
    }



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex:1, backgroundColor:"black"}}
            keyboardVerticalOffset={10}>


        <TouchableWithoutFeedback 
        // onPress={Keyboard.dismiss()}
        >
        <SafeAreaView style={{flex:1, alignItems: "center", justifyContent: "space-evenly"}}>

            <Header style={{ fontSize: 20, fontWeight: "bold", padding: 20 }} title={"Account Setup 2/5"} />


            <Text style={styles.formTitle}>Add Job Title</Text>
            <TextInput
                value={job}
                onChangeText={setJob}
                placeholder={'I.e Lawyer'}
                placeholderTextColor={"grey"}
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color:"white"}} />

            <Text style={styles.formTitle}>Add Company You Work At {`(Optional)`} </Text>
            <TextInput
                value={company}
                onChangeText={setCompany}
                placeholder={'I.e Some Company Name'}
                placeholderTextColor={"grey"}
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color:"white" }} />

            <Text style={styles.formTitle}>Add The School You Graduated From or Last Attended {`(Optional)`} </Text>
            <TextInput
                value={school}
                onChangeText={setSchool}
                placeholder={'I.e American University'}
                placeholderTextColor={"grey"}
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color:"white"}} />

            <TouchableOpacity
                disabled={incompleteform}
                style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                onPress={updateUserProfile}>
                <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Next</Text>
            </TouchableOpacity>

        </SafeAreaView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    formTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
        padding: 20
    },
    button: {
        padding: 5,
        backgroundColor: "blue",
        borderRadius: 20

    }
})

export default SetUp2Screen;
