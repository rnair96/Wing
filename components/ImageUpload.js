import React, { Component, useEffect, useState} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Modal  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject} from "firebase/storage";


const ImageUpload = ({ images, index, setImages, user}) => {
    const [ image, setImage ]= useState(null);
    const [ progress, setProgress] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
 

    useEffect(()=>{
      if (images && images?.length > index) {
        setImage(images[index])
      }
    },[images])

    const uploadFirebase = (file, path) => {
      const metadata = {
        contentType: 'image/jpeg',
      };

      const storageRef = ref(storage, `/images/${path}`);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progressbar = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progressbar);
            setModalVisible(true);
            //         // progressBar.style.width = `${progress}%`;
            //         console.log('Upload is ' + progressbar + '% done');
            //         switch (snapshot.state) {
            //             case 'paused':
            //                 console.log('Upload is paused');
            //                 break;
            //             case 'running':
            //                 console.log('Upload is running');
            //                 break;
            //         }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setModalVisible(false);
                setImage(url);

                if(images.length>index){
                  const arr = images;
                  arr.splice(index,0,url)
                  setImages(arr);
                } else {
                  setImages([...images,url])
                }
          
              });
          }
        );
        
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


          const response = await fetch(path);
          const blob = await response.blob();
          // const imagefile = new File([blob], fileName);


          const fileNameFull = user.id+"/"+index+"/"+fileName
          uploadFirebase(blob, fileNameFull);
          
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

    // console.log("imageref", imageRef)

    // Delete the file
      await deleteObject(imageRef)
      .then(() => {
        console.log("File deleted successfully.");
        setImage(null);
        const arr = images;
        arr.splice(index,1);
        setImages(arr);
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
        <MaterialCommunityIcons name="image-multiple" size={50} color="#ccc" />
        <Text>Select Image</Text>
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
            <Text style={{fontSize:18, textAlign:"center", paddingBottom:10, fontWeight:"bold"}}>Uploading Image</Text>
            <Text style={{fontSize:14, textAlign:"center", fontWeight:"bold", color:"#00308F"}}>{progress}% Complete</Text>
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
      width: 100,
      height: 100,
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

export default ImageUpload;
