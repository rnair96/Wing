import React, { Component } from 'react'
import { Text, View, Image, Modal, TouchableHighlight, StyleSheet } from 'react-native'

const ImageExpanded = ({ isVisible, setIsVisible, image }) => {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Image source={{uri: image}} style={{ width: "100%", height: 300}} />
                    <TouchableHighlight
                    style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "#00308F", alignItems: "center", borderRadius: 10, width: "60%", height: "10%", justifyContent: "center" }}
                    onPress={() => {
                        setIsVisible(!isVisible);
                    }}
                >
                    <Text style={{ color: "white" }}>Close</Text>
                </TouchableHighlight>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
        // top:40
    },
    modalView: {
        width: "90%",
        height: "50%",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5
    }

})

export default ImageExpanded
