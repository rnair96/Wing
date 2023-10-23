import React, { Component, useEffect, useState} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Modal  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject} from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
// import checkInappropriateContent from '../lib/checkInappropriateContent';
import { Entypo, Ionicons} from '@expo/vector-icons';


const AnnouncementImageUpload = ({ url, setURL}) => {
    const [ image, setImage ]= useState(url);
    // const [ progress, setProgress] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
 

    useEffect(()=>{
      setImage(url);
    },[url])

    const uploadFirebase = (file, path) => {
      try{

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
            throw new Error('Error uploading Image',error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setModalVisible(false);
                setImage(url);
                setURL(url);
                file.close();

          
              });
          }
        );

      }  catch (e) {
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

          try{
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
  
            const fileNameFull = "announcements/"+fileName
            uploadFirebase(blob, fileNameFull);

          }catch(e){
            if(e.message.includes('image-too-large')){
              alert("Image was too large");
              return;
            }
            else if(e.message.includes('file-not-image')) {
              alert("Please upload only images");
              return;
            } else if(e.message.includes('image-not-appropriate')){
              alert('Inappropriate content detected. Please choose another image.');
              return;
            } else{
              console.log("there was an error",e);

            }
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
    const imageName = getImageNameFromUrl(image)

    const imageRef = ref(storage, imageName);


    // Delete the file
      await deleteObject(imageRef)
      .then(() => {
        console.log("File deleted successfully.");
        setImage(null);
        setURL(null);
      })
      .catch((error) => {
        console.error("Error deleting file: ", error);
      });     
     
  };

    return (
    <View style={{alignItems: 'center', justifyContent: 'center' }}>
         {image ? (
        <View style={{alignItems:"center", justifyContent:"center"}}>
        <Image source={{ uri: image }} style={styles.imageContainer} />
        <TouchableOpacity onPress={removeImage}>
        <MaterialCommunityIcons name="close-circle" size={20} color="#fd5c63" />
        </TouchableOpacity>
        </View>
        ):(
        <View style={styles.emptyImageContainer}>
        <TouchableOpacity onPress={selectImage}>
        <Ionicons name="person" size={50} color = "#ccc"/>
        {/* <MaterialCommunityIcons name="image-multiple" size={50} color="#ccc" /> */}
        
        {/* <Text>Select Image</Text> */}
        </TouchableOpacity>
        </View>
        )}

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
            <Text style={{fontSize:16, textAlign:"center", paddingBottom:10, fontWeight:"bold"}}>Uploading Image</Text>
            {/* <Text style={{fontSize:14, textAlign:"center", fontWeight:"bold", color:"#00308F"}}>{progress}% Complete</Text> */}
          </View>
          </View>
      </Modal>


    </View>
    )
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

export default AnnouncementImageUpload;
