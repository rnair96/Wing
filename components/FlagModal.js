import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import useAuth from '../hooks/useAuth';
import { doc, updateDoc, serverTimestamp, arrayUnion} from 'firebase/firestore';
import { db } from '../firebase';


const FlagModal = ({other_user, isVisible}) => {
    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(null);

    useEffect(()=>{
        setModalVisible(isVisible);
    },[isVisible])


    const flagUserProfile = (flag) => {
        updateDoc(doc(db, 'users', other_user.id), {
            flags: arrayUnion({
                type: flag,
                reported_by: user.uid,
                status: "unresolved"
            })
        }).then(()=> {
                alert("Your report has been submitted.");
                setModalVisible(!modalVisible);
        }).catch((error) => {
            alert(error.message)
        });
    }


    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Flag Profile</Text>

            <TouchableHighlight
              style={{ borderColor:"grey", borderBottomWidth:2, padding:10, width:'100%'}}
              onPress={() => {
                flagUserProfile("Inappropriate Profile");
              }}
            >
              <Text style={styles.textStyle}>Inappropriate Profile</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={{ borderColor:"grey", borderBottomWidth:2, padding:10, width:'100%'}}
              onPress={() => {
                flagUserProfile("Fake/Scam Account");
              }}
            >
              <Text style={styles.textStyle}>Fake/Scam Account</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={{ borderColor:"grey", borderBottomWidth:2, padding:10, width:'100%'}}
              onPress={() => {
                flagUserProfile("Other");
                //FlagModalscreen to take text input and submit
              }}
            >
              <Text style={styles.textStyle}>Other</Text>
            </TouchableHighlight>
            

            <TouchableHighlight
              style={{ borderColor:"grey", borderBottomWidth:2, padding:10, width:'100%'}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide</Text>
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
      alignItems: 'center'
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding:10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
      }
})  

export default FlagModal;