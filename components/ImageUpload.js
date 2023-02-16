import React, { Component, useEffect, useState} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const ImageUpload = ({ images, index, setImages}) => {
    const [ image, setImage ]= useState(null);

    useEffect(()=>{
      if (images && images?.length > index) {
        setImage(images[index])
      }
    },[images])


    //add a useeffect that instantiates image if there is already an existing image at the given index for images

    const selectImage = async () => {      
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
          
          setImages([...images, result.assets[0].uri])//must correct to ensure added image is at correct place in array

        }
    };
    

  const removeImage = async () => {       
      setImage(null);
      const arr = images;
      arr.splice(index,1);
      setImages(arr);
  };

    return (
    <View style={{alignItems: 'center', justifyContent: 'center' }}>
         {image ? (
        <View style={{alignItems:"center", justifyContent:"center"}}>
        <Image source={{uri: image}} style={styles.imageContainer} />
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
