import React, { Component } from 'react';
import { FlatList, Text, View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export const ProfileSwipeScreen = () => {
    const { params } = useRoute();
    const card = params;
    const navigation = useNavigation();
    const { user } = useAuth();

    console.log("card",card);


    return (
      <SafeAreaView style={{flex:1}}>
    {/* Header */}
    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding: 10}}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{left: 20, top:10}}>
            <MaterialCommunityIcons name="arrow-left-bold" size={20} color="#00BFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={{top: 30}} onPress={() => navigation.navigate("Menu")}>
            <Image style={styles.iconcontainer} source={require("../images/logo2.jpg")}/>
        </TouchableOpacity>
        <TouchableOpacity style={{right:20, top:10}} onPress={() => navigation.navigate("Chat")}>
            <Ionicons name="chatbubbles-sharp" size={30} color = "#00BFFF"/>
        </TouchableOpacity>
    </View>

      <View style={{height:1000000}}>
      <FlatList
      data = {[card]}
      keyExtractor={(card) => card.id}
      contentContainerStyle={{ flexGrow: 0 }}
      renderItem = {(card) =>
        (
        <View style={{ height: 500000, width: '100%' }}>
                    <Text style={{fontWeight:"bold", fontSize:15, alignItems:"center" ,justifyContent:"center", padding: 10}}>{card.item.mission}</Text>
                    <Image style={{height:440 ,maxWidth:400}} source={{uri: card.item.images[0]}}/>
                    <View style={styles.infocontainer}>
                        <View>
                            <Text style={{fontWeight:"bold", fontSize:20}}>
                                {card.item.displayName}
                            </Text>
                            <Text>
                            {card.item.job}
                            </Text>
                        </View>
                        <Text style={{fontWeight:"bold", fontSize:20}}>{card.item.age}</Text>
                    </View>
                    <Text style={{fontWeight:"bold", fontSize:15, alignItems:"center" ,justifyContent:"center", padding: 10}}>{card.item.accomplishments}</Text>
                    <Image style={{height:440 ,maxWidth:400}} source={{uri: card.item.images[1]}}/>
                    <Text>{card.item.skills}</Text>
                    <Image style={{height:440 ,maxWidth:400}} source={{uri: card.item.images[2]}}/>
                    <Text>{card.item.desires}</Text>
                </View>
      )
    }
        />
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  imagecontainer: {
       width: 30,
       height: 30,
       borderRadius: 50
   },
   iconcontainer: {
       height: 60,
       width: 60,
       borderRadius: 50,
       bottom: 25,
       borderColor:"#00BFFF",
       borderWidth: 2
   },
   cardscontainer: {
       flex: 1,
       marginTop:-30,
   },
   cardcontainer: {
       backgroundColor: "white",
       height:500,
       borderRadius: 20,
       shadowColor:"#000",
       shadowOffset: {
           width: 0,
           height: 1
       },
       shadowOpacity: 0.2,
       shadowRadius: 1.41,
       elevation:2
   },
   infocontainer: {
       bottom:70 ,
       backgroundColor:"white", 
       paddingVertical: 15, 
       flexDirection:"row",
       justifyContent: "space-between",
       paddingHorizontal: 30
   },
   swipeButtonCross:{
      bottom: 10,
      width: 50,
      height: 50,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FF5864"
   },
   swipeButtonHeart:{
       bottom: 10,
       width: 50,
       height: 50,
       borderRadius: 50,
       alignItems: "center",
       justifyContent: "center",
       backgroundColor: "#32de84"
    }
});

export default ProfileSwipeScreen;
