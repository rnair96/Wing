import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Text, SafeAreaView, TouchableOpacity, TextInput, View, Modal, TouchableHighlight, StyleSheet} from 'react-native';
import emailjs from 'emailjs-com';
import Header from '../Header';

function HelpScreen() {
  const { params } = useRoute();
  const profile = params;
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();


  const incompleteForm = !subject||!message;


  const handleSubmit = () => {

    const templateParams = {
      from_name: profile.displayName,
      from_email: profile.email,
      reply_to: profile.email,
      to_email: 'support@wing.community',
      to_name: 'Wing Support',
      subject: subject,
      message: message,
    };

    emailjs.init('OFYWf9ijhfAbfplHv');//save keys somewhere private

    emailjs.send(
      'service_ryc1b9q',
      'template_qj7dpppi',
      templateParams,
      'OFYWf9ijhfAbfplHv'
    );

    setSubject('');
    setMessage('');
    setModalVisible(true)
  };

  return (
    <SafeAreaView style={{margin:20}}>
    <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Help"}/>
    <View style={{height:"80%",justifyContent:"space-evenly", alignItems:"center"}}>
    <Text style={{fontSize:15, textAlign:"center"}}>
        Submit this form on what issue you're experiencing. Our support team will reach out to you in 48 hours.
        </Text>
    <Text style={{fontWeight:'bold'}}>Subject:</Text>
    <TextInput
      value = {subject}
      onChangeText = {setSubject} 
      placeholder={'What is the Issue?'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
    <Text style={{fontWeight:'bold'}}>Message:</Text>
    <TextInput
      value = {message}
      multiline
      numberOfLines={3}
      onChangeText = {setMessage} 
      placeholder={'Describe in detail the issue you are experiencing.'}
      style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
    <TouchableOpacity 
          disabled = {incompleteForm}
          style={[{width:200, height:50, paddingTop:15, top:20, borderRadius:10}, incompleteForm ? {backgroundColor:"grey"} : {backgroundColor:"#00308F"}]}
          onPress = {handleSubmit}>
          <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Submit</Text>
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
            <Text style={{fontSize:14, textAlign:"center", paddingBottom:10}}>Your Form has been submitted! Support team will reach out via your contact email.</Text>
            <TouchableHighlight
              style={{ borderColor:"grey", borderWidth:2, padding:15, width:300}}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.goBack();
              }}
            >
              <Text style={styles.textStyle}>OK</Text>
            </TouchableHighlight>
          </View>
          </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'space-evenly',
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
    });

export default HelpScreen;
