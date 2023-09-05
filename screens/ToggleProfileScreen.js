import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import ViewProfileScreen from './ViewProfileScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons} from '@expo/vector-icons';
import EditProfileScreen from './EditProfileScreen';
import { useNavigation, useRoute } from '@react-navigation/core';


const ToggleProfileScreen = () => {
  const [showEdit, setShowEdit] = useState(true);

  const navigation = useNavigation();

  const { params } = useRoute();
  const profile = params;


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.toggleIcons}>
      <TouchableOpacity style={{paddingTop:20}} onPress={() => navigation.goBack()}>
            <Ionicons name="ios-arrow-back" size={30} color = "#00BFFF"/>
            </TouchableOpacity>
        <View style={{flexDirection: 'row', width:"30%", height:"80%",justifyContent:'space-between',right:"17%", top:10, borderWidth:1, borderRadius:10, backgroundColor:"#585858"}}>
        <TouchableOpacity style={{height:40, width:40, borderWidth:1, borderRadius:10, alignItems:"center", justifyContent:"center", backgroundColor:showEdit?"white":"#A8A8A8"}} onPress={() => setShowEdit(true)}>
          <Ionicons name="pencil" size={20} color = "#00308F"/>
        </TouchableOpacity>
        <TouchableOpacity style={{height:40, width:40, borderWidth:1, borderRadius:10, alignItems:"center", justifyContent:"center", backgroundColor:showEdit?"#A8A8A8":"white"}} onPress={() => setShowEdit(false)}>
          <MaterialCommunityIcons name="eye" size={20} color="#00308F"/>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
      {showEdit ? <EditProfileScreen profile = {profile} /> : <ViewProfileScreen profile = {profile} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
    backgroundColor:"black"
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
});

export default ToggleProfileScreen;