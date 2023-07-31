import React, {useState} from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { doc, updateDoc, arrayUnion} from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import deleteMatchFull from '../lib/deleteMatchFull';
import sendPush from '../lib/sendPush';


const ReportOtherScreen = () => {
    const { user } = useAuth();

    const [report, setReport ] = useState(null)

  const navigation = useNavigation();
  const { params } = useRoute();

  const { other_user, matchedID } = params;

  const incompleteForm = !report;

  
  const flagUserProfile = (flag) => {
    updateDoc(doc(db, global.users, other_user.id), {
        flags: arrayUnion({
            type: flag,
            reported_by: user.uid,
            status: "unresolved"
        })
    }).then(async ()=> {
            sendPush(other_user.token, "You've Been Flagged", "Tap to Learn More",{type:"flagged"});
            if(matchedID){
               await deleteMatchFull(matchedID, navigation)
            } else {
                navigation.navigate("Home");
            }
            alert("Your report has been submitted.");
    }).catch((error) => {
        alert(error.message)
    });
}

    return (
      <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly", backgroundColor:"#00BFFF", opacity:0.95}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{alignItems:"center", justifyContent:"space-evenly", padding:20, height:"30%"}}>
        <Text style={{color:"white", fontSize:30, fontWeight:"bold"}}> Give Reason</Text>
        <Text style={styles.boldtext}>Provide details for the report you wish to submit.</Text>
        <Text style={styles.boldtext}>We appreciate your participation in keeping our community safe from abuse and wrongful behavior!</Text>
        </View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{height:"50%", width:"90%"}}
            keyboardVerticalOffset={5}
            > 
            <View style={{alignItems:"center", justifyContent:"space-evenly", height:"70%"}}>
            <TextInput
                multiline
                numberOfLines={3}
                onChangeText = {setReport} 
                placeholder={'Provide Reason for Report'}
                style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15, backgroundColor:"white"}}/>
            <TouchableOpacity
                disabled = {incompleteForm}
                style={[{ borderColor:"grey", borderWidth:2, borderRadius:20, padding:10, width:"30%", alignItems:"center"}, incompleteForm ? {backgroundColor:"grey"} : {backgroundColor:"white"}]}
                onPress={() => 
                    flagUserProfile(report)
                }><Text>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity  
                style={{ borderColor:"grey", borderWidth:2, borderRadius:20, padding:10, width:"30%", alignItems:"center", backgroundColor:"white"}}
                onPress={() => navigation.goBack()}><Text>Back</Text>
            </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
          </SafeAreaView>      
    )
}

const styles = StyleSheet.create({
    boldtext: {
      fontSize:15,
      fontWeight:"bold",
      padding:5,
      marginLeft:10,
      marginRight:10
    }
  });



export default ReportOtherScreen;