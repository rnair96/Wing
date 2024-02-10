import React, { useRef, useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { Entypo } from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper";
import { setDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import MessageModal from '../components/MessageModal';
import RequestCapModal from '../components/RequestCapModal';
import * as Sentry from "@sentry/react";
import SurveyModal from '../components/SurveyModal';
import { hasSixtyDaysPassed, hasMatch } from '../lib/secondSurveyCheck';
import ProfileCardComponent from '../components/ProfileCardComponent'



const SwipeScreen = ({ loggedProfile }) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const swipeRef = useRef(null);
    const [profiles, setProfiles] = useState([]);
    const [swipeAmount, setSwipeAmount] = useState(5);
    // const [swipeEnabled, setSwipeEnabled] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMessageModalVisible, setMessageModalVisible] = useState(false);

    const [requestMessage, setRequestMessage] = useState(null);
    const [swipeRefMessage, setSwipeRefMessage] = useState(null);
    const [loadingFetch, setloadingFetch] = useState(true);
    const [currentCard, setCurrentCard] = useState(null);

    const [surveyVisible, setSurveyVisible] = useState(false);
    const [surveyType, setSurveyType] = useState("initial")
    const [surveyOtherInfo, setSurveyOtherInfo] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState("Fitting Your Wings...")
    const [reload, setReload] = useState(false)



    // useEffect(() => { // must be updated with a query index in firestore

    //     if (loggedProfile && loggedProfile !== null) {

    //         const setSwipes = async () => {
    //             const startOfDay = new Date();
    //             startOfDay.setHours(0, 0, 0, 0);

    //             const endOfDay = new Date();
    //             endOfDay.setHours(23, 59, 59, 999);


    //             const userSnapshot = await getDocs(query(collection(db, global.users, user.uid, "swipes"),
    //                 where("swipedFrom", "==", "swipe"),
    //                 where("timeSwiped", ">=", startOfDay), where("timeSwiped", "<=", endOfDay),
    //                 orderBy("timeSwiped", "desc")), limit(1))
    //                 .catch((error) => {
    //                     Sentry.captureMessage(`Error getting the last swipe of ${user.uid}, ${error.message}`)
    //                 });

    //             if (!userSnapshot.empty) {
    //                 const latestSwipeDoc = userSnapshot.docs[0];
    //                 if (latestSwipeDoc.data()?.swipedAt && (latestSwipeDoc.data().swipedAt - 1) > 0) {
    //                     console.log("setting swipes to previously", (latestSwipeDoc.data().swipedAt - 1))
    //                     setSwipeAmount((latestSwipeDoc.data().swipedAt - 1));
    //                 } else if (latestSwipeDoc.data()?.swipedAt) {
    //                     console.log("setting swipes to 0 and disabling swipes");
    //                     setSwipeAmount(0);
    //                     setSwipeEnabled(false);
    //                     setIsModalVisible(true);
    //                 } else {
    //                     console.log("No swipes found today from user. Replenish swipes");
    //                 }
    //             } else {
    //                 console.log("No swipes found today from user. Replenish swipes");
    //             }

    //         }
    //         setSwipes();
    //     }

    // }, [db, loggedProfile])

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
                    Sentry.captureMessage(`Error updating birthday of ${user.uid}, ${error.message}`)
                });
            }
        }

    }, [loggedProfile]);


    useEffect(() => {
        let unsub;

        if (user && loggedProfile && loggedProfile !== null) {

            const fetchCards = async () => {


                console.log("fetching cards...")

                const functionURL = `${global.fetchcards}${user.uid}`;
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
                        if (!response.ok && response.status !== 204) {//check against 205
                            throw new Error('Network response was not ok');
                        } else if (response.status === 204) {
                            console.log("Reloading skipped deck");
                            setLoadingMessage("Reloading Skipped Wings...");
                            fetchCards();
                            return;
                        }
                        return response.json();

                    })
                    .then(data => {
                        if (data) {
                            setProfiles(data);  // Set the fetched profiles to your state variable
                            setCurrentCard(data[0])
                            console.log("cards fetched")
                            setloadingFetch(false);
                        } else{
                            console.log("No data retrieived")
                        }

                    })
                    .catch(error => {
                        console.log("Error fetching profiles:", error);
                        alert("Error gathering Wings. Try again later.")
                        Sentry.captureMessage(`Error gathering Wings for ${user.uid}, ${error.message}`)
                        setloadingFetch(false);
                    });
            }

            fetchCards();

            return () => {
                if (unsub) {
                    unsub();
                }
            };
        }

    }, [user, loggedProfile, reload]);//loggedProfile?.ageMin, loggedProfile?.ageMax,

    useEffect(() => {
        // Define an async function within the useEffect
        const checkConditions = async () => {
            if (loggedProfile && !loggedProfile?.surveyInfo && loggedProfile.gender === "male" && swipeAmount !== 5) {
                console.log("first survey")
                setSurveyVisible(true);
                // Add other conditions to check if thirty days have passed since account creation
            } else if (loggedProfile && loggedProfile?.surveyInfo && loggedProfile.gender === "male"
                && !loggedProfile.surveyInfo?.sixtydays
                && hasSixtyDaysPassed(loggedProfile.timestamp)) {
                console.log("sixty days passed")
                const hasAMatch = await hasMatch(user.uid);
                if (hasAMatch) {
                    console.log("second survey")
                    setSurveyType("sixtydays");
                    setSurveyOtherInfo(loggedProfile?.surveyInfo)
                    setSurveyVisible(true)
                }
            }
        };

        // Call the async function
        checkConditions();
    }, [loggedProfile, swipeAmount]);


    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) { return; }

        console.log("you swiped left on", profiles[cardIndex].displayName);

        setDoc(doc(db, global.users, user.uid, "passes", profiles[cardIndex].id), { id: profiles[cardIndex].id })
            .catch((error) => {
                alert("Error passing user. Try again later.")
                Sentry.captureMessage(`Error setting a pass for ${user.uid}, ${error.message}`)
                return;
            });

    }

    const messageSwipe = async (swipeRef) => {
        // if (swipeAmount === 0) {
        //     setSwipeEnabled(false);
        //     setIsModalVisible(true);
        //     return;
        // }
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
            swipedFrom: "swipe"
        }

        setRequestMessage(null);
        setSwipeAmount((swipeAmount - 1));
        console.log("swipe number at", (swipeAmount - 1));

        setDoc(doc(db, global.users, user.uid, "swipes", userSwiped.id), swipedUser)
            .catch(() => {
                alert("Error swiping user. Try again later.")
                Sentry.captureMessage(`Error setting a swipe for ${user.uid}, ${error.message}`)
                return;
            });
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
                                <Text style={{ fontWeight: "bold", fontSize: 20 }}>{loadingMessage}</Text>
                            </View>
                        </View>

                    ) : (
                        <View style={{ height: "100%", alignItems: "center", justifyContent: "space-evenly" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 20, margin:5}}>No Wings Around... </Text>
                            <Text style={{ fontWeight: "bold", fontSize: 15, margin:5}}>Reload For Skipped Wings Or Press Skip</Text>
                            <Image style={{ height: 300, width: 300, borderRadius: 150 }} source={require("../images/island_plane.jpg")} />
                            <Text style={{ fontWeight: "bold", fontSize: 15, margin:5}}>Or Wait For New Wings Later</Text>
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
                        // disableRightSwipe={!swipeEnabled}
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
                                <View key={card.id} style={{ height: "100%" }}>
                                    <ProfileCardComponent profile={card} canFlag={true} />
                                </View>
                            )
                        }
                        }
                    />
                </View>
            )}

            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <TouchableOpacity style={styles.swipeButtonCross} onPress={() => swipeRef && swipeRef?.current ? swipeRef.current.swipeLeft() : setReload(!reload)}>
                    {/* <Entypo name="cross" size={24} color="red" /> */}
                    <Text style={{color:"#9A2A2A", fontWeight:"bold"}}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.swipeButtonHeart} onPress={() => swipeRef && swipeRef?.current ? messageSwipe(swipeRef) : console.log("no action")}>
                    <Entypo name="mail" size={17} color="green" />
                </TouchableOpacity>
            </View>
            <MessageModal isMessageModalVisible={isMessageModalVisible} setMessageModalVisible={setMessageModalVisible} requestMessage={requestMessage} setRequestMessage={setRequestMessage} swipeRefMessage={swipeRefMessage} currentCard={currentCard} />
            <RequestCapModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
            <SurveyModal type={surveyType} isVisible={surveyVisible} setIsVisible={setSurveyVisible} otherInfo={surveyOtherInfo} />

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
        // borderColor: "#FF5864",
        backgroundColor:"#FF5864",
        // borderWidth:1,
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
