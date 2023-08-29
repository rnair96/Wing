import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../Header';


const SetUp2Screen = () => {
    const { user } = useAuth();
    const [occupation, setOccupation] = useState(null);
    const [company, setCompany] = useState(null);


    const incompleteform = !occupation;


    const navigation = useNavigation();

    const updateUserProfile = () => {
        updateDoc(doc(db, global.users, user.uid), {
            occupation: occupation,
            company: company,
        }).then(() => {

            navigation.navigate("SetUp3")
        }).catch((error) => {
            alert(error.message)
        });
    }



    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>

            <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account Setup 2/5"}/>


            <Text style={styles.formTitle}>Add Job Title</Text>
            <TextInput
                value={occupation}
                onChangeText={setOccupation}
                placeholder={'I.e Lawyer'}
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15 }} />
            
            <Text style={styles.formTitle}>{`(Optional)`} Add Company You Work At </Text>
            <TextInput
                value={company}
                onChangeText={setCompany}
                placeholder={'I.e Some Firm Name'}
                style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15 }} />
            
        <TouchableOpacity 
          disabled = {incompleteform}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteform ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {updateUserProfile}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Next</Text>
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

export default SetUp2Screen;
