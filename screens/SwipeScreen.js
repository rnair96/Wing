import React, { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TouchableHighlight, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper";
import { getDocs, setDoc, collection, onSnapshot, doc, query, where, serverTimestamp, updateDoc, limit, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import checkFlagged from '../lib/checkFlagged';
import MessageModal from '../components/MessageModal';
import RequestCapModal from '../components/RequestCapModal';



const SwipeScreen = ({loggedProfile}) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const swipeRef = useRef(null);
    const [profiles, setProfiles] = useState([]);
    const [swipeAmount, setSwipeAmount] = useState(5);
    const [swipeEnabled, setSwipeEnabled] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMessageModalVisible, setMessageModalVisible] = useState(false);
    const [requestMessage, setRequestMessage] = useState(null);
    const [swipeRefMessage, setSwipeRefMessage] = useState(null);
      

    useEffect(() => {
        // let unsub;
        const setSwipes = async () => {
            // if (loggedProfile) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);


            const userSnapshot = await getDocs(query(collection(db, global.users, user.uid, "swipes"),
                where("timeSwiped", ">=", startOfDay), where("timeSwiped", "<=", endOfDay),
                orderBy("timeSwiped", "desc")), limit(1));

            if (!userSnapshot.empty) {
                const latestSwipeDoc = userSnapshot.docs[0];
                if (latestSwipeDoc.data()?.swipedAt && (latestSwipeDoc.data().swipedAt - 1) > 0) {
                    console.log("setting swipes to previously", (latestSwipeDoc.data().swipedAt - 1))
                    setSwipeAmount((latestSwipeDoc.data().swipedAt - 1));
                } else {
                    console.log("setting swipes to 0 and disabling swipes");
                    setSwipeAmount(0);
                    setSwipeEnabled(false);
                    // alert("No more likes available, wait till tomorrow.")
                    setIsModalVisible(true);
                }
            } else {
                console.log("No swipes found today from user. Replenish swipes");
                // setSwipeAmount(swipeCap);
            }

        }
        // }
        setSwipes();
        // return unsub;

    }, [db])


    useEffect(() => {
        let unsub;

        const fetchCards = async () => {

            try {

                const passedIds = [];
                await getDocs(collection(db, global.users, user.uid, "passes")).then((snapshot) => {
                    snapshot.docs.map((doc) => passedIds.push(doc.id))
                });

                const swipedIds = [];
                await getDocs(collection(db, global.users, user.uid, "swipes")).then((snapshot) => {
                    snapshot.docs.map((doc) => swipedIds.push(doc.id))
                });

                const requestIds = [];
                await getDocs(collection(db, global.users, user.uid, "requests")).then((snapshot) => {
                    snapshot.docs.map((doc) => requestIds.push(doc.id))
                });

                const ageMin = loggedProfile?.ageMin ? loggedProfile.ageMin : 18;

                const ageMax = loggedProfile?.ageMax ? loggedProfile.ageMax : 100;

                // const genderPreference = loggedProfile?.genderPreference ? loggedProfile.genderPreference : "both";
                const genderPreference = loggedProfile?.gender;

                const universityPreference = loggedProfile?.universityPreference ? loggedProfile.universityPreference : "No";

                const tagPreference = loggedProfile?.tagPreference ? loggedProfile.tagPreference : "All";

                const passedUIds = passedIds?.length > 0 ? passedIds : ["test"];
                const swipedUIds = swipedIds?.length > 0 ? swipedIds : ["test"];

                unsub = onSnapshot(query(collection(db, global.users), where("id", "not-in", [...passedUIds, ...swipedUIds, ...requestIds, ...[user.uid]]), limit(10))
                    , (snapshot) => {
                        setProfiles(
                            snapshot.docs
                                .filter(
                                    (doc) =>
                                        (doc.data()?.images?.length > 2 && doc.data()?.mission && doc.data()?.medals)
                                        && (doc.data().gender === genderPreference)
                                        && (doc.data().mission_tag === tagPreference || tagPreference === "All")
                                        && (universityPreference === "No" || (universityPreference === "Yes" && doc.data()?.university_student && doc.data().university_student.status === "active"))
                                        && (doc.data().age >= ageMin && doc.data().age <= ageMax)
                                        && (!doc.data()?.flags || !checkFlagged(doc.data().flags))//function to check that user has no unresolved flags
                                )
                                .map((doc) => (
                                    {
                                        id: doc.id,
                                        ...doc.data()
                                    }
                                ))

                        )
                    },
                    (error) => {
                        if(error.code === "permission-denied"){
                            console.log("Should handle this error buuuut not the biggest deal if i leave it like this.")
                        } else{
                            console.log("there was an error in fetching cards snapshot", error)
                        }
                    })
            } catch (error) {
                console.log("Error fetching cards:", error);
            }
        }

        fetchCards();

        return () => {
            if (unsub) {
                unsub();
            }
        };


    }, [db, loggedProfile, loggedProfile?.tagPreference]);//loggedProfile?.ageMin, loggedProfile?.ageMax,

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) { return; }

        console.log("you swiped left on", profiles[cardIndex].displayName);

        setDoc(doc(db, global.users, user.uid, "passes", profiles[cardIndex].id), {id: profiles[cardIndex].id});

    }

    const messageSwipe = async (swipeRef) => {
        if (swipeAmount === 0) {
            setSwipeEnabled(false);
            setIsModalVisible(true);
            return;
        }
        // setMessagedName(profiles[cardIndex].displayName)
        setSwipeRefMessage(swipeRef)
        setMessageModalVisible(true);
    }

    // const swipeTop = async (cardIndex) => {

    // }

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) { return; }

        const userSwiped = profiles[cardIndex];
        const timestamp = serverTimestamp();

        console.log("you messaged swiped on", profiles[cardIndex].displayName);

        //handle this with Firebase Trigger
        // setDoc(doc(db, global.users, userSwiped.id, "requests", user.uid), {
        //     id: user.uid,
        //     timestamp: timestamp,
        //     message: requestMessage,
        //     read: false
        // });

        const swipedUser = {
            id: userSwiped.id,
            swipedAt: swipeAmount,
            timeSwiped: timestamp,
            message: requestMessage,
        }

        setRequestMessage(null);
        setSwipeAmount((swipeAmount - 1));
        console.log("swipe number at", (swipeAmount - 1));

        setDoc(doc(db, global.users, user.uid, "swipes", userSwiped.id), swipedUser);
    }

    return (
        <View style={{backgroundColor: "black", height:"87%" }}>
            {/* Cards */}
            {profiles.length === 0 ? (
                <View style={[styles.emptycardcontainer, { alignItems: "center", justifyContent: "space-evenly" }]}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>No Wings Around... Try Again Later</Text>
                    <Image style={{ height: 300, width: 300, borderRadius: 150 }} source={require("../images/island_plane.jpg")} />
                </View>
            ) : (
                <View style={styles.cardscontainer}>
                    <Swiper cards={profiles}
                        ref={swipeRef}
                        stackSize={5}
                        animateCardOpacity={true}
                        verticalSwipe={false}
                        cardIndex={0}
                        horizontalSwipe={false}
                        disableRightSwipe={!swipeEnabled}
                        // disableTopSwipe={!swipeEnabled}
                        onSwipedAll={() => {
                            setProfiles([])
                        }}

                        onSwipedLeft={(cardIndex) => {
                            swipeLeft(cardIndex);

                        }}
                        onSwipedRight={(cardIndex) => {
                            swipeRight(cardIndex);

                        }}

                        
                        // pass swiperef to profile swipe to include swipe function , swipeRef: swipeRef
                        containerStyle={{ backgroundColor: "transparent" }}
                        renderCard={(card) => {
                            return (
                                <View key={card.id} style={styles.cardcontainer}>
                                    <TouchableOpacity style={{ justifyContent: "space-evenly", height: "100%", width: "100%" }} onPress={() => { navigation.navigate("ProfileSwipe", { card: card }) }}>
                                        <View style={{ alignItems: "center", bottom: 20 }}>
                                            <Text style={{ color: "white" }}>Mission: </Text>
                                            <Text style={styles.text}>{card.mission}</Text>
                                        </View>
                                        <View style={{ justifyContent: "space-evenly", height: "65%", width: "100%", backgroundColor: "#002D62" }}>
                                            <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: "center" }}>
                                                <View style={{ flexDirection: "column" }}>
                                                    <Text style={{ fontWeight: "bold", fontSize: 20, color: "white", paddingBottom: 5 }}>{card.displayName}</Text>
                                                    <Text style={{ color: "white", fontSize: 15 }}>{card.age}</Text>
                                                    {card?.university_student && card.university_student.status === "active" ? (
                                                        <View style={{ flexDirection: "column" }}>
                                                            <Text style={{ color: "white", fontSize: 13 }}>{card.school}</Text>
                                                            <Text style={{ color: "#00BFFF", fontWeight: "800", fontSize: 15 }}>WING-U</Text>
                                                        </View>
                                                    ) : (
                                                        <Text style={{ color: "white", fontSize: 15 }}>{card.job}</Text>
                                                    )}
                                                </View>
                                                <Image style={{ height: 120, width: 120, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }} source={{ uri: card?.images[0] }} />
                                            </View>
                                            <View style={{ flexDirection: "column" }}>
                                                <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                                    <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                    <Text style={styles.cardtext}>{card.medals[0]}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                                    <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                    <Text style={styles.cardtext}>{card.medals[1]}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                                    <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                    <Text style={styles.cardtext}>{card.medals[2]}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                                <Text style={{ borderWidth: 0.5, borderColor: "white", borderRadius: 10, color: "white", padding: 5 }}>{card.values[0]}</Text>
                                                <Text style={{ borderWidth: 0.5, borderColor: "white", borderRadius: 10, color: "white", padding: 5 }}>{card.values[1]}</Text>
                                                <Text style={{ borderWidth: 0.5, borderColor: "white", borderRadius: 10, color: "white", padding: 5 }}>{card.values[2]}</Text>
                                            </View>
                                        </View>
                                        {/* </View> */}
                                        <View style={{ justifyContent: "center", flexDirection: "row", width: "100%" }}>
                                            <Image style={{ height: 25, width: 10 }} source={require("../images/droppin_white.png")}></Image>
                                            <Text style={{ color: "white", fontSize: 15, left: 5 }}>{card.location}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                        }
                    />
                </View>
            )}

            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <TouchableOpacity style={styles.swipeButtonCross} onPress={() => swipeRef && swipeRef?.current ? swipeRef.current.swipeLeft() : console.log("no action")}>
                    <Entypo name="cross" size={24} color="red" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.swipeButtonHeart} onPress={()=> swipeRef && swipeRef?.current ? messageSwipe(swipeRef): console.log("no action")}>
                            <Entypo name="mail" size={17} color="green"/>
                </TouchableOpacity> 
            </View>
            <MessageModal isMessageModalVisible={isMessageModalVisible}  setMessageModalVisible={setMessageModalVisible} requestMessage={requestMessage} setRequestMessage={setRequestMessage} swipeRefMessage={swipeRefMessage}/>
            <RequestCapModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>
            
        </View>
    )
}

const styles = StyleSheet.create({
    imagecontainer: {
        width: 30,
        height: 30,
        borderRadius: 50
    },
    cardscontainer: {
        flex: 1,
        marginTop: -30,
    },
    cardcontainer: {
        backgroundColor: "#00308F",
        height: "75%",
        borderRadius: 20,
        borderColor: "#002D62",
        borderWidth: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
    emptycardcontainer: {
        height: "75%",
    },
    infocontainer: {
        backgroundColor: "#00308F",
        paddingTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        // top:5,
        height: "85%",
        maxWidth: 400,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden'
    },
    text: {
        // position: 'absolute', 
        top: 10,  // This will place the text near the top of the image
        color: "white",
        fontSize: 24,
        fontWeight: 'bold',
    },
    cardtext: {
        color: "white",
        fontSize: 15
    },
    swipeButtonCross: {
        bottom: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF5864"
    },
    swipeButtonHeart: {
        bottom: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#32de84"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        height:"30%",
        width:"80%",
        backgroundColor: '#00BFFF',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
});


export default SwipeScreen
