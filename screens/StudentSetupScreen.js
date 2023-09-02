import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import UniversityPicker from '../components/UniversityPicker';
import ClassLevelPicker from '../components/ClassLevelPicker';
import Header from '../Header';
import GradYearPicker from '../components/GradYearPicker';
import YNRadioButton from '../components/YNRadioButton';


const StudentSetupScreen = () => {
    const { user } = useAuth();
    const [college, setCollege] = useState("University of Maryland College Park");
    const [classlevel, setClassLevel] = useState("Undergraduate");
    const [grad_year, setGradYear] = useState("2027");
    const [universityPreference, setUniversityPreference] = useState("Yes");

    const navigation = useNavigation();

    const incompleteform = !college || !classlevel;

    const updateUserProfile = () => {
        updateDoc(doc(db, global.users, user.uid), {
            university_student: {
                class_level: classlevel,
                grad_year: grad_year,
                status: "active"
            },
            school: college,
            universityPreference: universityPreference
        }).then(() => {

            navigation.navigate("SetUp3")
        }).catch((error) => {
            alert(error.message)
        });
    }



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={15}>
            <TouchableWithoutFeedback
            // onPress={Keyboard.dismiss()}
            >
                <ScrollView style={{ marginHorizontal: 10 }}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly", paddingBottom:50}}>

                    <SafeAreaView>
                    <Header style={{ fontSize: 20, fontWeight: "bold", padding: 20 }} title={"Account Setup 2/5"} />
                    </SafeAreaView>


                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Text style={styles.formTitle}>Select The University You Are Currently Attending</Text>
                        <UniversityPicker university_chosen={college} setUniversity={setCollege} />
                    </View>

                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Text style={styles.formTitle}>Select Your Class Level</Text>
                        <ClassLevelPicker selectedLevel={classlevel} setSelectedLevel={setClassLevel} />
                    </View>

                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Text style={styles.formTitle}>Select Your Graduation Year</Text>
                        <GradYearPicker selectedYear={grad_year} setSelectedYear={setGradYear} />
                    </View>

                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Text style={styles.formTitle}>Join Wing University?</Text>
                        <Text style={{padding:5}}>{`(A space to exclusively match with other University students. You can change this setting later)`}</Text>
                        <YNRadioButton selectedOption={universityPreference} setSelectedOption={setUniversityPreference} />
                    </View>

                    <TouchableOpacity
                        disabled={incompleteform}
                        style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                        onPress={updateUserProfile}>
                        <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Next</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>


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
