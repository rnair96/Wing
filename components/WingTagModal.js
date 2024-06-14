import React, { useEffect, useState } from 'react';
import { Text, View, Modal, TouchableHighlight, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';
import WingTagRow from './WingTagRow';


const WingTagModal = ({ isVisible, setIsVisible, matches, setInput, setReplyToken, setUserIdReply, setUserNameReply, setIsWingSelected }) => {
    const [loading, setLoading] = useState(true)
    const [matchedWings, setMatchedWings] = useState([]);
    const { user } = useAuth();


    const selectWing = (wingId, wingName, wingToken) => {
        const nameReply = "@" + wingName + " ";
        setUserIdReply(wingId);
        setUserNameReply(wingName);
        setReplyToken(wingToken);
        setInput(nameReply);
        setIsWingSelected(true);
        setIsVisible(false);
    }


    useEffect(() => {
        if (matches && matches.length > 0) {
            setMatchedWings(matches.map(item => getMatchedUserInfo(item.userMatched, user.uid)));
        }
        setLoading(false)
    }, [])

    // const renderItem = (item) => {
    //     return (
    //         <TouchableOpacity style={{ padding: 5, borderWidth: 0.5, borderColor: "grey", borderRadius: 10 }} onPress={() => console.log("hello wing")}>
    //             <Text style={{ fontWeight: "bold", fontSize: 20, paddingLeft: 10, paddingBottom: 5 }}>{item}</Text>
    //         </TouchableOpacity>
    //     )
    // }


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}
        >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>


                {!loading ? (
                    <View style={{alignItems:"center", width:"100%", justifyContent:"center"}}>
                        <Text style={{ padding: 20, fontWeight: "bold", fontSize: 20 }}>Tag Your Wing</Text>
                        {matchedWings.length > 0 &&
                            <FlatList
                                data={matchedWings}
                                style={{borderTopWidth:0.5, borderBottomWidth:0.5, borderColor:"grey", height:"65%"}}
                                keyExtractor={item => item}
                                renderItem={({ item }) => <WingTagRow wingId={item} selectWing={selectWing} />}
                                // renderItem={({ item }) => renderItem(item)}
                            />
                        }
                    </View>

                ) : (
                    <View style={{alignItems:"center"}}>
                        <Text style={{ padding: 20, fontWeight: "bold", fontSize: 20 }}>Loading Wings</Text>
                        <ActivityIndicator size="small" color="#00BFFF" />
                    </View>

                )}
                <TouchableHighlight
                    style={styles.opacitystyle}
                    onPress={() => setIsVisible(!isVisible)}
                >
                    <Text style={styles.textStyle}>Cancel</Text>
                </TouchableHighlight>
                </View>
            </View>
        </Modal>

    )
}

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background

    },
    modalView: {
        height: "50%",
        width: "70%",
        // maxHeight:500,
        // maxWidth:"90%",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    opacitystyle: {
        // borderColor: "#00308F",
        // borderWidth: 2,
        backgroundColor: "#00308F",
        width: "90%",
        height: "15%",
        alignItems: "center",
        borderRadius: 10,
        justifyContent: "center",
        margin:10
    }

})

export default WingTagModal;