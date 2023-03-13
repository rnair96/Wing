import React, { Component, useEffect, useState} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject} from "firebase/storage";


const ImageUpload = ({ images, index, setImages, user}) => {
    const [ image, setImage ]= useState(null);

    useEffect(()=>{
      if (images && images?.length > index) {
        setImage(images[index])
      }
    },[images])

    const uploadFirebase = (file) => {
      // const metadata = {
      //   contentType: 'image/jpeg',
      // };
      const storageRef = ref(storage, `/images/${file}`);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log("URL",url);
                setImage(url);

                if(images.length>index){
                  const arr = images;
                  arr.splice(index,0,url)
                  setImages(arr);
                } else {
                  setImages([...images,url])
                }
                //print out metadata to see full file size before upload and after
              //   storageRef.getMetadata().then(function(metadata) {
              //     console.log('File size: ' + metadata.size + ' bytes');
              //   }).catch(function(error) {
              //     console.error(error);
              //   });
              });
          }
        );
        
      }


    //add a useeffect that instantiates image if there is already an existing image at the given index for images

    const selectImage = async () => {      
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          const path = result.assets[0].uri;
          const fileName = path.split("/").pop();
          const fileNameFull = user.id+"/"+index+"/"+fileName
          uploadFirebase(fileNameFull);
          
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
    // image: {
    //   width: '100%',
    //   height: '100%'
    // }
  });

export default ImageUpload;
