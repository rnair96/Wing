import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, TouchableHighlight } from 'react-native';
import ViewMyProfileScreen from './ViewMyProfileScreen';
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
        <View style={{ flexDirection: 'row', width: "40%", justifyContent: 'space-between', right: "10%", borderBottomWidth:1, borderColor:"#E0E0E0", marginLeft:"35%" }}>
          <TouchableOpacity style={{ padding:10, alignItems: "center", justifyContent: "center" }} onPress={() => setShowEdit(true)}>
            {/* <Ionicons name="pencil" size={20} color="#00BFFF#00308F" /> */}
            <Text style={{color: showEdit ? "#00308F" : "#A8A8A8",fontSize:17, fontWeight:"bold"}}>Edit</Text>

          </TouchableOpacity>
          <TouchableOpacity style={{ padding:10, alignItems: "center", justifyContent: "center" }} onPress={() => isEditSaved ? setShowEdit(false) : setIsModalVisible(true)}>
            {/* <MaterialCommunityIcons name="eye" size={20} color="#00308F" /> */}
            <Text style={{color: showEdit ? "#A8A8A8":"#00308F",fontSize:17, fontWeight:"bold"}}>View</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ paddingTop: 5 }} onPress={() => isEditSaved ? navigation.goBack() : setIsModalVisible(true)}>
          {/* <Ionicons name="ios-arrow-back" size={30} color="#00BFFF" /> */}
          <Ionicons name="chevron-forward-outline" size={30} color="#00308F"/>
        </TouchableOpacity>
      </SafeAreaView>
      {showEdit ? <EditProfileScreen profile={profile} setIsEditSaved={setIsEditSaved}/> : <ViewMyProfileScreen profile={profile} />}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ padding: 5, fontWeight: "bold", fontSize: 15, textAlign:"center" }}>Make sure to fill all image slots and to save changes to profile before exiting.</Text>
            <TouchableHighlight
              style={{ width: "90%", height:"20%", backgroundColor: "#00308F", borderRadius:10, justifyContent:"center", alignItems:"center" }}
              onPress={() => {
                setIsModalVisible(!isModalVisible);
              }}
            >
              <Text style={{color:"white", fontWeight: 'bold', textAlign: 'center'}}>Ok</Text>
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
    marginBottom: 30,
    marginTop:30,
  },
  selectedIcon: {
    color: 'blue',
    fontSize: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
},
modalView: {
    height:"30%",
    width:"80%",
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
}
});

export default ToggleProfileScreen;