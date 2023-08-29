import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import UniversityPicker from '../components/UniversityPicker';
import ClassLevelPicker from '../components/ClassLevelPicker';
import Header from '../Header';


const StudentSetupScreen = () => {
    const { user } = useAuth();
    const [college, setCollege] = useState("University of Maryland College Park");
    const [classlevel, setClassLevel] = useState("undergraduate");


    const navigation = useNavigation();

    const incompleteform = !college || !classlevel;

    const updateUserProfile = () => {
        updateDoc(doc(db, global.users, user.uid), {
            college: college,
            class_level: classlevel,
        }).then(() => {

            navigation.navigate("SetUp3")
        }).catch((error) => {
            alert(error.message)
        });
    }



    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>

            <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 2/5"}/>


            <Text style={styles.formTitle}>Add The College/University You Are Currently Attending</Text>
            <UniversityPicker university_chosen={college} setUniversity={setCollege}/>
            
            <Text style={styles.formTitle}>Add Your Class Level</Text>
            <ClassLevelPicker selectedLevel={classlevel} setSelectedLevel={setClassLevel}/>            

            <TouchableOpacity
                disabled={incompleteform}
                style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                onPress={updateUserProfile}>
                <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Next</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    formTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#00308F",
        padding: 20
    },
    button: {
        padding: 5,
        backgroundColor: "blue",
        borderRadius: 20

    }
})

export default StudentSetupScreen;
