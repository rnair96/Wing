import React, {useLayoutEffect, useRef, useState} from 'react'
import { Button, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons} from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from '../firebase';


const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const swipeRef = useRef(null);
    const { profiles,setProfiles } = useState([])
    console.log("HomeScreen user ", user);

    useLayoutEffect(()=>{
        onSnapshot(doc(db, "users", user.uid), (snapshot) => {
            if (!snapshot.exists()){
                navigation.navigate("Modal");
            }
        }
    )},[]);

    const DUMMY_DATA = [
        {
            firstName: "Rajesh",
            lastName: "Nair",
            occupation: "Entrepreneur",
            photoURL: require("../images/dummy_users/4.png"),
            age: 26,
            id: 1,
        },
        {
            firstName: "Johnny",
            lastName:"Sins",
            occupation: "Police Officer",
            photoURL: require("../images/dummy_users/sins.jpeg"),
            age: 37,
            id: 2,
        },
        {
            firstName: "Mia",
            lastName: "Khalifa",
            occupation: "Doctor",
            photoURL: require("../images/dummy_users/mia.jpg"),
            age: 27,
            id: 3,
        },
        {
            firstName: "Riley",
            lastName: "Reid",
            occupation: "Lawyer",
            photoURL: require("../images/dummy_users/riley.jpg"),
            id: 4,
        },
        {
            firstName: "Lana",
            lastName: "Rhodes",
            occupation: "Engineer",
            photoURL: require("../images/dummy_users/lana.jpeg"),
            age: 29,
            id: 5,
        }

    ]


  return (
   <SafeAreaView style={{flex:1}}>
    {/* Header */}
    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding: 10}}>
    {/* <Button title= "Logout" onPress= {logout}/> */}
        <TouchableOpacity  onPress= {logout} style={{left: 20, top:10}}>
            <Image style = {styles.imagecontainer} source={{ uri: user.photoURL }}/>
        </TouchableOpacity>
        <TouchableOpacity style={{top: 30}} onPress={() => navigation.navigate("Modal")}>
            <Image style={styles.iconcontainer} source={require("../images/wing.png")}/>
        </TouchableOpacity>
        <TouchableOpacity style={{right:20, top:10}} onPress={() => navigation.navigate("Chat")}>
            <Ionicons name="chatbubbles-sharp" size={30} color = "#00BFFF"/>
        </TouchableOpacity>
    </View>
    {/* End of Header */}
    {/* Cards */}
    <View style={styles.cardscontainer}>
        <Swiper cards={DUMMY_DATA}
            ref={swipeRef} 
            stackSize={5}
            animateCardOpacity={true}
            verticalSwipe={false}
            onSwipedLeft={() => {
                console.log("Swipe PASS")
            }}
            onSwipedRight={() => {
                console.log("Swipe MATCH")
            }}
            overlayLabels={{
                left: {
                    title: "NOPE",
                    style: {
                        label:{
                            textAlign: "right",
                            color: "red",
                        },
                    },
                },
                right: {
                    title: "MATCH",
                    style: {
                        label: {
                            textAlign: "left",
                            color: "#4DED30"
                        }
                    }
                }
            }}
            containerStyle={{backgroundColor:"transparent"}}
            renderCard={(card)=> card ? (
                <View key={card.id} style={styles.cardcontainer}>
                    <Image style={{height:500 ,width:335, borderRadius:20}} source={card.photoURL}/>
                    <View style={styles.infocontainer}>
                        <View>
                            <Text style={{fontWeight:"bold", fontSize:20}}>
                                {card.firstName}
                            </Text>
                            <Text>
                            {card.occupation}
                            </Text>
                        </View>
                        <Text style={{fontWeight:"bold", fontSize:20}}>{card.age}</Text>
                    </View>
                </View>
            ):(
            <View style={[styles.cardcontainer, {alignItems:"center", justifyContent:"space-evenly"}]}>
                <Text style={{fontWeight:"bold", fontSize:15}}>No more Wings... Try Again Later</Text>
                <Image style={{height:300 ,width:335}} source={{uri:"https://img.atlasobscura.com/eeEvT-_nW7UF3uI4qqFlSaDwNwib1jH618G8KVVSTi4/rt:fit/w:1280/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL2Fzc2V0/cy9lMjMwZDA2MS0z/MDI5LTQ4ZjEtOGJh/Ni1iNzYzZTY1MWZm/MDhjZTMxZGZmMzg2/Mzk5ZGQ0NmVfRUI0/Q0ZYLmpwZw.jpg"}}/>
            </View>
            )}
        />
    </View>

    <View style={{flexDirection:"row", justifyContent:"space-evenly"}}>
        <TouchableOpacity style={styles.swipeButtonCross} onPress={()=>swipeRef.current.swipeLeft()}>
                <Entypo name="cross" size={24} color="red"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.swipeButtonHeart} onPress={()=>swipeRef.current.swipeRight()}>
                <Entypo name="heart" size={24} color="green"/>
        </TouchableOpacity>
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
        height: 50,
        width: 50,
        borderRadius: 50,
        bottom: 25,
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
        borderBottomEndRadius:20,
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


export default HomeScreen
