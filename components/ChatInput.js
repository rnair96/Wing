import React, { Component, useState } from 'react'
import { Text, View, TouchableOpacity, TextInput, StyleSheet, Modal, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WingTagModal from './WingTagModal';


const ChatInput = ({ input, setInput, sendMessage, fileLocation, matches, setReplyToken, setUserIdReply, setUserNameReply }) => {
    const [isImage, setIsImage] = useState(false);
    const [contentType, setContentType] = useState("text");
    // const [image, setImage] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isWingTagModalVisible, setWingTagModalVisible] = useState(false);
    const [isWingSelected, setIsWingSelected] = useState(false);


    const uploadFirebase = (file, path) => {
        try {

            const metadata = {
                contentType: 'image/jpeg',
            };

            const storageRef = ref(storage, `/images/${path}`);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progressbar = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    // setProgress(progressbar);
                    setModalVisible(true);

                    // progressBar.style.width = `${progress}%`;
                    console.log('Upload is ' + progressbar + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            throw new Error('Paused during Image upload');
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    throw new Error('Error uploading Image', error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setModalVisible(false);
                        setInput(url);
                        setIsImage(true);
                        setContentType("image")
                        file.close();


                    });
                }
            );

        } catch (e) {
            // setProgress(null);
            setModalVisible(false);
            alert("There was an error uploading your image. Please try again.")
        }

    }

    const selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
        });

        if (!result.canceled) {
            const path = result.assets[0].uri;
            const fileName = path.split("/").pop();
            const maxSizeInBytes = 4 * 1024 * 1024; // 4 MB in bytes

            try {
                //   const isAppropriate = await checkInappropriateContent(path);
                //     if (!isAppropriate) {
                //       throw new Error("image-not-appropriate");
                //       // alert('Inappropriate content detected. Please choose another image.');
                //     // return;
                // }

                if (!(path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png'))) {
                    throw new Error("file-not-image");
                }

                const fileInfo = await FileSystem.getInfoAsync(path);


                // console.log("image size",fileInfo.size);

                let uri;

                if (fileInfo.size < maxSizeInBytes) {

                    uri = path;

                } else {

                    const compression = maxSizeInBytes / fileInfo.size;

                    // Compress the image again with the calculated compression level
                    const compressedImage = ImageManipulator.manipulateAsync(path, [], {
                        compress: compression,
                        // format: ImageManipulator.SaveFormat.PNG
                    });

                    const compressedImageInfo = await FileSystem.getInfoAsync(
                        compressedImage.uri
                    );

                    // console.log("compressed image size", compressedImageInfo.size)


                    // const imageResult = await compressImage(uri);
                    // const smallerThanMaxSize = await sizeIsLessThanMB(imageResult.uri, MAX_FILE_SIZE_MB);
                    if (compressedImageInfo.size > maxSizeInBytes) {
                        throw new Error('image-too-large');
                    }
                    // imageBlob = await getImageBlob(imageResult.uri);
                    uri = (await compressedImage).uri
                }


                const response = await fetch(uri);
                const blob = await response.blob();

                const fileNameFull = fileLocation + "/" + fileName
                uploadFirebase(blob, fileNameFull);

            } catch (e) {
                if (e.message.includes('image-too-large')) {
                    alert("Image was too large");
                    return;
                }
                else if (e.message.includes('file-not-image')) {
                    alert("Please upload only images");
                    return;
                } else if (e.message.includes('image-not-appropriate')) {
                    alert('Inappropriate content detected. Please choose another image.');
                    return;
                } else {
                    console.log("there was an error", e);

                }
                setIsImage(false);
                setContentType("image");
            }
        }


    };

    const getImageNameFromUrl = (imageUrl) => {
        const urlParts = imageUrl.split("/");
        const getLast = urlParts[urlParts.length - 1];
        const removeTokens = getLast.split("?")[0]
        const fileName = removeTokens.replace(/%2F/g, "/")
        return fileName;
    };


    const removeImage = async () => {
        const imageName = getImageNameFromUrl(input)

        const imageRef = ref(storage, imageName);


        // Delete the file
        await deleteObject(imageRef)
            .then(() => {
                console.log("File deleted successfully.");
                setInput(null);
                setContentType("text");
                setIsImage(false);
            })
            .catch((error) => {
                console.error("Error deleting file: ", error);
            });

    };

    return (
        <View
            style={{ flexDirection: "row", borderColor: "grey", borderWidth: 2, borderRadius: 10, alignItems: "center", margin: 5 }}>
            {isImage ? (
                <View style={{ alignItems: "center", justifyContent: "center", marginRight:fileLocation === "groupChat"?10:0}}>
                    <Image source={{ uri: input }} style={styles.imageContainer} />
                    <TouchableOpacity onPress={removeImage}>
                        <MaterialCommunityIcons name="close-circle" size={20} color="#fd5c63" />
                    </TouchableOpacity>
                </View>
            ) : (
                <TextInput
                    style={{ height: 50, width: "80%", fontSize: 15, padding: 10, paddingTop: 15, marginRight:fileLocation === "groupChat"?10:0, color: contentType === 'link' ? "blue" : "black" }}
                    placeholder="Send Message..."
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    placeholderTextColor={"grey"}
                    multiline={true}
                    numberOfLines={5}
                    value={input}
                />
            )}

            <TouchableOpacity onPress={() => {
                if (isImage) {
                    setIsImage(false);
                }         
                setContentType("text");
                sendMessage(contentType, isWingSelected);
                if(isWingSelected){
                    setIsWingSelected(false);
                }
                
            }} style={{right:fileLocation === "groupChat"? 17: 0}}>
                {/* <Text style={{ color: "#00BFFF", fontSize: 15 }}>Send</Text> */}
                <Ionicons name="send" size={fileLocation === "groupChat"? 17: 20} color="#00BFFF" />
            </TouchableOpacity>
            {!isImage && (
                <View style={{ flexDirection: "row", right:fileLocation === "groupChat"? 17:0 }}>
                    <TouchableOpacity style={{ paddingLeft: 3 }} onPress={selectImage}>
                        <Ionicons name="image-outline" size={fileLocation === "groupChat"? 17: 20} color="#00BFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingLeft: 3 }} onPress={() => contentType==="link"? setContentType("text"):setContentType("link")}>
                        <Ionicons name="link-outline" size={fileLocation === "groupChat"? 17: 20} color="#00BFFF" />
                    </TouchableOpacity>
                    {fileLocation === "groupChat" && matches &&
                        <TouchableOpacity style={{ paddingLeft:3 }} onPress={() => setWingTagModalVisible(true)}>
                            <Ionicons name="at-outline" size={19} color="#00BFFF" />
                        </TouchableOpacity>}
                </View>
            )}
            {/* <Button onPress={sendMessage} title="Send" style={{ borderRadius: 20 }} /> */}
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
                        <Text style={{ fontSize: 16, textAlign: "center", paddingBottom: 10, fontWeight: "bold" }}>Uploading Image</Text>
                        {/* <Text style={{fontSize:14, textAlign:"center", fontWeight:"bold", color:"#00308F"}}>{progress}% Complete</Text> */}
                    </View>
                </View>
            </Modal>
            <WingTagModal isVisible={isWingTagModalVisible} setIsVisible={setWingTagModalVisible} matches={matches} setInput={setInput} setReplyToken={setReplyToken} setUserIdReply={setUserIdReply} setUserNameReply={setUserNameReply} setIsWingSelected={setIsWingSelected}/>
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 200,
        margin: 10,
        borderWidth: 3,
        borderColor: "",
        borderRadius: 20,
        borderColor: '#ccc'
    },
    emptyImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        margin: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#ccc',
        backgroundColor: '#eee'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
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

export default ChatInput
