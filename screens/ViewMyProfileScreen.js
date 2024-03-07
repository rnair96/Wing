import React from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet, FlatList } from 'react-native';


const ViewMyProfileScreen = ({ profile }) => {

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View>
                <FlatList
                    data={[profile]}
                    keyExtractor={(card) => card.id}
                    contentContainerStyle={{ flexGrow: 0 }}
                    renderItem={(card) =>
                    (
                        <View style={{ backgroundColor: "white" }}>

                            {/* <View style={{ backgroundColor: "#00308F", margin: 10, borderRadius: 20 }}>
                                <View style={{ alignItems: "center", padding: 10 }}>
                                    <Text style={{ color: "white" }}>Profile View On Swipe:</Text>
                                </View>
                            </View> */}

                            <View style={styles.cardcontainer}>
                                <View style={{ alignItems: "center", padding: 20 }}>
                                    <Text style={{ color: "white", margin: 5 }}>{card.item.prompts[0].prompt}</Text>
                                    <Text style={styles.text}>{card.item.prompts[0].tagline}</Text>
                                </View>
                                <View style={{ justifyContent: "space-evenly", height: 400, width: "100%", backgroundColor: "#002D62" }}>
                                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: "center" }}>
                                        <View style={{ flexDirection: "column" }}>
                                            <Text style={{ fontWeight: "bold", fontSize: 20, color: "white", paddingBottom: 5 }}>{card.item.displayName}</Text>
                                            <Text style={{ color: "white", fontSize: 15 }}>{card.item.age}</Text>
                                            {card.item?.university_student && card.item.university_student.status === "active" ? (
                                                <View style={{ flexDirection: "column" }}>
                                                    <Text style={{ color: "white", fontSize: 13 }}>{card.item.school}</Text>
                                                    {/* <Text style={{ color: "#00BFFF", fontWeight: "800", fontSize: 15 }}>WING-U</Text> */}
                                                </View>
                                            ) : (
                                                <Text style={{ color: "white", fontSize: 15 }}>{card.item.job}</Text>
                                            )}
                                        </View>
                                        <Image style={{ height: 120, width: 120, borderRadius: 50, borderWidth: 1, borderColor: "#00BFFF" }} source={{ uri: card.item?.images[0] }} />
                                    </View>
                                    <View style={{ flexDirection: "column", width: "80%", marginLeft: 15 }}>
                                        <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                                            <Image style={{ height: 20, width: 20, alignItems: "center" }} source={require("../images/bicep.png")}></Image>
                                            <Text style={styles.cardtext}>{card.item.strength ? card.item.strength : `-- --`}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                                            <Image style={{ height: 30, width: 20, alignItems: "center" }} source={require("../images/cracked_shield.png")}></Image>
                                            <Text style={styles.cardtext}>{card.item.weakness ? card.item.weakness : `-- --`}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.item.interests[0]}</Text>
                                        <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.item.interests[1]}</Text>
                                        <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.item.interests[2]}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: "center", flexDirection: "row", width: "100%", padding: 20 }}>
                                    <Image style={{ height: 25, width: 10 }} source={require("../images/droppin_white.png")}></Image>
                                    <Text style={{ color: "white", fontSize: 15, left: 10 }}>{card.item.location.text}</Text>
                                </View>
                            </View>

                            <View style={{ backgroundColor: "#00308F", margin: 10, borderRadius: 20 }}>
                                <View style={{ alignItems: "center", padding: 10 }}>
                                    <Text style={{ color: "white" }}>Expanded Profile View:</Text>
                                </View>
                            </View>

                            <View style={{ backgroundColor: "#00308F", margin: 10, borderRadius: 20, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5 }}>
                                <View style={{ alignItems: "center" }}>
                                    <View style={{ flexDirection: "row", padding: 10 }}>
                                        <Text style={{ padding: 10, color: "white" }}>{card.item.prompts[0].prompt}</Text>
                                    </View>
                                    <Text style={{ fontWeight: "bold", fontSize: 15, padding: 10, color: "white" }}>{card.item.prompts[0].tagline}</Text>


                                    <Image style={styles.imagecontainer} source={{ uri: card.item.images[0] }} />
                                </View>
                                <View style={styles.infocontainer}>
                                    <View>
                                        <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
                                            {card.item.displayName}
                                        </Text>

                                    </View>
                                    <View>
                                        <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>{card.item.age}</Text>
                                    </View>
                                </View>
                                {/* </View> */}

                                <View style={{ margin: 10, alignItems: "center", paddingBottom: 10 }}>
                                    {/* <Text style = {{padding: 10, color:"white"}}>Rank</Text>
                    <View style={{flexDirection:"row", padding: 10}}>
                    <Image style={{height:50, width:70, borderRadius:50}} source={RankBadge.getBadge(card.item.rank)}/>
                    <Text style = {{padding: 10, fontSize: 25, color:"white", fontWeight:"bold"}}>{card.item.rank}</Text>
                    </View> */}
                                    <View style={{ padding: 10 }}>
                                        <Text style={{ padding: 10, color: "white" }}>A Bit About Me</Text>
                                    </View>
                                    <View style={{ width: "95%", backgroundColor: "#6495ED", justifyContent: "flex-start", padding: 20, flexDirection: "column", borderRadius: 10 }}>
                                        {card.item?.university_student && card.item.university_student.status === "active" ?
                                            (
                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 10 }}>
                                                    <Image style={{ height: 25, width: 25 }} source={require("../images/book.png")} />
                                                    {card.item.university_student?.class_level && card.item.university_student?.class_level !== null && card.item.university_student?.class_level !== "" && card.item.university_student?.grad_year && card.item.university_student?.grad_year !== null && card.item.university_student?.grad_year !== "" ?
                                                        (
                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text style={{ color: "white" }}>{card.item.university_student.class_level}, </Text>
                                                                <Text style={{ color: "white" }}>Class of {card.item.university_student.grad_year}</Text>
                                                            </View>
                                                        ) : (
                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text style={{ color: "white" }}>Level --, </Text>
                                                                <Text style={{ color: "white" }}>Class of --</Text>
                                                            </View>
                                                        )}
                                                </View>
                                            ) : (
                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 10 }}>
                                                    <Image style={{ height: 25, width: 25 }} source={require("../images/suitcase.png")} />
                                                    <View style={{ flexDirection: "row" }}>
                                                        {card.item?.job && card.item.job !== null && card.item.job !== "" ?
                                                            (
                                                                <Text style={{ color: "white" }}>{card.item.job}</Text>
                                                            ) : (
                                                                <Text style={{ color: "white" }}>-- --</Text>
                                                            )}
                                                        {card.item?.company && card.item.company !== null && card.item.company !== "" &&
                                                            <Text style={{ color: "white" }}> at {card.item.company}</Text>}
                                                    </View>
                                                </View>
                                            )}
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 10 }}>
                                            <Image style={{ height: 20, width: 25 }} source={require("../images/grad_hat.png")} />
                                            {card.item?.school && card.item.school !== null && card.item.school !== "" ?
                                                (
                                                    <Text style={{ color: "white" }}>{card.item.school}</Text>
                                                ) : (
                                                    <Text style={{ color: "white" }}>-- --</Text>
                                                )}
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 10 }}>
                                            <Image style={{ height: 25, width: 25 }} source={require("../images/house.png")} />
                                            {card.item?.hometown && card.item.hometown !== null && card.item.hometown !== "" ?
                                                (
                                                    <Text style={{ color: "white" }}>{card.item.hometown}</Text>
                                                ) : (
                                                    <Text style={{ color: "white" }}>-- --</Text>
                                                )}
                                        </View>
                                        {card.item?.group && (
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 10 }}>
                                                <Image style={{ height: 25, width: 25 }} source={require("../images/group.png")} />
                                                <Text style={{ color: "white" }}>{card.item.group}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={{ fontWeight: "bold", fontSize: 15, padding: 10, color: "white" }}>{card.item.bio}</Text>

                                </View>
                            </View>

                            {card.item?.prompts && card.item.prompts.length > 1 && card.item.prompts[1] !== null && card.item.prompts[1]?.prompt && card.item.prompts[1]?.tagline &&
                                <View style={{ backgroundColor: "#00308F", margin: 10, borderRadius: 20, alignItems: "center", paddingBottom: 10, paddingTop: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5 }}>
                                    <Text style={{ padding: 10, color: "white" }}>{card.item.prompts[1].prompt}</Text>
                                    <Text style={{ fontWeight: "bold", fontSize: 15, padding: 20, color: "white" }}>{card.item.prompts[1].tagline}</Text>
                                </View>}

                            <View style={{ backgroundColor: "#00308F", margin: 10, borderRadius: 20, alignItems: "center", paddingBottom: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5 }}>
                                <Image style={styles.imagecontainer} source={{ uri: card.item.images[1] }} />
                                <View style={{ flexDirection: "row", padding: 10 }}>
                                    {card.item?.strength || card.item?.weakness ?
                                        (<Text style={{ padding: 10, color: "white" }}>Attributes & Interests</Text>) :
                                        (<Text style={{ padding: 10, color: "white" }}>Interests</Text>)}
                                </View>
                                {(card.item.strength || card.item.weakness) && (
                                    <View style={{ flexDirection: "column", width: "80%", marginLeft: 15 }}>

                                        {card.item?.strength &&
                                            <View style={{ flexDirection: "row", padding: 10 }}>
                                                <Image style={{ height: 25, width: 20, right: 5, alignItems: "center" }} source={require("../images/bicep.png")}></Image>
                                                <Text style={{ fontWeight: "bold", fontSize: 15, color: "white" }}>{card.item.strength}</Text>
                                            </View>
                                        }
                                        {card.item?.weakness &&
                                            <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                                                <Image style={{ height: 30, width: 20, right: 5, alignItems: "center" }} source={require("../images/cracked_shield.png")}></Image>
                                                <Text style={{ fontWeight: "bold", fontSize: 15, color: "white" }}>{card.item.weakness}</Text>
                                            </View>
                                        }
                                    </View>
                                )}
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", padding: 10 }}>
                                    <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.item.interests[0]}</Text>
                                    <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.item.interests[1]}</Text>
                                    <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.item.interests[2]}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", padding: 10 }}>
                                    <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.item.interests[3]}</Text>
                                    <Text style={{ borderWidth: 0.5, borderColor: "#00BFFF", borderRadius: 10, color: "#00BFFF", padding: 5 }}>{card.item.interests[4]}</Text>
                                </View>
                            </View>

                            {card.item?.prompts && card.item.prompts.length > 2 && card.item.prompts[2] !== null && card.item.prompts[2]?.prompt && card.item.prompts[2]?.tagline &&
                                <View style={{ backgroundColor: "#00308F", margin: 10, borderRadius: 20, alignItems: "center", paddingBottom: 10, paddingTop: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5 }}>
                                    <Text style={{ padding: 10, color: "white" }}>{card.item.prompts[2].prompt}</Text>
                                    <Text style={{ fontWeight: "bold", fontSize: 15, padding: 20, color: "white" }}>{card.item.prompts[2].tagline}</Text>
                                </View>
                            }

                            <View style={{ backgroundColor: "#00308F", margin: 10, borderRadius: 20, alignItems: "center", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5 }}>
                                <Image style={styles.imagecontainer} source={{ uri: card.item.images[2] }} />
                                <View style={{ margin: 10, alignItems: "center", paddingBottom: 10 }}>
                                    <Text style={{ padding: 10, color: "white" }}>Accomplishments</Text>
                                    {card.item?.medals && card.item.medals.length > 0 ? (
                                        <View style={{ flexDirection: "column" }}>
                                            <View style={{ flexDirection: "row", padding: 10, margin: 10, marginRight: 20 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>{card.item.medals[0] ? card.item.medals[0] : `-- --`}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", padding: 10, margin: 10, marginRight: 20 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>{card.item.medals[1] ? card.item.medals[1] : `-- --`}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", padding: 10, margin: 10, marginRight: 20 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>{card.item.medals[2] ? card.item.medals[2] : `-- --`}</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: "column" }}>
                                            <View style={{ flexDirection: "row", padding: 10, margin: 10 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>-- --</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", padding: 10, margin: 10 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>-- --</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", padding: 10, margin: 10 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>-- --</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                                {/* </View> */}

                                {/* <View style={{ height: 200, shadowOffset: {width: 0,height: 2}, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5 }}> */}
                                <View style={{ backgroundColor: "#00308F", margin: 10, borderRadius: 20, alignItems: "center" }}>
                                    <View style={{ flexDirection: "column", padding: 10 }}>
                                        <Image style={{ height: 20, width: 10, alignSelf: "center" }} source={require("../images/droppin_white.png")} />
                                        <Text style={{ fontWeight: "bold", fontSize: 15, padding: 10, color: "white" }}>{card.item.location.text}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                    }
                />
            </View>
        </SafeAreaView>

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
        width: "100%",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#00BFFF"
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
    },
    cardcontainer: {
        backgroundColor: "#00308F",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.41,
        elevation: 5,
        margin: 10
    },
    infocontainer: {
        //  bottom:70 ,
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30
    },
    cardtext: {
        left: 10,
        color: "white",
        fontSize: 15,
        fontWeight: "bold"
    },
    text: {
        top: 10,  // This will place the text near the top of the image
        color: "white",
        fontSize: 22,
        fontWeight: 'bold',
        margin: 3
    }
})

export default ViewMyProfileScreen;
