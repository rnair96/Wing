import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native';


const WaitlistModal = ({ isModalVisible, usersNumber}) => {

    return (

        <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 15, textAlign:"center" }}>Features Unlock After 100 DC Users Sign Up</Text>
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 13}}>Current Number of Users:</Text>
                        <View style={{backgroundColor: "#00308F", borderRadius:20, padding:10}}>
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 25, color:"white"}}>{usersNumber}</Text>
                        </View>
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 13, textAlign:"center"}}>Get a Friend To Join For A Quicker Launch!</Text>
                    </View>
                </View>
            </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
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
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }

})

export default WaitlistModal;