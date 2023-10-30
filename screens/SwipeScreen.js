import React, { useRef, useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { Entypo } from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper";
import { getDocs, setDoc, collection, onSnapshot, doc, query, where, serverTimestamp, updateDoc, limit, orderBy } from "firebase/firestore";
import { db, auth } from '../firebase';
import MessageModal from '../components/MessageModal';
import RequestCapModal from '../components/RequestCapModal';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import getLocation from '../lib/getLocation';




const SwipeScreen = ({ loggedProfile }) => {
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
    const [loadingFetch, setloadingFetch] = useState(true);
    const [currentCard, setCurrentCard] = useState(null);



    useEffect(() => {

        if (loggedProfile && loggedProfile !== null) {

            const setSwipes = async () => {
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
                    } else if (latestSwipeDoc.data()?.swipedAt) {
                        console.log("setting swipes to 0 and disabling swipes");
                        setSwipeAmount(0);
                        setSwipeEnabled(false);
                        setIsModalVisible(true);
                    } else {
                        console.log("No swipes found today from user. Replenish swipes");
                    }
                } else {
                    console.log("No swipes found today from user. Replenish swipes");
                }

            }
            setSwipes();
        }

    }, [db, loggedProfile])

    useEffect(() => {
        //check if user has any unresolved flags
        if (loggedProfile && loggedProfile?.flags
            && loggedProfile?.flagged_status && loggedProfile.flagged_status === "unresolved") {
            // const check = checkFlagged(loggedProfile.flags);
            // if (check) {
            const index = loggedProfile.flags.length - 1;
            const flag = loggedProfile.flags[index];
            const flag_number = index + 1;
            //trigger modal screen
            navigation.navigate("Flagged", { flag, flag_number });
            // }

        }

        if (loggedProfile && loggedProfile?.birthdate) {
            console.log("checking birthdate")
            const currentDate = new Date();
            const dateParts = loggedProfile.birthdate.split("/");
            const month = parseInt(dateParts[0], 10) - 1; // months are 0-indexed in JavaScript
            const day = parseInt(dateParts[1], 10);

            if (currentDate.getMonth() === month
                && currentDate.getDate() === day
                && currentDate.getFullYear() !== loggedProfile.last_year_celebrated) {
                console.log("Updating age on birthday")
                const newage = loggedProfile.age + 1;
                updateDoc(doc(db, global.users, user.uid), {
                    age: newage,
                    last_year_celebrated: currentDate.getFullYear()
                }).catch((error) => {
                    console.log("could not update age on birthday");
                });
            }
        }

    }, [loggedProfile]);


    useEffect(() => {
        let unsub;

        if (loggedProfile && loggedProfile !== null) {

            const fetchCards = async () => {


                console.log("fetching cards...")

                const functionURL = `${global.fetchcards}${user.uid}`;
                //make link an env variable
                // const idToken = await getIdToken(getCurrentUser(auth), true);

                fetch(functionURL)
                    //     , {
                    //     method: 'GET',
                    //     headers: {
                    //       'Authorization': 'Bearer ' + idToken
                    //     }
                    //   }
                    //   )
                    // .then(response => response.text())  // Get the response text
                    // .then(text => {
                    //     try {
                    //         // Try to parse the response text as JSON
                    //         return JSON.parse(text);
                    //     } catch (err) {
                    //         // If it's not JSON, throw the raw text
                    //         throw text;
                    //     }
                    // })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        setProfiles(data);  // Set the fetched profiles to your state variable
                        setCurrentCard(data[0])
                        console.log("cards fetched")
                        setloadingFetch(false);
                    })
                    .catch(error => {
                        console.error("Error fetching profiles:", error);
                        setloadingFetch(false);
                        //add sentry capture
                    });
            }

            fetchCards();

            return () => {
                if (unsub) {
                    unsub();
                }
            };
        }

    }, [loggedProfile, loggedProfile?.tagPreference, loggedProfile?.universityPreference]);//loggedProfile?.ageMin, loggedProfile?.ageMax,


    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) { return; }

        console.log("you swiped left on", profiles[cardIndex].displayName);

        setDoc(doc(db, global.users, user.uid, "passes", profiles[cardIndex].id), { id: profiles[cardIndex].id });

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
        <View style={{ backgroundColor: "white", height: "87%" }}>
            {/* Cards */}
            {profiles.length === 0 ? (
                <View style={[styles.emptycardcontainer]}>
                    {loadingFetch ? (
                        <View style={[styles.emptycardcontainer]}>
                            <View style={styles.loading}>
                                <ActivityIndicator size="large" color="#00BFFF" />
                                <Text style={{ fontWeight: "bold", fontSize: 20 }}>Gathering Wings...</Text>
                            </View>
                        </View>

                    ) : (
                        <View style={{ height: "100%", alignItems: "center", justifyContent: "space-evenly" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 20 }}>No Wings Around... Try Again Later</Text>
                            <Image style={{ height: 300, width: 300, borderRadius: 150 }} source={require("../images/island_plane.jpg")} />
                        </View>
                    )}
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
                            setCurrentCard(profiles[cardIndex + 1])

                        }}
                        onSwipedRight={(cardIndex) => {
                            swipeRight(cardIndex);
                            setCurrentCard(profiles[cardIndex + 1])
                        }}


                        // pass swiperef to profile swipe to include swipe function , swipeRef: swipeRef
                        containerStyle={{ backgroundColor: "transparent" }}
                        renderCard={(card) => {
                            return (
                                <View key={card.id} style={styles.cardcontainer}>
                                    <TouchableOpacity style={{ justifyContent: "space-evenly", height: "100%", width: "100%" }} onPress={() => { navigation.navigate("ProfileSwipe", { card: card }) }}>
                                        <View style={{ alignItems: "center", bottom: 20 }}>
                                            <Text style={{ color: "white", margin: 10 }}>Mission: </Text>
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
                                            {card?.medals && card.medals.length > 0 ? (
                                                <View style={{ flexDirection: "column", marginLeft: 5 }}>
                                                    <View style={{ flexDirection: "row", padding: 10, marginRight: 10 }}>
                                                        <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                        <Text style={styles.cardtext}>{card.medals[0] ? card.medals[0] : `-- --`}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", padding: 10, marginRight: 10 }}>
                                                        <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                        <Text style={styles.cardtext}>{card.medals[1] ? card.medals[1] : `-- --`}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", padding: 10, marginRight: 10 }}>
                                                        <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                        <Text style={styles.cardtext}>{card.medals[2] ? card.medals[2] : `-- --`}</Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                <View style={{ flexDirection: "column", width: "100%", alignItems: "center" }}>
                                                    <View style={{ flexDirection: "row", padding: 10 }}>
                                                        <Image style={{ height: 25, width: 20, right: 20 }} source={require("../images/medals_white.png")}></Image>
                                                        <Text style={styles.cardtext}>-- --</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", padding: 10 }}>
                                                        <Image style={{ height: 25, width: 20, right: 20 }} source={require("../images/medals_white.png")}></Image>
                                                        <Text style={styles.cardtext}>-- --</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", padding: 10 }}>
                                                        <Image style={{ height: 25, width: 20, right: 20 }} source={require("../images/medals_white.png")}></Image>
                                                        <Text style={styles.cardtext}>-- --</Text>
                                                    </View>
                                                </View>
                                            )}

                                            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                                <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.values[0]}</Text>
                                                <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.values[1]}</Text>
                                                <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.values[2]}</Text>
                                            </View>
                                        </View>
                                        {/* </View> */}
                                        <View style={{ justifyContent: "center", flexDirection: "row", width: "100%" }}>
                                            <Image style={{ height: 25, width: 10 }} source={require("../images/droppin_white.png")}></Image>
                                            <Text style={{ color: "white", fontSize: 15, left: 10 }}>{card.location.text}</Text>
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

                <TouchableOpacity style={styles.swipeButtonHeart} onPress={() => swipeRef && swipeRef?.current ? messageSwipe(swipeRef) : console.log("no action")}>
                    <Entypo name="mail" size={17} color="green" />
                </TouchableOpacity>
            </View>
            <MessageModal isMessageModalVisible={isMessageModalVisible} setMessageModalVisible={setMessageModalVisible} requestMessage={requestMessage} setRequestMessage={setRequestMessage} swipeRefMessage={swipeRefMessage} currentCard={currentCard} />
            <RequestCapModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />

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
        // backgroundColor: "#00BFFF",
        height: "75%",
        borderRadius: 20,
        // borderColor: "#002D62",
        // borderColor:"#3498DB",
        // borderWidth: 5,
        // shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.41,
        elevation: 5
    },
    emptycardcontainer: {
        height: "75%",
    },
    infocontainer: {
        // backgroundColor: "#00308F",
        backgroundColor: "#87CEEB",
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
        fontSize: 22,
        fontWeight: 'bold',
        margin: 3
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
        backgroundColor: "#FF5864",
        // shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 2.41,
        elevation: 5
    },
    swipeButtonHeart: {
        bottom: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#32de84",
        // shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 2.41,
        elevation: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        height: "30%",
        width: "80%",
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
    },
    loading: {
        height: "100%",
        alignItems: 'center',
        justifyContent: 'space-evenly'

    },
});


export default SwipeScreen
