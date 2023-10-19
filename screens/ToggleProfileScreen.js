import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, TouchableHighlight } from 'react-native';
import ViewProfileScreen from './ViewProfileScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import EditProfileScreen from './EditProfileScreen';
import { useNavigation, useRoute } from '@react-navigation/core';


const ToggleProfileScreen = () => {
  const [showEdit, setShowEdit] = useState(true);
  const [isEditSaved, setIsEditSaved] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();

  const { params } = useRoute();
  const profile = params;


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.toggleIcons}>
        <TouchableOpacity style={{ paddingTop: 20 }} onPress={() => isEditSaved ? navigation.goBack() : setIsModalVisible(true)}>
          <Ionicons name="ios-arrow-back" size={30} color="#00BFFF" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', width: "35%", height: "80%", justifyContent: 'space-between', right: "14%", top: 10, borderWidth: 1, borderRadius: 10, backgroundColor: "#585858" }}>
          <TouchableOpacity style={{ padding:10, borderWidth: 1, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: showEdit ? "white" : "#A8A8A8" }} onPress={() => setShowEdit(true)}>
            {/* <Ionicons name="pencil" size={20} color="#00308F" /> */}
            <Text style={{color:"#00BFFF",fontSize:14}}>Edit</Text>

          </TouchableOpacity>
          <TouchableOpacity style={{ padding:10, borderWidth: 1, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: showEdit ? "#A8A8A8" : "white" }} onPress={() => isEditSaved ? setShowEdit(false) : setIsModalVisible(true)}>
            {/* <MaterialCommunityIcons name="eye" size={20} color="#00308F" /> */}
            <Text style={{color:"#00BFFF",fontSize:14}}>View</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {showEdit ? <EditProfileScreen profile={profile} setIsEditSaved={setIsEditSaved}/> : <ViewProfileScreen profile={profile} />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ padding: 5, fontWeight: "800", fontSize: 15, color: "white", textAlign:"center" }}>Make sure to fill all image slots and to save changes to profile before exiting.</Text>
            <TouchableHighlight
              style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "white" }}
              onPress={() => {
                setIsModalVisible(!isModalVisible);
              }}
            >
              <Text>Ok</Text>
              </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
    backgroundColor: "white"
  },
  toggleIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 40,
  },
  selectedIcon: {
    color: 'blue',
    fontSize: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
modalView: {
    height:"30%",
    width:"80%",
    backgroundColor: '#00BFFF',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
}
});

export default ToggleProfileScreen;