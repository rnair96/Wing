import React, { Component, useState} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const ImageUpload = () => {
    const [ image, setImage ]= useState(null);

    const selectImage = async () => {      
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);

        }
    };
    

  const removeImage = async () => {       
      setImage(null);
  };

    return (
    <View style={{alignItems: 'center', justifyContent: 'center' }}>
         {image ? (
        <View>
        <Image source={{uri: image}} style={styles.imageContainer} />
        <TouchableOpacity onPress={removeImage}>
        <Text>Delete</Text>
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
      borderWidth: 1,
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
