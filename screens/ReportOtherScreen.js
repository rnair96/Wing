import React, {useState} from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { doc, updateDoc, arrayUnion} from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import deleteMatchFull from '../lib/deleteMatchFull';


const ReportOtherScreen = () => {
    const { user } = useAuth();

    const [report, setReport ] = useState(null)

  const navigation = useNavigation();
  const { params } = useRoute();

  const { other_user, matchedID } = params;

  
  const flagUserProfile = (flag) => {
    updateDoc(doc(db, 'users', other_user.id), {
        flags: arrayUnion({
            type: flag,
            reported_by: user.uid,
            status: "unresolved"
        })
    }).then(async ()=> {
            alert("Your report has been submitted.");
            if(matchedID){
               await deleteMatchFull(matchedID, navigation)
            } else {
                navigation.navigate("Home");
            }
    }).catch((error) => {
        alert(error.message)
    });
}

    return (
      <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly", backgroundColor:"#00BFFF", opacity:0.95}}>
      <Text style={{color:"white", fontSize:30, fontWeight:"bold"}}> Give Reason</Text>
      <Text style={styles.boldtext}>Provide details for the report you wish to submit.</Text>
      <Text style={styles.boldtext}>We appreciate your participation in keeping our community safe from abuse and wrongful behavior.</Text>
            <TextInput
                multiline
                numberOfLines={3}
                onChangeText = {setReport} 
                placeholder={'Provide Reason for Report'}
                style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
            <TouchableOpacity 
                style={{ borderColor:"grey", borderWidth:2, borderRadius:20, padding:10}}
                onPress={() => 
                    flagUserProfile(report)
                }><Text>Submit</Text></TouchableOpacity>
            <TouchableOpacity  
                style={{ borderColor:"grey", borderWidth:2, borderRadius:20, padding:10}}
                onPress={() => navigation.goBack()}><Text>Back</Text></TouchableOpacity>
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