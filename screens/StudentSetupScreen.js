import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, TextInput, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
// import UniversityPicker from '../components/UniversityPicker';
// import ClassLevelPicker from '../components/ClassLevelPicker';
import Header from '../Header';
// import GradYearPicker from '../components/GradYearPicker';
// import YNRadioButton from '../components/YNRadioButton';
import ImageUpload from '../components/ImageUpload';



const StudentSetupScreen = () => {
    const { user } = useAuth();
    const [college, setCollege] = useState(null);
    // const [classlevel, setClassLevel] = useState("Undergraduate");
    // const [grad_year, setGradYear] = useState("2027");
    const [universityPreference, setUniversityPreference] = useState(true);
    const [url1, setUrl1] = useState(null);
    const [url2, setUrl2] = useState(null);
    const [url3, setUrl3] = useState(null);

    const navigation = useNavigation();

    const incompleteform = !college || !url1 || !url2 || !url3;;

    const updateUserProfile = () => {
        updateDoc(doc(db, global.users, user.uid), {
            university_student: {
                status: "active"
            },
            school: college,
            preferences: {
                tag: "All",
                university: universityPreference,
                distance: "Global"
            },
            images: [url1, url2, url3]
        }).then(() => {

            navigation.navigate("SetUp3")
        }).catch((error) => {
            alert(error.message)
        });
    }



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "white" }}
            keyboardVerticalOffset={15}>
            <TouchableWithoutFeedback
            // onPress={Keyboard.dismiss()}
            >
                <ScrollView style={{ marginHorizontal: 10 }}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly", paddingBottom: 50 }}>

                        <SafeAreaView>
                            <Header style={{ right: "40%" }} title={"Account Setup 2/3"} />
                        </SafeAreaView>

                        <Text style={styles.formTitle}>Choose 3 Presentable Pictures Of Yourself</Text>
                        {/* <Text style={{fontSize:10, fontWeight: "bold", padding:5}}>Extra points, if they demonstrate your personality/interests!</Text> */}

                        <View style={{ flexDirection: "row", padding: 20, marginBottom: 20 }}>
                            <ImageUpload url={url1} setURL={setUrl1} index={0} userId={user.uid} />
                            <ImageUpload url={url2} setURL={setUrl2} index={1} userId={user.uid} />
                            <ImageUpload url={url3} setURL={setUrl3} index={2} userId={user.uid} />
                        </View>


                        {/* <View style={{ alignItems: "center" }}> */}
                        <Text style={styles.formTitle}>Enter The University You Are Currently Attending</Text>
                        {/* <UniversityPicker university_chosen={college} setUniversity={setCollege} /> */}
                        <TextInput
                            value={college}
                            onChangeText={setCollege}
                            placeholder={'I.e American University'}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, marginBottom: 20 }} />
                        {/* </View> */}

                        {/* <View style={{ padding: 20, alignItems: "center" }}>
                            <Text style={styles.formTitle}>Select Your Class Level</Text>
                            <ClassLevelPicker selectedLevel={classlevel} setSelectedLevel={setClassLevel} />
                        </View>

                        <View style={{ padding: 20, alignItems: "center" }}>
                            <Text style={styles.formTitle}>Select Your Graduation Year</Text>
                            <GradYearPicker selectedYear={grad_year} setSelectedYear={setGradYear} />
                        </View> */}

                        <View style={{ padding: 20, alignItems: "center", marginBottom: 20 }}>
                            <Text style={styles.formTitle}>Join Wing University?</Text>
                            <Text style={{ padding: 5 }}>{`(A space to exclusively match with other University students. You can change this setting later)`}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                                <Text style={{ marginRight: 10, fontWeight: "bold", fontSize: 15, }}>{universityPreference ? "Yes" : "No"}</Text>
                                <Switch
                                    trackColor={{ false: "red", true: "#00BFFF" }}
                                    thumbColor={universityPreference ? "white" : "grey"}
                                    onValueChange={setUniversityPreference}
                                    value={universityPreference}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            disabled={incompleteform}
                            style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                            onPress={updateUserProfile}>
                            <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", color: "white" }}>Next</Text>
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
        padding: 20
    },
    button: {
        padding: 5,
        backgroundColor: "blue",
        borderRadius: 20

    }
})

export default StudentSetupScreen;
