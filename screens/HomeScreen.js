import React, {useLayoutEffect, useRef, useState, useEffect} from 'react'
import { Button, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons} from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from '../firebase';


const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const swipeRef = useRef(null);
    const [ profiles,setProfiles ] = useState([]);

    console.log("user HOME", user);

    useLayoutEffect(()=>{
            onSnapshot(doc(db, "users", user?.uid), (snapshot) => {
                if (!snapshot.exists()){
                    navigation.navigate("Modal");
                }
            }
        )
        });

    useEffect(()=>{
        let unsub;
        const fetchCards = async() => {
            unsub = onSnapshot(collection(db,"users"), (snapshot) =>{
                setProfiles(
                    snapshot.docs.map((doc) => (
                        {
                        id: doc.id,
                        ...doc.data()
                    }
                    ))
                    
                )
            })
        }
        fetchCards();
        return unsub;

    },[]);

    // console.log("Profiles",profiles)

    const DUMMY_DATA = [
        {
            displayName: "Darren",
            job: "Entrepreneur",
            photoURL: "https://i.pinimg.com/236x/a3/d4/6c/a3d46c39fe2060d4df2678f145570571.jpg",
            age: 26,
            id: 1,
            mission: "Create a 10k coaching business"
        },
        {
            displayName: "Johnny",
            job: "Police Officer",
            photoURL: "https://www.portseattle.org/sites/default/files/styles/detailpageimagesize/public/2022-08/22_08_26_Officer%20Cody-Berry%20Portrait-2.jpg?itok=vv5pjGJu",
            age: 37,
            id: 2,
            mission: "Create a safer city for children"
        },
        {
            displayName: "Mia",
            job: "Doctor",
            photoURL: "https://t3.ftcdn.net/jpg/02/74/03/26/360_F_274032618_OhzkPv4gkPC7pIumPDQYlILKH6eB28WH.jpg",
            age: 27,
            id: 3,
            mission: "Help people recover from COVID vaccine injuries"
        },
        {
            displayName: "Riley",
            job: "Lawyer",
            photoURL: "https://a9p9n2x2.stackpathcdn.com/wp-content/blogs.dir/1/files/2016/09/iStock-183996292-e1548441545549.jpg",
            age: 23,
            id: 4,
            mission: "Ensure freedom of speech in social media spaces"
        },
        {
            displayName: "Lana",
            job: "Engineer",
            photoURL: "https://t4.ftcdn.net/jpg/03/39/53/13/360_F_339531358_ydG0IxRqQj6iGG0ddAnRExu9lLpGhUdV.jpg",
            age: 29,
            id: 5,
            mission: "Advance A.I towards solving world problems"
        }

    ]


  return (
   <SafeAreaView style={{flex:1, backgroundColor:"black"}}>
    {/* Header */}
    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding: 10}}>
        <TouchableOpacity  onPress= {logout} style={{left: 20, top:10}}>
            <Image style = {styles.imagecontainer} source={{ uri: user.photoURL }}/>
        </TouchableOpacity>
        <TouchableOpacity style={{top: 30}} onPress={() => navigation.navigate("Modal")}>
            <Image style={styles.iconcontainer} source={require("../images/logo2.jpg")}/>
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
                    <Text style={{fontWeight:"bold", fontSize:15, justifyContent:"center", padding: 5}}>{card.mission}</Text>
                    <Image style={{height:450 ,width:335}} source={{uri: card.photoURL}}/>
                    <View style={styles.infocontainer}>
                        <View>
                            <Text style={{fontWeight:"bold", fontSize:20}}>
                                {card.displayName}
                            </Text>
                            <Text>
                            {card.job}
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


export default HomeScreen
