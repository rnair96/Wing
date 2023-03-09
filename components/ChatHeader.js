import React, { Component, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';
import { deleteDoc, doc, writeBatch, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
// import messaging from '@react-native-firebase/messaging';


const ChatHeader = ({matchedDetails}) => {
    const navigator = useNavigation();
    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [ secondModal, setSecondModal ] = useState(false);
    const [ mute, setMute ] = useState(false);

    const matched_user = getMatchedUserInfo(matchedDetails.users, user.uid);

    //call useEffect to update Mute state


    const editNotifications = () => {
        if (mute){
          console.log("Unmute")
         //remove user from mute array in match document
         setMute(false);
         setModalVisible(!modalVisible)
        } else {
          console.log("Mute")
          //add user.uid to mute array in match document
          setMute(true);
          setModalVisible(!modalVisible)
        }
      };

    const deleteMatch = async () => {
        await deleteDoc(doc(db, 'matches', matchedDetails.id)).then(() => {
           console.log("Match has been deleted successfully.")
           navigator.navigate("Chat")
            
        })
        .catch(error => {
            console.log('Error deleting Match',error);
        })
    }

    const deleteMessages = async () => {
        const batch = writeBatch(db);
        const messages =[]
        await getDocs(collection(db,"matches", matchedDetails.id, "messages")).then((snapshot) => {
            snapshot.docs.map((doc) => messages.push(doc.id))
        })

        if (messages.length>0){
            messages.map((messageID)=>{
                batch.delete(doc(db,'matches', matchedDetails.id, "messages", messageID))
            })
    
            await batch.commit().then(() => {
                console.log('Messages deleted successfully.');
                deleteMatch();
            }).catch((error) => {
                console.error('Error deleting messages: ', error);
            });
        }
        
    }

    return (
      <View style={{flexDirection:"row", justifyContent:'space-evenly'}}>
        <TouchableOpacity onPress={() => navigator.goBack()} style={{padding: 2}}>
            <Ionicons name="chevron-back-outline" size={34} color="#00308F"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigator.navigate("ProfileView", {matchedDetails})} style={{paddingHorizontal:30, paddingVertical: 2, flexDirection:"row"}}>
            <Image style = {{height:35, width:35, borderRadius:50}} source = {{uri: matched_user[1]?.images[0]}}/>
            <Text style={{padding:10, fontWeight:"bold", fontSize:12}}> {matched_user[1]?.displayName} </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{padding: 2, flexDirection:"row"}}>
        <Ionicons name="menu" size={34} color="#00308F"/>
        </TouchableOpacity>
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
            {/* Mute Notifications */}
          <TouchableHighlight
              style={{ borderColor:"grey", borderBottomWidth:2, padding:10, width:'100%'}}
              onPress={() => {
                editNotifications();
              }}
            >
              <Text style={styles.textStyle}>{mute?("Unmute Notifications"):("Mute Notifications")}</Text>
            </TouchableHighlight>
            {/* Unmatch function */}
            <TouchableHighlight
              style={{ borderColor:"grey", borderBottomWidth:2, padding:10, width:'100%'}}
              onPress={() => {
                setModalVisible(!modalVisible);
                setSecondModal(true);
              }}
            >
              <Text style={styles.textStyle}>Unmatch</Text>
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


      <Modal
        animationType="slide"
        transparent={true}
        visible={secondModal}
        onRequestClose={() => {
          setSecondModal(!secondModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
        <Text>Are You Sure?</Text>
        <TouchableHighlight
              style={{ borderColor:"grey", borderBottomWidth:2, padding:10, width:'100%'}}
              onPress={() => {
                deleteMessages();
              }}
            >
              <Text style={styles.textStyle}>Yes</Text>
            </TouchableHighlight>
        <TouchableHighlight
              style={{ borderColor:"grey", borderBottomWidth:2, padding:10, width:'100%'}}
              onPress={() => {
                setSecondModal(!secondModal);
              }}
            >
              <Text style={styles.textStyle}>No</Text>
            </TouchableHighlight>
            </View>
            </View>


      </Modal>
      </View>
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

export default ChatHeader