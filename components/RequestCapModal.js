import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native';


const RequestCapModal = ({ isModalVisible, setIsModalVisible }) => {

    return (

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
                    <Text style={{ padding: 5, fontWeight: "800", fontSize: 15 }}>No More Chat Requests Available!</Text>
                    <Text style={{ padding: 5, fontWeight: "700", paddingBottom: 10 }}>Wait Till Tomorrow To Refresh Requests.</Text>
                    <TouchableHighlight
                        style={{ backgroundColor: "#00308F", width: "70%", height: "20%", alignItems: "center", borderRadius: 10, justifyContent: "center"}}
                        onPress={() => {
                            setIsModalVisible(!isModalVisible);
                        }}
                    >
                        <Text style={{ color: "white" }}>Ok</Text>
                    </TouchableHighlight>
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
        height: "30%",
        width: "80%",
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

export default RequestCapModal;