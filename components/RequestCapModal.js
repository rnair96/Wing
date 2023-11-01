import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native';


const RequestCapModal = ({ isModalVisible, setIsModalVisible}) => {

    return (

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
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 15, color: "white" }}>No More Chat Requests Available!</Text>
                        <Text style={{ padding: 5, fontWeight: "700", paddingBottom: 10, color: "white" }}>Wait Till Tomorrow To Refresh Requests.</Text>
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
    )
}

const styles = StyleSheet.create({
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

})

export default RequestCapModal;