import React, { useState } from 'react';
import { FlatList, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import tagColor from '../lib/colorTag';
import FlagModal from '../components/FlagModal';


export const ProfileViewComponent = ({ profile, setFlag, flagged_type }) => {
    const [isFlagModalVisible, setIsFlagModalVisible] = useState(false);
    const card = profile;


    return (
        <View>
            {(card?.prompts && card.prompts.length > 0 && card?.images && card?.images.length > 2 && card?.interests && card?.interests.length > 4 && card?.location && !(card?.flagged_status && card?.flagged_status === "unresolved")) ? (
                <FlatList
                    data={[card]}
                    keyExtractor={(card) => card.id}
                    contentContainerStyle={{ flexGrow: 0 }}
                    renderItem={(card) =>
                    (
                        <View style={{ backgroundColor: "white" }}>
                            <View style={{ backgroundColor: "#00308F", margin: 10, borderRadius: 20, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5 }}>
                                <View style={{ alignItems: "center" }}>
                                    <View style={{ flexDirection: "row", padding: 10 }}>
                                        <Text style={{ padding: 10, color: "white" }}>{card.item.prompts[0].prompt}</Text>
                                    </View>
                                    <Text style={{ fontWeight: "bold", fontSize: 15, padding: 10, color: "white" }}>{card.item.prompts[0].tagline}</Text>

                                    {/* {card.item?.activity_tag && card.item.activity_tag !== "None" &&
                                        <View style={{ margin: 10, padding: 10, borderRadius: 50, backgroundColor: tagColor(card.item.activity_tag) }}>
                                            <Text style={{ fontWeight: "bold", fontSize: 12, color: "white" }}>{card.item.activity_tag}</Text>
                                        </View>
                                    } */}

                                    <Image style={styles.imagecontainer} source={{ uri: card.item.images[0] }} />
                                </View>
                                <View style={styles.infocontainer}>
                                    <View>
                                        <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
                                            {card.item.displayName}
                                        </Text>
                                    </View>
                                    <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>{card.item.age}</Text>
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
                                                        {card.item?.job ?
                                                            (
                                                                <Text style={{ color: "white" }}>{card.item.job}</Text>
                                                            ) : (
                                                                <Text style={{ color: "white" }}>-- --</Text>
                                                            )}
                                                        {card.item?.company && <Text style={{ color: "white" }}> at {card.item.company}</Text>}
                                                    </View>
                                                </View>
                                            )}
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 10 }}>
                                            <Image style={{ height: 20, width: 25 }} source={require("../images/grad_hat.png")} />
                                            {card.item?.school ?
                                                (
                                                    <Text style={{ color: "white" }}>{card.item.school}</Text>
                                                ) : (
                                                    <Text style={{ color: "white" }}>-- --</Text>
                                                )}
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 10 }}>
                                            <Image style={{ height: 25, width: 25 }} source={require("../images/house.png")} />
                                            {card.item?.hometown ?
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
                                    {/* {card.item?.bio ?
                                        (
                                            <Text style={{ fontWeight: "bold", fontSize: 15, padding: 10, color: "white" }}>{card.item.bio}</Text>
                                        ) : (
                                            <Text style={{ fontWeight: "bold", fontSize: 15, padding: 10, color: "white" }}>-- --</Text>

                                        )} */}
                                </View>
                            </View>

                            {card.item.prompts.length > 1 && card.item.prompts[1] !== null && card.item.prompts[1]?.prompt && card.item.prompts[1]?.tagline &&
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
                                            <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                                                <Image style={{ height: 20, width: 20, alignItems: "center" }} source={require("../images/bicep.png")}></Image>
                                                <Text style={{ fontWeight: "bold", fontSize: 15, color: "white", left:10 }}>{card.item.strength}</Text>
                                            </View>
                                        }
                                        {card.item?.weakness &&
                                            <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                                                <Image style={{ height: 30, width: 20, alignItems: "center" }} source={require("../images/cracked_shield.png")}></Image>
                                                <Text style={{ fontWeight: "bold", fontSize: 15, color: "white", left: 10}}>{card.item.weakness}</Text>
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

                            {card.item.prompts.length > 2 && card.item.prompts[2] !== null && card.item.prompts[2]?.prompt && card.item.prompts[2]?.tagline &&
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
                                            <View style={{ flexDirection: "row", padding: 15, margin: 10, marginRight: 20 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>{card.item.medals[0] ? card.item.medals[0] : `-- --`}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", padding: 15, margin: 10, marginRight: 20 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>{card.item.medals[1] ? card.item.medals[1] : `-- --`}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", padding: 15, margin: 10, marginRight: 20 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>{card.item.medals[2] ? card.item.medals[2] : `-- --`}</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: "column" }}>
                                            <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>-- --</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>-- --</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", padding: 10, marginRight: 7 }}>
                                                <Image style={{ height: 25, width: 20, right: 3 }} source={require("../images/medals_white.png")}></Image>
                                                <Text style={styles.cardtext}>-- --</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                                {/* </View> */}

                                {/* <View style={{ height: 200 }}> */}
                                <View style={{ margin: 10, alignItems: "center" }}>
                                    <View style={{ flexDirection: "column", padding: 10 }}>
                                        <Image style={{ height: 20, width: 10, alignSelf: "center" }} source={require("../images/droppin_white.png")} />
                                        <Text style={{ fontWeight: "bold", fontSize: 15, padding: 10, color: "white" }}>{card.item.location.text}</Text>
                                    </View>
                                </View>

                            </View>
                            {setFlag && (
                                <View style={{ padding: 10, alignItems: "center", paddingBottom: 70 }}>
                                    <TouchableOpacity style={{ padding: 30, backgroundColor: "white", borderRadius: 10, borderWidth: 2, borderColor: "#00BFFF", width: "95%", alignItems: "center", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2.41, elevation: 5 }} onPress={() => setIsFlagModalVisible(true)}>
                                        <Text style={{ color: "#00BFFF", fontWeight: "bold", fontSize: 17 }}>Report {card.item.displayName}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <FlagModal other_user={profile} isVisible={isFlagModalVisible} setIsVisible={setIsFlagModalVisible} detailsId={null} type={flagged_type} />
                        </View>
                        // </View>
                    )
                    }
                />
            ) : (
                <View style={{ flexDirection: "column", marginVertical: "60%", justifyContent: "center", alignItems: "center" }}>
                    <Image style={{ height: 100, width: 100, borderRadius: 50, borderWidth: 1, borderColor: "red" }} source={require("../images/account.jpeg")} />
                    <Text style={{ fontWeight: "bold", color: "black", padding: 30, textAlign: "center" }}> Error Loading Profile Or Profile Flagged... Try Again Later</Text>
                </View>
            )}
            {/* <Foo ter/> */}
        </View>
    )
}

const styles = StyleSheet.create({
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
        //  flex: 1,
        //  marginTop:-30,
    },
    cardcontainer: {
        backgroundColor: "white",
        //  height:500,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
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
        fontSize: 15
    },
});

export default ProfileViewComponent;
