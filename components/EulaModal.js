import React, { useState } from 'react';
import { Modal, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';

function EulaModal({ handleAccept, handleReject, isVisible }) {
  const [accepted, setAccepted] = useState(false);

  function handleCheckboxChange() {
    setAccepted(!accepted);
  }

  function handleAcceptClick() {
    handleAccept();
  }

  function handleRejectClick() {
    handleReject();
  }

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>End-User License Agreement</Text>
          <Text style={{padding:10}}>This Agreement is between you and Wing and governs your use of the Wing mobile application ("App"). By using the App, you agree to be bound by the terms of this Agreement. Please read the following terms and conditions carefully:</Text>
          <ScrollView style={styles.list}>
            <Text>1. License: Subject to your compliance with the terms and conditions of this Agreement, the Application grants you a limited, non-exclusive, non-transferable, revocable license to use the Application for personal, non-commercial purposes only</Text>
            <Text>2. Intellectual Property: The Application and its entire contents, features, and functionality are owned by Wing or its licensors and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</Text>
            <Text>3. User Content: By using the Application, you may be able to upload, submit, store, send or receive content, including but not limited to text, images, audio, and video ("User Content"). You retain all rights in, and are solely responsible for, the User Content you create, publish, display or otherwise make available through the Application.</Text>
            <Text>4. Prohibited Use: You agree not to use the Application for any purpose that is prohibited by this Agreement or applicable law. You may not modify, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer or sell any information, software, products or services obtained from the Application.</Text>
            <Text>5. Privacy: Wing is committed to protecting your privacy. By using the Application, you acknowledge and agree to our Privacy Policy, which is incorporated into this Agreement.</Text>
            <Text>6. Termination: Wing may terminate this Agreement at any time without notice if you breach any of its terms. Upon termination, you must cease all use of the App.</Text>
            <Text>7. Termination: This Agreement will terminate automatically if you fail to comply with any of its terms and conditions. Upon termination, you must immediately cease all use of the Application.</Text>
            <Text>8. Disclaimer of Warranties: The Application is provided "as is" without warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose. Wing does not warrant that the Application will be uninterrupted or error-free.</Text>
            <Text>9. Limitation of Liability: In no event shall Wing be liable for any direct, indirect, incidental, special, consequential or punitive damages arising out of or in connection with your use of the Application.</Text>
            <Text>10. Governing Law: This Agreement shall be governed by and construed in accordance with the laws of the Commonwealth of Virginia, USA, without regard to its conflict of law provisions.</Text>
            <Text>11. No Tolerance for Objectionable Content or Abusive Users: Wing has a zero-tolerance policy for objectionable content or abusive users. Any user found to be posting objectionable content or engaging in abusive behavior will have their account terminated immediately.</Text>
            <Text>12. Entire Agreement: This Agreement constitutes the entire agreement between you and Wing with respect to the use of the Application and supersedes all prior or contemporaneous communications and proposals, whether oral or written, between you and Wing.</Text>
            <Text>By clicking "I Agree" or using the Application, you acknowledge that you have read this Agreement, understand it, and agree to be bound by its terms and conditions. If you do not agree to the terms and conditions of this Agreement, do not use the Application.</Text>
          </ScrollView>
          <View style={styles.checkbox}>
            <TouchableOpacity onPress={handleCheckboxChange}>
              <View style={accepted ? styles.checkedBox : styles.uncheckedBox} />
            </TouchableOpacity>
            <Text style={styles.checkboxText}>I accept the terms and conditions of this Agreement</Text>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={handleAcceptClick}
              disabled={!accepted}
              style={[styles.button, accepted ? styles.acceptButton : styles.disabledButton]}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRejectClick} style={styles.button}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    height:500
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    alignSelf: 'stretch',
    marginBottom: 10,
    borderWidth: 2,
    padding:10

  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    marginLeft: 10,
  },
  checkedBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#007aff',
    backgroundColor: '#007aff',
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#007aff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007aff',
  },
  acceptButton: {
    backgroundColor: '#007aff',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default EulaModal;
