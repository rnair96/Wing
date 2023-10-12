import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../Header';
import ImageUpload from '../components/ImageUpload';



const SetUp2Screen = () => {
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [url1, setUrl1] = useState(null);
    const [url2, setUrl2] = useState(null);
    const [url3, setUrl3] = useState(null);


    const incompleteform = !job || !url1 || !url2 || !url3;


    const navigation = useNavigation();

    const updateUserProfile = () => {
        updateDoc(doc(db, global.users, user.uid), {
            job: job,
            images: [url1, url2, url3],
        }).then(() => {

            navigation.navigate("SetUp3")
        }).catch((error) => {
            alert(error.message)
        });
    }



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "black" }}
            keyboardVerticalOffset={10}>

            <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>

                <TouchableWithoutFeedback
                    // onPress={Keyboard.dismiss()}
                >
                    <View>
                        <Header style={{ fontSize: 20, fontWeight: "bold", padding: 20 }} title={"Account Setup 2/3"} />
                    </View>
                </TouchableWithoutFeedback>


                <Text style={styles.formTitle}>Choose 3 Presentable Pictures Of Yourself</Text>
                {/* <Text style={{fontSize:10, fontWeight: "bold", padding:5}}>Extra points, if they demonstrate your personality/interests!</Text> */}

                <View style={{ flexDirection: "row", padding: 20 }}>
                    <ImageUpload url={url1} setURL={setUrl1} index={0} userId={user.uid} />
                    <ImageUpload url={url2} setURL={setUrl2} index={1} userId={user.uid} />
                    <ImageUpload url={url3} setURL={setUrl3} index={2} userId={user.uid} />
                </View>


                <Text style={styles.formTitle}>Add Job Title</Text>
                <TextInput
                    value={job}
                    onChangeText={setJob}
                    placeholder={'I.e Lawyer'}
                    placeholderTextColor={"grey"}
                    style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, color: "white" }} />

                

                <TouchableOpacity
                    disabled={incompleteform}
                    style={[{ width: 200, height: 50, paddingTop: 15, top: 20, borderRadius: 10 }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                    onPress={updateUserProfile}>
                    <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Next</Text>
                </TouchableOpacity>

            </SafeAreaView>
            {/* </TouchableWithoutFeedback> */}
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
