import React, { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TouchableHighlight, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper";
import { getDocs, getDoc, setDoc, collection, onSnapshot, doc, query, where, serverTimestamp, updateDoc, limit, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import generateId from '../lib/generateId'
import getLocation from '../lib/getLocation';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as WebBrowser from 'expo-web-browser';
import checkFlagged from '../lib/checkFlagged';
// import LinearGradient from 'react-native-linear-gradient';


WebBrowser.maybeCompleteAuthSession();

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const swipeRef = useRef(null);
    const [profiles, setProfiles] = useState([]);
    const [loggedProfile, setLoggedProfile] = useState(null);
    const [swipeAmount, setSwipeAmount] = useState(3);
    const [swipeEnabled, setSwipeEnabled] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMessageModalVisible, setMessageModalVisible] = useState(false);
    const [requestMessage, setRequestMessage] = useState(null);
    const [swipeRefMessage, setSwipeRefMessage] = useState(null);


    useLayoutEffect(() => {
        const unsub = onSnapshot(doc(db, global.users, user?.uid), (snapshot) => {
            if (!snapshot.exists()) {
                navigation.navigate("SetUp0");
            } else if (!snapshot.data().university_student && !snapshot.data().job) {
                navigation.navigate("SetUp1");
            } else if (!snapshot.data().mission) {
                navigation.navigate("SetUp3", { id: user.uid });
            } else if (!snapshot.data().values) {
                navigation.navigate("SetUp4", { id: user.uid });
            } else if (!snapshot.data().images) {
                navigation.navigate("SetUp5", { id: user.uid });
            }

            // else if (!snapshot.data().genderPreference){
            //     navigation.navigate("Preferences", {id: user.uid});
            // } 

            else {
                const info =
                {
                    id: snapshot.id,
                    ...snapshot.data()
                }
                setLoggedProfile(info);
            }
        },
            (error) => {
                console.log("there was an error in homescreen layout snapshot", error)
            }
        )

        return () => {
            unsub();
        };

    }, [db]);

    useEffect(() => {
        (async () => {
            //check if user is in a new location, if so, update
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                console.log("status", finalStatus);
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
            }


            const location = await getLocation();
            if (loggedProfile && location && loggedProfile?.location !== location) {
                console.log("Updating location")
                updateDoc(doc(db, global.users, user.uid), {
                    location: location
                }).catch((error) => {
                    console.log("could not refresh location");
                });
            }
        })();
    }, [loggedProfile]);

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
                console.log("No swipes found today for user. Replenish swipes");
                // setSwipeAmount(swipeCap);
            }

        }
        // }
        setSwipes();
        // return unsub;

    }, [db])

    useEffect(() => {
        //check if user has any unresolved flags
        if (loggedProfile && loggedProfile?.flags) {
            const check = checkFlagged(loggedProfile.flags);
            if (check) {
                const index = loggedProfile.flags.length - 1;
                const flag = loggedProfile.flags[index];
                const flag_number = index + 1;
                //trigger modal screen
                navigation.navigate("Flagged", { flag, flag_number });
            }

        }

        //birthday checker - could be done on server side
        if (loggedProfile && loggedProfile?.birthdate) {
            const currentDate = new Date();
            const birthDate = new Date(loggedProfile.birthdate)

            if (currentDate.getMonth() === birthDate.getMonth()
                && currentDate.getDate() === birthDate.getDate()
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

        // if(loggedProfile && loggedProfile?.recently_promoted) {
        //     console.log("Promotion screen!");
        //     // console.log("does logged profile have a rank", loggedProfile?.rank)
        //     navigation.navigate("Promotion", loggedProfile?.rank)
        // }

    }, [loggedProfile]);


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

        setDoc(doc(db, global.users, user.uid, "passes", profiles[cardIndex].id), profiles[cardIndex]);

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
        setDoc(doc(db, global.users, userSwiped.id, "requests", user.uid), {
            id: user.uid,
            timestamp: timestamp,
            message: requestMessage,
        });

        const swipedUser = {
            swipedAt: swipeAmount,
            timeSwiped: timestamp,
            message: requestMessage,
            ...userSwiped
        }

        setRequestMessage(null);
        setSwipeAmount((swipeAmount - 1));
        console.log("swipe number at", (swipeAmount - 1));

        setDoc(doc(db, global.users, user.uid, "swipes", userSwiped.id), swipedUser);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate("ToggleProfile", loggedProfile)}>
                    {/* left: 20, top:10 */}
                    <Ionicons name="person" size={30} color="#00BFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={{ top: 30 }} onPress={() => navigation.navigate("Menu", loggedProfile)}>
                    <Image style={styles.iconcontainer} source={require("../images/logo.png")} />
                </TouchableOpacity>
                {/* right:20, top:10 */}
                <TouchableOpacity onPress={() => navigation.navigate("ToggleChat")}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#00BFFF" />
                </TouchableOpacity>
            </View>
            {/* End of Header */}
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

                        // onSwipedTop={(cardIndex)=> {
                        //     swipeTop(cardIndex);
                        // }}
                        // onTapCard={(cardIndex) =>{
                        //     if(topLine <= 2){
                        //         setTopLine(topLine+1);
                        //         console.log("topline",topLine)
                        //     } else {
                        //         setTopLine(0);
                        //     }
                        // }}
                        // overlayLabels={{
                        //     left: {
                        //         title: "DENY",
                        //         style: {
                        //             label: {
                        //                 textAlign: "right",
                        //                 color: "red",
                        //             },
                        //         },
                        //     },
                        //     right: {
                        //         title: "APPROVE",
                        //         style: {
                        //             label: {
                        //                 textAlign: "left",
                        //                 color: "#4DED30"
                        //             }
                        //         }
                        //     }
                        // }}

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
                {/* <TouchableOpacity style={styles.ButtonFlag} onPress={()=> swipeRef && swipeRef?.current ? console.log("user is", swipeRef.current): console.log("no action")}>
                            <Entypo name="flag" size={17} color="#CD7F32"/> swipeRef.current.swipeTop()
        </TouchableOpacity> */} 
                <TouchableOpacity style={styles.swipeButtonHeart} onPress={()=> swipeRef && swipeRef?.current ? messageSwipe(swipeRef): console.log("no action")}>
                            <Entypo name="mail" size={17} color="green"/>
                </TouchableOpacity> 
                {/* <TouchableOpacity style={styles.swipeButtonHeart} onPress={() => swipeRef && swipeRef?.current ? swipeRef.current.swipeRight() : console.log("no action")}>
                    <Entypo name="heart" size={24} color="green" />
                </TouchableOpacity> */}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 17, color: "white" }}>No More Likes Available!</Text>
                        <Text style={{ padding: 5, fontWeight: "700", paddingBottom: 10, color: "white" }}>Wait Till Tomorrow To Refresh Likes.</Text>
                        <TouchableHighlight
                            style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "white" }}
                            onPress={() => {
                                setIsModalVisible(!isModalVisible);
                            }}
                        >
                            <Text>Ok</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isMessageModalVisible}
                onRequestClose={() => {
                    setMessageModalVisible(!isMessageModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ padding: 5, fontWeight: "800", fontSize: 17, color: "white" }}>Send this User a Request:</Text>
                        <TextInput
                            value={requestMessage}
                            onChangeText={setRequestMessage}
                            placeholder={'I love your mission! How can I help?'}
                            multiline
                            numberOfLines={3}
                            placeholderTextColor={"grey"}
                            style={{ padding: 10, borderWidth: 2, borderColor: "grey", borderRadius: 15, backgroundColor:"white", width:"90%", height:"30%"}}/>
                            <TouchableHighlight
                            style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "white", width:120, alignItems:"center", borderRadius:10}}
                            onPress={() => {
                                console.log("send this message to user", requestMessage);
                                swipeRefMessage.current.swipeRight();
                                setMessageModalVisible(!isMessageModalVisible);
                            }}
                        >
                            <Text>Send</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ borderColor: "#00308F", borderWidth: 2, paddingVertical: 5, paddingHorizontal: 30, backgroundColor: "white", width:120, alignItems:"center", borderRadius:10}}
                            onPress={() => {
                                setMessageModalVisible(!isMessageModalVisible);
                            }}
                        >
                            <Text>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
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
        backgroundColor: "#00BFFF",
        // borderColor:"white",
        // borderColor:"#00308F",
        // borderWidth: 2
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
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '20%',
    },
    text: {
        // position: 'absolute', 
        top: 10,  // This will place the text near the top of the image
        // left: 0,
        // right: 0,
        color: "white",
        fontSize: 24,
        fontWeight: 'bold',
        // textAlign: 'center',
        // textShadowColor: 'rgba(0, 0, 0, 0.9)', // Shadow color
        // textShadowOffset: { width: -1, height: 1 },
        // textShadowRadius: 9
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
    swipeButtonMessage: {
        bottom: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00BFFF"
    },
    swipeButtonDown: {
        bottom: "30%",
        width: 60,
        height: 60,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#00BFFF",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        height:"30%",
        // maxHeight:400,
        width:"80%",
        // maxWidth:"90%",
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


export default HomeScreen
