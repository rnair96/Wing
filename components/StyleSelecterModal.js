import React, { useState } from 'react';
import { Modal, View, Text, Button, Image, StyleSheet } from 'react-native';

const stylesData = [
    {
        title: "None",
        description: "Default choice. No preference for right now.",
        image: require('../images/island_plane.jpg'), // Update path to your image
    },
    {
        title: "The Icebreaker",
        description: "You have great energy and can approach anyone and make a fast friend.",
        image: require('../images/icebreaker.jpg'), // Update path to your image
    },
    {
        title: "The Conversationalist",
        description: "You can have deep conversations and make powerful connections.",
        image: require('../images/philosopher.jpg'), // Update path to your image
    },
    {
        title: "The Closer",
        description: "You're a natural leader, can lead a fun night and know how to take things to the next level with a girl, a new friend, or a whole party.",
        image: require('../images/closer.jpg'), // Update path to your image
    },
    {
        title: "The Entertainer",
        description: "You have the best jokes, stories, and/or party tricks that keep everyone around you entertained.",
        image: require('../images/comedian.jpeg'), // Update path to your image
    },
];

const StyleSelecterModal = ({ selectedStyle, setSelectedStyle }) => {
    const [visible, setVisible] = useState(false);
    //   const [selectedStyle, setSelectedStyle] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % stylesData.length);
    };

    const handleSelect = () => {
        setSelectedStyle(stylesData[currentIndex].title);
        setVisible(false); // Close modal upon selection
    };

    const handleCancel = () => {
        setVisible(false);
        setCurrentIndex(0); // Reset index to show first item when reopened
    };

    return (
        <View style={styles.container}>
            <Button title="Choose Your Style" onPress={() => setVisible(true)} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalView}>
                    <Image source={stylesData[currentIndex].image} style={styles.imageStyle} />
                    <Text style={styles.title}>{stylesData[currentIndex].title}</Text>
                    <Text style={styles.description}>{stylesData[currentIndex].description}</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Next" onPress={handleNext} />
                        <Button title="Select" onPress={handleSelect} />
                        <Button title="Cancel" onPress={handleCancel} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    imageStyle: {
        width: 100, // Adjust as needed
        height: 100, // Adjust as needed
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default StyleSelecterModal;
