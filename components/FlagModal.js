import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import useAuth from '../hooks/useAuth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import deleteMatchFull from '../lib/deleteMatchFull';
import sendPush from '../lib/sendPush';
import deleteRequest from '../lib/deleteRequest';
import * as Sentry from "@sentry/react";


const FlagModal = ({ other_user, isVisible, setIsVisible, detailsId, type }) => {
  const { user } = useAuth();

  const navigation = useNavigation();

  const flagUserProfile = (flag) => {
    updateDoc(doc(db, global.users, other_user.id), {
      flags: arrayUnion({
        type: flag,
        reported_by: user.uid,
      }),
      flagged_status: "unresolved"
    }).then(async () => {
      if (other_user?.notifications && other_user.notifications.messages) {
        sendPush(other_user.token, "You've Been Flagged", "Tap to Learn More", { type: "flagged" })
      }
      setIsVisible(!isVisible);
      if (type && type === "match") {
        await deleteMatchFull(detailsId ).then(()=>{
          navigation.navigate("ToggleChat");
        });
      } else if (type && type === "request") {
        await deleteRequest(detailsId, user.uid).then(()=>{
          navigation.navigate("ToggleChat");
        })
      } else if (type && type === "groupchat"){
        navigation.navigate("ToggleChat");
      } else {
        navigation.navigate("Home", { refresh: true });
      }
      alert("Your report has been submitted.");
    }).catch((error) => {
      console.log(error.message)
      Sentry.captureMessage(`error flagging profile ${error.message} with detailid ${detailsId}`)
      alert("There was an error flagging profile. Try again later.")
      navigation.navigate("Home");

    });
  }


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(!isVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{ padding: 20, fontWeight: "bold", fontSize: 20 }}>Flag User</Text>

          <TouchableHighlight
            style={styles.opacitystyle}
            onPress={() => {
              flagUserProfile("Inappropriate Profile");
            }}
          >
            <Text style={styles.textStyle}>Inappropriate Profile</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.opacitystyle}
            onPress={() => {
              flagUserProfile("Fake/Stolen Account");
            }}
          >
            <Text style={styles.textStyle}>Fake or Stolen Account</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.opacitystyle}
            onPress={() => {
              flagUserProfile("Abusive Behavior/Messaging");
            }}
          >
            <Text style={styles.textStyle}>Abusive Behavior/Messaging</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.opacitystyle}
            onPress={() => {
              flagUserProfile("Spam/Selling Something");
            }}
          >
            <Text style={styles.textStyle}>Spam or Selling Something</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.opacitystyle}
            onPress={() => {
              setIsVisible(!isVisible);
              navigation.navigate("ReportOther", { other_user, detailsId, type });
            }}
          >
            <Text style={styles.textStyle}>Other</Text>
          </TouchableHighlight>


          <TouchableHighlight
            style={styles.opacitystyle}
            onPress={() => {
              setIsVisible(!isVisible);
            }}
          >
            <Text style={styles.textStyle}>Cancel</Text>
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

  },
  modalView: {
    height: "60%",
    width: "70%",
    // maxHeight:500,
    // maxWidth:"90%",
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  opacitystyle: {
    // borderColor: "#00308F",
    // borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 30,
    backgroundColor: "#00308F",
    width: "90%",
    height: "10%",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center"
  }

})

export default FlagModal;