import React from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoogleSlidesViewer from '../components/GoogleSlidesViewer';




const WorkshopScreen = () => {
  const navigator = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop:10, height: "80%", width:"95%" }}>
        <GoogleSlidesViewer />
      </View>
      <TouchableOpacity onPress={() => navigator.goBack()} style={{ marginTop: 20,...styles.opacityStyle }}>
        <Text style={styles.textStyle}>Return To Chat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:"center"
  },
  opacityStyle: {
    paddingVertical: 5,
    paddingHorizontal: 30,
    backgroundColor: "#00308F",
    width: "90%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default WorkshopScreen;
