import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';



export const ProfileCardComponent = ({ profile, canFlag }) => {

    const navigation = useNavigation();

    return (
        <View style={styles.cardcontainer}>
            {profile && profile?.prompts && profile?.prompts.length > 0 && profile?.interests && profile?.interests.length > 4 && profile?.images && profile?.images.length > 2 && profile?.location ? (
                <TouchableOpacity style={{ justifyContent: "space-evenly", height: "100%", width: "100%" }} onPress={() => navigation.navigate("ProfileView", { profile: profile, canFlag: canFlag })}>
                    <View style={{ alignItems: "center", padding: 20 }}>
                        {/* <Text style={{ color: "white", margin: 10 }}>Mission: </Text>
                                                <Text style={styles.text}>{card.mission}</Text> */}
                        <Text style={{ color: "white", margin: 5 }}>{profile.prompts[0].prompt}</Text>
                        <Text style={styles.text}>{profile.prompts[0].tagline}</Text>
                    </View>
                    <View style={{ justifyContent: "space-evenly", height: "70%", width: "100%", backgroundColor: "#002D62" }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: "center" }}>
                            <View style={{ flexDirection: "column" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 20, color: "white", paddingBottom: 5 }}>{profile.displayName}</Text>
                                <Text style={{ color: "white", fontSize: 15 }}>{profile.age}</Text>
                                {profile?.university_student && profile.university_student.status === "active" ? (
                                    <View style={{ flexDirection: "column" }}>
                                        <Text style={{ color: "white", fontSize: 13 }}>{profile.school}</Text>
                                        <Text style={{ color: "#00BFFF", fontWeight: "800", fontSize: 15 }}>WING-U</Text>
                                    </View>
                                ) : (
                                    <Text style={{ color: "white", fontSize: 15 }}>{profile.job}</Text>
                                )}
                            </View>
                            <Image style={{ height: 120, width: 120, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }} source={{ uri: profile?.images[0] }} />
                        </View>
                        {profile?.medals && profile.medals.length > 0 ? (
                            <View style={{ flexDirection: "column", marginLeft: 5, marginRight: 7 }}>
                                <View style={{ flexDirection: "row", padding: 10 }}>
                                    <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                    <Text style={styles.cardtext}>{profile.medals[0] ? profile.medals[0] : `-- --`}</Text>
                                </View>
                                <View style={{ flexDirection: "row", padding: 10 }}>
                                    <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                    <Text style={styles.cardtext}>{profile.medals[1] ? profile.medals[1] : `-- --`}</Text>
                                </View>
                                {/* <View style={{ flexDirection: "row", padding: 10 }}>
                                            <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                            <Text style={styles.cardtext}>{profile.medals[2]?profile.medals[2]:`-- --`}</Text>
                                        </View> */}
                            </View>
                        ) : (
                            <View style={{ flexDirection: "column", width: "100%", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                    <Image style={{ height: 25, width: 20, right: 20 }} source={require("../images/medals_white.png")}></Image>
                                    <Text style={styles.cardtext}>-- --</Text>
                                </View>
                                <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                    <Image style={{ height: 25, width: 20, right: 20 }} source={require("../images/medals_white.png")}></Image>
                                    <Text style={styles.cardtext}>-- --</Text>
                                </View>
                                {/* <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                            <Image style={{ height: 25, width: 20, right: 20 }} source={require("../images/medals_white.png")}></Image>
                                            <Text style={styles.cardtext}>-- --</Text>
                                        </View> */}
                            </View>
                        )}
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                            <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{profile.interests[0]}</Text>
                            <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{profile.interests[1]}</Text>
                            <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{profile.interests[2]}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: "center", flexDirection: "row", width: "100%", padding: 20 }}>
                        <Image style={{ height: 25, width: 10 }} source={require("../images/droppin_white.png")}></Image>
                        <Text style={{ color: "white", fontSize: 15, left: 10 }}>{profile.location.text}</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <View style={{ flexDirection: "column", marginVertical: "60%", justifyContent: "center", alignItems: "center" }}>
                    <Image style={{ height: 100, width: 100, borderRadius: 50, borderWidth: 1, borderColor: "red" }} source={require("../images/account.jpeg")} />
                    <Text style={{ fontWeight: "bold", color: "white", padding: 10 }}> Error Loading Profile Or Profile Flagged...</Text>
                    <Text style={{ fontWeight: "bold", color: "white", padding: 10 }}> Try Again Later or Swipe Left</Text>
                    <View style={{ padding: 10, alignItems: "center" }}>
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    formTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#00308F",
        padding: 20
    },
    imagecontainer: {
        height: 440,
        width: "90%",
        borderRadius: 20
    },
    iconcontainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        bottom: 25,
        borderColor: "#00BFFF",
        borderWidth: 2
    },
    cardscontainer: {
        //  flex: 1,
        //  marginTop:-30,
    },
    cardcontainer: {
        backgroundColor: "#00308F",
        height: "75%",
        borderRadius: 20,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.41,
        elevation: 5
    },

    infocontainer: {
        //  bottom:70 ,
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30
    },
    cardtext: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold"
    },
    text: {
        // position: 'absolute', 
        top: 10,  // This will place the text near the top of the image
        color: "white",
        fontSize: 22,
        fontWeight: 'bold',
        margin: 3

    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background

    },
    modalView: {
        width: "80%",
        // maxHeight: 400,
        maxWidth: "90%",
        backgroundColor: 'white',
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
    swipeButtonCross: {
        bottom: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF5864",
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
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.3,
        shadowRadius: 2.41,
        elevation: 5
    },
})


export default ProfileCardComponent;
