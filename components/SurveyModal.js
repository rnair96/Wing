import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, SafeAreaView, TextInput, TouchableOpacity, TouchableHighlight, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import * as Sentry from "@sentry/react";
import QuestionComponent from '../components/QuestionComponent';


const SurveyModal = ({ type, isVisible, setIsVisible, otherInfo, reload, setReload}) => {
    const { user } = useAuth();

    const [selectedAnswer1, setSelectedAnswer1] = useState(null);
    const [selectedAnswer2, setSelectedAnswer2] = useState(null);
    const [selectedAnswer3, setSelectedAnswer3] = useState(null);
    const [selectedAnswer4, setSelectedAnswer4] = useState(null);
    const [selectedAnswer5, setSelectedAnswer5] = useState(null);
    const [selectedAnswer6, setSelectedAnswer6] = useState(null);


    const incompleteform = selectedAnswer1 === null || selectedAnswer2 === null || selectedAnswer3 === null || selectedAnswer4 === null || selectedAnswer5 === null || selectedAnswer6 === null;

    const updateUserProfile = () => {

        const surveyObject =
            type === "initial" ?
                {
                    "initial":
                    {
                        "Dating App Success": selectedAnswer1,
                        "Had Wingman Y/N": selectedAnswer2,
                        "Trapped Level": selectedAnswer3,
                        "Loneliness Level": selectedAnswer4,
                        "Approach Rate": selectedAnswer5,
                        "Approach Confidence": selectedAnswer6,

                    }
                } :
                {
                    ...otherInfo,
                    "sixtydays":
                    {
                        "Wing Going Out Rate": selectedAnswer1,
                        "Wing Approach Ease": selectedAnswer2,
                        "Trapped Level": selectedAnswer3,
                        "Loneliness Level": selectedAnswer4,
                        "Approach Rate": selectedAnswer5,
                        "Approach Confidence": selectedAnswer6,

                    }
                }

        console.log("setting survey data");

        updateDoc(doc(db, global.users, user.uid), {
            surveyInfo: surveyObject
        }).then(() => {
            setIsVisible(!isVisible);
            setReload(!reload);
        }).catch((error) => {
            alert("Error updating profile with survey. Try again later.")
            Sentry.captureMessage(`Error setting data in survey modal for ${user.uid}, ${error.message}`)
        });
    }



    return (
        <Modal
            visible={isVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={{ height: "80%", ...styles.modalView }}>
                    <ScrollView contentContainerStyle={{ width: "90%", alignItems: "center" }}>

                        <Text style={{ fontSize: 17, fontWeight: "bold", textAlign: "center" }}>Real Quick! Please Select Answers For This 1-Minute Survey</Text>
                        <Text style={{ paddingTop: 10, paddingBottom:20, color: "grey", textAlign: "center" }}>Your answers won't be shared with anyone else and will be used anonomously.</Text>

                        {type === "initial" ? (
                            <View>
                                <QuestionComponent
                                    question="How often would you say you get dates on dating apps when you use them?"
                                    answers={[(`Never or Don't Use Dating Apps`), (`Rarely`), (`Sometimes`), 'A Good Amount', 'Often']}
                                    setSelectedAnswer={setSelectedAnswer1}
                                />
                                <QuestionComponent
                                    question="Have you gone out with a Wingman before using this app?"
                                    answers={['Yes', 'No']}
                                    setSelectedAnswer={setSelectedAnswer2}
                                />
                            </View>

                        ) : (
                            <View>
                                <QuestionComponent
                                    question={(`How often have you gone out with a Wing you met on this app?`)}
                                    answers={[(`I Haven't Gone Out With A Wing`), 'Once', 'Twice', 'Three', 'Over Three Times']}
                                    setSelectedAnswer={setSelectedAnswer1}
                                />
                                <QuestionComponent
                                    question="How much more fun/easier was it to approach women with your Wing?"
                                    answers={['I Did Not Go Out With A Wing', 'I Did Not Approach Women With My Wing', 'Not Much', 'Somewhat', 'Alot']}
                                    setSelectedAnswer={setSelectedAnswer2}
                                />
                            </View>
                            // Should it measure number of approaches or the success of the approaches themselves??
                        )}
                        <QuestionComponent
                            question="How often do you experience feelings of being trapped or powerless with your dating life? "
                            answers={['Never', 'Rarely', 'Sometimes', 'A Good Amouont', 'Often']}
                            setSelectedAnswer={setSelectedAnswer3}
                        />

                        <QuestionComponent
                            question="How often would you experience general feelings of loneliness?"
                            answers={['Never', 'Rarely', 'Sometimes', 'A Good Amount', 'Often']}
                            setSelectedAnswer={setSelectedAnswer4}
                        />
                        <QuestionComponent
                            question="When the opportunity arises, how often would you say you approach and flirt with women in real life?"
                            answers={['Never', (`Rarely`), 'Sometimes', 'A Good Amount', 'Often']}
                            setSelectedAnswer={setSelectedAnswer5}
                        />
                        <QuestionComponent
                            question="When you did approach a woman, how confident did you feel?"
                            answers={[(`I've Never Approached`), 'Little to No Confidence', 'Somewhat Confident', 'Pretty Confident', 'Very Confident']}
                            setSelectedAnswer={setSelectedAnswer6}
                        />

                    </ScrollView>
                    <TouchableHighlight
                        disabled={incompleteform}
                        style={[{ ...styles.button }, incompleteform ? { backgroundColor: "grey" } : { backgroundColor: "#00308F" }]}
                        onPress={updateUserProfile}>
                        <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "bold" }}>Finish Survey</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background

        // top:40
    },
    modalView: {
        width: "85%",
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
    button: {
        margin: 5,
        paddingVertical: 5,
        paddingHorizontal: 30,
        backgroundColor: "#00308F",
        alignItems: "center",
        borderRadius: 10,
        width: "60%",
        height: "10%",
        justifyContent: "center"
    }

})


export default SurveyModal;

