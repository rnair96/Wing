import React, { Component, useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FlagModal from './FlagModal';
import deleteMatchFull from '../lib/deleteMatchFull';
import Constants from 'expo-constants';


const ChatHeader = ({ details, type, profile }) => {
  const navigator = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModal, setSecondModal] = useState(false);
  const [flag_modal, setFlagModal] = useState(false);
  const name = profile && profile?.displayName ? profile.displayName : "Account User";

  const { masterId } = Constants.expoConfig.extra;
  const [isMaster, SetIsMaster] = useState(false);

  useEffect(()=>{
    if ((type === "request" && details.id === masterId) || (type === "match" && details.id.includes(masterId))) {
        SetIsMaster(true);
      }
  },[masterId])

  // if ((type === "request" && details.id === masterId) || (type === "match" && details.id.includes(masterId))) {
  //   SetIsMaster(true);
  // }

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
    <View style={{ flexDirection: "row", justifyContent: 'space-evenly', backgroundColor: "white", paddingBottom: 5, borderBottomWidth: 1, borderColor: "#E0E0E0", margin: 5 }}>
      <TouchableOpacity onPress={() => navigator.goBack()} style={{ padding: 2 }}>
        <Ionicons name="chevron-back-outline" size={34} color="#00BFFF" />
      </TouchableOpacity>
      {profile ? (
        <TouchableOpacity onPress={() => navigator.navigate("ProfileView", { profile })} style={{ paddingVertical: 2, flexDirection: "row", marginHorizontal: "25%", left: "4%" }}>
          <Image style={{ height: 40, width: 40, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }} source={{ uri: profile.images[0] }} />
          <Text style={{ padding: 10, fontWeight: "bold", fontSize: 12 }}> {profile.displayName} </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => alert("Can't open empty user profile. Try again later.")} style={{ paddingVertical: 2, flexDirection: "row", marginHorizontal: "25%", left: "4%" }}>
          <Image style={{ height: 40, width: 40, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }} source={require("../images/account.jpeg")} />
          <Text style={{ padding: 10, fontWeight: "bold", fontSize: 12 }}> Account User</Text>
        </TouchableOpacity>
      )}


      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ padding: 2, flexDirection: "row" }}>
        <Ionicons name="menu" size={34} color="#00BFFF" />
      </TouchableOpacity>
      <Modal
        animationType="fade"
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
            <Text style={{ padding: 20, fontWeight: "bold", fontSize: 20 }}>Chat Options</Text>

            {type === "match" &&
              <TouchableHighlight
                style={styles.opacityStyle}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setSecondModal(true);
                }}
              >
                <Text style={styles.textStyle}>Unmatch</Text>
              </TouchableHighlight>
            }

            {!isMaster &&
              <TouchableHighlight
                style={styles.opacityStyle}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setFlagModal(true);
                }}
              >
                <Text style={styles.textStyle}>Report & Block User</Text>
              </TouchableHighlight>
            }

            <TouchableHighlight
              style={styles.opacityStyle}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>

          </View>
        </View>
      </Modal>


      <Modal
        animationType="fade"
        transparent={true}
        visible={secondModal}
        onRequestClose={() => {
          setSecondModal(!secondModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={{ ...styles.modalView, width: "70%" }}>
            <Text style={{ padding: 12, fontWeight: "bold", fontSize: 17, textAlign: "center" }}>Are You Sure You Want to Unmatch? {name} Will Not Be Shown Again.</Text>
            <TouchableHighlight
              style={styles.opacityStyle}
              onPress={() => {
                setSecondModal(!secondModal);
                deleteMatchFull(details.id).then(()=>{
                  navigator.navigate("ToggleChat")
                });
              }}
            >
              <Text style={styles.textStyle}>Yes</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.opacityStyle}
              onPress={() => {
                setSecondModal(!secondModal);
              }}
            >
              <Text style={styles.textStyle}>No</Text>
            </TouchableHighlight>
          </View>
        </View>


      </Modal>
      <FlagModal other_user={profile} isVisible={flag_modal} setIsVisible={setFlagModal} detailsId={details.id} type={type} />
      {/* <RatingModal other_user={profile} isVisible={rating_modal} matched={matchedDetails} onClose={() => setRatingModal(false)}/> */}
    </View>
  )
}

const styles = StyleSheet.create({
  // centeredView: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },
  // modalView: {
  //   backgroundColor: 'white',
  //   borderRadius: 20,
  //   padding:10,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5
  // },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background

  },
  modalView: {
    height: "30%",
    width: "60%",
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
      height: 3
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
  opacityStyle: {
    // borderColor: "#00308F", 
    // borderWidth: 2, 
    paddingVertical: 5,
    paddingHorizontal: 30,
    backgroundColor: "#00308F",
    width: "90%",
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  }
})

export default ChatHeader