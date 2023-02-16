import React, { Component } from 'react';
import { FlatList, Text, View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Ionicons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from '../components/Footer';
// import Container from '../components/Footer';


export const ProfileSwipeScreen = () => {
    const { params } = useRoute();
    const { card, swipeRef } = params;


    const navigation = useNavigation();
    const { user } = useAuth();

    const profileSwipeLeft = () => {
      navigation.navigate("Home");
      swipeRef.current.swipeLeft()
    }

    const profileSwipeRight = () => {
      navigation.navigate("Home");
      swipeRef.current.swipeRight()
    }


    return (
      <SafeAreaView style={{flex:1}}>
      {/* <View> */}
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

      <View>
      <FlatList
      data = {[card]}
      keyExtractor={(card) => card.id}
      contentContainerStyle={{ flexGrow: 0 }}
      renderItem = {(card) =>
        (
                <View>
                    <View style={{backgroundColor:"white", margin:10, borderRadius:20}}>
                    <View style={{alignItems:"center"}}>
                    <View style={{flexDirection:"row", padding: 10}}>
                    <Image style={{height: 30, width:30}} source={require("../images/reverse_mission.jpeg")}/>
                    <Text style = {{padding: 10}}>Mission</Text>
                    <Image style={{height: 30, width:30}} source={require("../images/mission.jpeg")}/>
                    </View>
                    <Text style={{fontWeight:"bold", fontSize:15, padding: 10}}>{card.item.mission}</Text>
                    <Image style={{height:440 ,width:"90%"}} source={{uri: card.item.images[0]}}/>
                    </View>
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
                    </View>
                    <View style={{backgroundColor:"white", margin:10, borderRadius:20, alignItems:"center", paddingBottom:10}}>
                    <View style={{flexDirection:"row", padding: 10}}>
                    <Image style={{height: 30, width:30}} source={require("../images/reverselogo.jpg")}/>
                    <Text style = {{padding: 10}}>My Ideal Wing</Text>
                    <Image style={{height: 30, width:30}} source={require("../images/logo2.jpg")}/>
                    </View>
                    <Text style={{fontWeight:"bold", fontSize:15, padding: 10}}>{card.item.desires}</Text>
                    <Image style={{height:440 ,width:"90%"}} source={{uri: card.item.images[1]}}/>
                    </View>
                    <View style={{backgroundColor:"white", margin:10, borderRadius:20, alignItems:"center"}}>
                    <View style={{flexDirection:"row", padding: 10}}>
                    <Image style={{height: 30, width:30}} source={require("../images/reverse_biceps.jpg")}/>
                    <Text style = {{padding: 10}}>Strengths</Text>
                    <Image style={{height: 30, width:30}} source={require("../images/bicep.jpg")}/>
                    </View>
                    <Text style={{fontWeight:"bold", fontSize:15, padding: 10}}>{card.item.skills}</Text>
                    <Image style={{height:440 ,width:"90%"}} source={{uri: card.item.images[2]}}/>
                    <View style={{flexDirection:"row", padding: 10}}>
                    <Image style={{height: 40, width:40}} source={require("../images/medal.jpg")}/>
                    <Text style = {{padding: 10}}>Medals</Text>
                    <Image style={{height: 40, width:40}} source={require("../images/medal.jpg")}/>
                    </View>
                    <Text style={{fontWeight:"bold", fontSize:15, padding: 10}}>{card.item.accomplishments}</Text>
                    </View>

                    <View style={{height:450}}>
                    <View style={{backgroundColor:"white", margin:10, borderRadius:20, alignItems:"center"}}>
                    <View style={{flexDirection:"row", padding: 10}}>
                    <Image style={{height: 30, width:30}} source={require("../images/smile.jpeg")}/>
                    <Text style = {{padding: 10}}>Hobbies</Text>
                    <Image style={{height: 30, width:30}} source={require("../images/smile.jpeg")}/>
                    </View>
                    <Text style={{fontWeight:"bold", fontSize:15, padding: 10}}>{card.item.hobbies}</Text>
                    <View style={{flexDirection:"column", padding: 10}}>
                    <Image style={{height: 40, width:40, alignSelf:"center"}} source={require("../images/location.jpeg")}/>
                    <Text style={{fontWeight:"bold", fontSize:15, padding: 10}}>{card.item.location}</Text>
                    </View>
                    </View>
                    </View>
                </View>
      )
    }
        />
        <View style={{flexDirection:"row", justifyContent:"space-evenly", bottom:150}}>
        <TouchableOpacity style={styles.swipeButtonCross} onPress={()=>profileSwipeLeft()}>
                <Entypo name="cross" size={30} color="red"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.swipeButtonHeart} onPress={()=>profileSwipeRight()}>
                <Entypo name="heart" size={30} color="green"/>
        </TouchableOpacity>
    </View>
         {/* <Foo ter/> */}
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
      //  flex: 1,
      //  marginTop:-30,
   },
   cardcontainer: {
       backgroundColor: "white",
      //  height:500,
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
      //  bottom:70 ,
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
