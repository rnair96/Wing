import React, {useLayoutEffect, useRef, useState, useEffect} from 'react'
import { Button, View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ImageBackground, TurboModuleRegistry } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons} from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper";
import { getDocs, getDoc, setDoc, collection, onSnapshot, doc, query, where, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import generateId from '../lib/generateId'


const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const swipeRef = useRef(null);
    const [ profiles,setProfiles ] = useState([]);

    // console.log("user HOME", user);

    useLayoutEffect(()=>{
            onSnapshot(doc(db, "users", user?.uid), (snapshot) => {
                if (!snapshot.exists()){
                    navigation.navigate("EditProfile");
                }
            }
        )
        });

    useEffect(()=>{
        let unsub;

        const fetchCards = async() => {


            const passedIds = [];
            await getDocs(collection(db,"users",user.uid,"passes")).then((snapshot) => {
                snapshot.docs.map((doc) => passedIds.push(doc.id))
            });

    
            const swipedIds = [];
            await getDocs(collection(db,"users",user.uid,"swipes")).then((snapshot) => {
                snapshot.docs.map((doc) => swipedIds.push(doc.id))
            });
 

            const passedUIds = passedIds?.length > 0 ? passedIds : ["test"];
            const swipedUIds = swipedIds?.length > 0 ? swipedIds : ["test"];

            unsub = onSnapshot(query(collection(db,"users"), where("id","not-in", [...passedUIds, ...swipedUIds]) )
            ,(snapshot) =>{
                setProfiles(
                    snapshot.docs.filter((doc) => doc.id !== user.uid).map((doc) => (
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

    },[db]);

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]){ return;}

        console.log("you swiped left on", profiles[cardIndex].displayName);
        setDoc(doc(db, 'users', user.uid, "passes", profiles[cardIndex].id), profiles[cardIndex]);
    }

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]){ return;}

        const userSwiped = profiles[cardIndex]

        const loggedProfile = await (await getDoc(doc(db, 'users', user.uid))).data();

        getDoc(doc(db, 'users', userSwiped.id, "swipes", user.uid)).then(
            documentSnapshot => {
                if (documentSnapshot.exists()){
                    console.log("document snap", documentSnapshot);
                    //user matched, they swiped on you already
                    console.log("MATCHED with", userSwiped.displayName);

                    setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
                        users: {
                            [user.uid]: loggedProfile,
                            [userSwiped.id]: userSwiped
                        },
                        userMatched: [user.uid, userSwiped.id],
                        timeStamped: serverTimestamp()
                    });

                    navigation.navigate("Match", {loggedProfile, userSwiped});

                } else {
                    //first swipe of interaction
                    console.log("you swiped right on",  userSwiped.displayName);

                }
                setDoc(doc(db, 'users', user.uid, "swipes",  userSwiped.id),  userSwiped);
            }
            
        );
    }


  return (
   <SafeAreaView style={{flex:1, backgroundColor:"black"}}>
    {/* Header */}
    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding: 10}}>
        <TouchableOpacity  onPress= {logout} style={{left: 20, top:10}}>
            <Image style = {styles.imagecontainer} source={{ uri: user.photoURL }}/>
        </TouchableOpacity>
        <TouchableOpacity style={{top: 30}} onPress={() => navigation.navigate("Menu")}>
            <Image style={styles.iconcontainer} source={require("../images/logo2.jpg")}/>
        </TouchableOpacity>
        <TouchableOpacity style={{right:20, top:10}} onPress={() => navigation.navigate("Chat")}>
            <Ionicons name="chatbubbles-sharp" size={30} color = "#00BFFF"/>
        </TouchableOpacity>
    </View>
    {/* End of Header */}
    {/* Cards */}
    <View style={styles.cardscontainer}>
        <Swiper cards={profiles}
            ref={swipeRef} 
            stackSize={5}
            cardIndex={0}
            animateCardOpacity={true}
            verticalSwipe={false}
            onSwipedLeft={(cardIndex) => {
                swipeLeft(cardIndex);
                // console.log("Swipe PASS")
            }}
            onSwipedRight={(cardIndex) => {
                swipeRight(cardIndex);
                // console.log("Swipe MATCH")
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
                    <TouchableOpacity onPress={()=>{navigation.navigate("ProfileSwipe", card)}}>
                    <Text style={{fontWeight:"bold", fontSize:15, alignItems:"center" ,justifyContent:"center", padding: 10}}>{card.mission}</Text>
                    <Image style={{height:440 ,maxWidth:400}} source={{uri: card.images[0]}}/>
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
                    </TouchableOpacity>
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
