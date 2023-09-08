import React, { Component, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import FlagModal from './FlagModal';
import deleteMatchFull from '../lib/deleteMatchFull';
import RatingModal from './RatingModal';

const ChatHeader = ({matchedDetails, profile}) => {
    const navigator = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [ secondModal, setSecondModal ] = useState(false);
    const [ flag_modal, setFlagModal ] = useState(false);
    // const [ rating_modal, setRatingModal ] = useState(false);

    // const [ mute, setMute ] = useState(false);

    //call useEffect to update Mute state


    // const editNotifications = () => {
    //     if (mute){
    //       console.log("Unmute")
    //      //remove user from mute array in match document
    //      setMute(false);
    //      setModalVisible(!modalVisible)
    //     } else {
    //       console.log("Mute")
    //       //add user.uid to mute array in match document
    //       setMute(true);
    //       setModalVisible(!modalVisible)
    //     }
    //   };


    return (
      <View style={{flexDirection:"row", justifyContent:'space-evenly'}}>
        <TouchableOpacity onPress={() => navigator.goBack()} style={{padding: 2}}>
            <Ionicons name="chevron-back-outline" size={34} color="#00BFFF"/>
        </TouchableOpacity>
        {profile? (
          <TouchableOpacity onPress={() => navigator.navigate("ProfileView", {matchedDetails, profile})} style={{paddingVertical: 2, flexDirection:"row", marginHorizontal:"25%", left:"4%"}}>
            <Image style = {{height:40, width:40, borderRadius:50, borderWidth:1, borderColor:"#00BFFF"}} source = {{uri: profile.images[0]}}/>
            <Text style={{padding:10, fontWeight:"bold", fontSize:12, color:"white"}}> {profile.displayName} </Text>
          </TouchableOpacity>
        ):(
          <TouchableOpacity onPress={() => alert("Can't open empty user profile. Try again later.")} style={{paddingVertical: 2, flexDirection:"row", marginHorizontal:"25%", left:"4%"}}>
            <Image style = {{height:40, width:40, borderRadius:50, borderWidth:1, borderColor:"#00BFFF"}} source = {require("../images/account.jpeg")}/>
            <Text style={{padding:10, fontWeight:"bold", fontSize:12, color:"white"}}> Account User</Text>
        </TouchableOpacity>
        )}
        
        
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{padding: 2, flexDirection:"row"}}>
        <Ionicons name="menu" size={34} color="#00BFFF"/>
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
          {/* <TouchableHighlight
              style={{ borderColor:"grey", borderBottomWidth:2, padding:10, width:'100%'}}
              onPress={() => {
                editNotifications();
              }}
            >
              <Text style={styles.textStyle}>{mute?("Unmute Notifications"):("Mute Notifications")}</Text>
            </TouchableHighlight> */}
            {/* Unmatch function */}
            {/* <TouchableHighlight
              style={{ borderColor:"grey", borderBottomWidth:2, padding:10, width:'100%'}}
              onPress={() => {
                setModalVisible(!modalVisible);
                setRatingModal(true);
              }}
            >
              <Text style={styles.textStyle}>Rate Wing</Text>
            </TouchableHighlight> */}

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
                setFlagModal(true);
              }}
            >
              <Text style={styles.textStyle}>Report & Block User</Text>
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
                deleteMatchFull(profile.id);
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
      <FlagModal other_user={profile} isVisible={flag_modal} setIsVisible={setFlagModal} matchedID={matchedDetails.id}/>
      {/* <RatingModal other_user={profile} isVisible={rating_modal} matched={matchedDetails} onClose={() => setRatingModal(false)}/> */}
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