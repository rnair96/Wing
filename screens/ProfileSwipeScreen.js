import React, { Component, useState } from 'react';
import { FlatList, Text, View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Entypo } from '@expo/vector-icons';
import FlagModal from '../components/FlagModal';
import { RankBadge } from '../lib/RankBadge';

// import Container from '../components/Footer';


//remove and replace with Profile View Screen!! use goBack function in arrow
//to deal with state breakage issue
export const ProfileSwipeScreen = () => {
    const { params } = useRoute();
    const { card } = params; //add swiperef for swipe function


    const navigation = useNavigation();

    const [ flag_modal, setFlagModal ] = useState(false);
    const [ flag_user, setFlagUser ] = useState(null);

    // const profileSwipeLeft = () => {
    //   navigation.navigate("Home");
    //   swipeRef.current.swipeLeft()
    // }

    // const profileSwipeRight = () => {
    //   navigation.navigate("Home");
    //   swipeRef.current.swipeRight()
    // }

    const tagColor = (tag) => {
        if (tag === "Career-Focused") {
           return "#FF033E";
        } else if (tag === "Personal Growth") {
            return "#002D62";
        } else return "#018749";
    }

    const reportUser = () => {
        setFlagModal(true);
        setFlagUser(card);
    }


    return (

      <View style={{flex:1}}>
      <FlatList
      data = {[card]}
      keyExtractor={(card) => card.id}
      contentContainerStyle={{ flexGrow: 0 }}
      renderItem = {(card) =>
        (
                <View style={{backgroundColor:"black"}}>
                    <View style={{backgroundColor:"#00308F", margin:10, borderRadius:20}}>
                    <View style={{alignItems:"center"}}>
                    <View style={{flexDirection:"row", padding: 10}}>
                    {/* <Image style={styles.iconcontainer} source={require("../images/reverse_mission.jpeg")}/> */}
                    <Text style = {{padding: 10, color:"white"}}>Mission</Text>
                    {/* <Image style={styles.iconcontainer} source={require("../images/mission.jpeg")}/> */}
                    </View>
                    <Text style={{fontWeight:"bold", fontSize:15, padding: 10, color:"white"}}>{card.item.mission}</Text>
                    {/* <View style={{margin:10, padding:10, borderRadius:50, backgroundColor: tagColor(card.item.mission_tag)}}>
                    <Text style={{fontWeight:"bold", fontSize:12, color:"white"}}>{card.item.mission_tag}</Text>
                    </View> */}
                    <Image style={styles.imagecontainer} source={{uri: card.item.images[0]}}/>
                    </View>
                    <View style={styles.infocontainer}>
                        <View>
                            <Text style={{fontWeight:"bold", fontSize:20, color:"white"}}>
                                {card.item.displayName}
                            </Text>
                            <Text style={{color:"white"}}>
                            {card.item.job}
                            </Text>
                        </View>
                        <Text style={{fontWeight:"bold", fontSize:20, color:"white"}}>{card.item.age}</Text>
                    </View>
                    </View>
                    <View style={{backgroundColor:"#00308F", margin:10, borderRadius:20, alignItems:"center", paddingBottom:10}}>
                    {/* <View style={{flexDirection:"row", padding: 10}}> */}
                    {/* <Image style={styles.iconcontainer} source={require("../images/medal.jpg")}/> */}
                    <Text style = {{padding: 10, color:"white"}}>Rank</Text>
                    {/* <Image style={styles.iconcontainer} source={require("../images/medal.jpg")}/> */}
                    <View style={{flexDirection:"row", padding: 10}}>
                    <Image style={{height:50, width:70, borderRadius:50}} source={RankBadge.getBadge(card.item.rank)}/>
                    <Text style = {{padding: 10, fontSize: 25, color:"white", fontWeight:"bold"}}>{card.item.rank}</Text>
                    {/* </View> */}
                    </View>
                    </View>
                    <View style={{backgroundColor:"#00308F", margin:10, borderRadius:20, alignItems:"center", paddingBottom:10}}>
                    <View style={{flexDirection:"row", padding: 10}}>
                    {/* <Image style={styles.iconcontainer} source={require("../images/reverselogo.jpg")}/> */}
                    <Text style = {{padding: 10, color:"white"}}>Ideal Wing</Text>
                    {/* <Image style={styles.iconcontainer} source={require("../images/logo2.jpg")}/> */}
                    </View>
                    <Text style={{fontWeight:"bold", fontSize:15, padding: 10, color:"white"}}>{card.item.ideal_wing}</Text>
                    <Image style={styles.imagecontainer} source={{uri: card.item.images[1]}}/>
                    </View>
                    <View style={{backgroundColor:"#00308F", margin:10, borderRadius:20, alignItems:"center"}}>
                    <View style={{flexDirection:"row", padding: 10}}>
                    {/* <Image style={styles.iconcontainer} source={require("../images/reverse_biceps.jpg")}/> */}
                    <Text style = {{padding: 10, color:"white"}}>Medals</Text>
                    {/* <Image style={styles.iconcontainer} source={require("../images/bicep.jpg")}/> */}
                    </View>
                    <Text style={{fontWeight:"bold", fontSize:15, padding: 10, color:"white"}}>{card.item.skills}</Text>
                    <Image style={styles.imagecontainer} source={{uri: card.item.images[2]}}/>
                    <View style={{flexDirection:"row", padding: 10}}>
                    {/* <Image style={styles.iconcontainer} source={require("../images/medal.jpg")}/>
                    <Text style = {{padding: 10}}>Medals</Text>
                    <Image style={styles.iconcontainer} source={require("../images/medal.jpg")}/> */}
                    </View>
                    {/* <Text style={{fontWeight:"bold", fontSize:15, padding: 10}}>{card.item.accomplishments}</Text> */}
                    </View>

                    <View style={{height:300}}>
                    <View style={{backgroundColor:"#00308F", margin:10, borderRadius:20, alignItems:"center"}}>
                    {/* <View style={{flexDirection:"row", padding: 10}}>
                    <Image style={styles.iconcontainer} source={require("../images/smile.jpeg")}/>
                    <Text style = {{padding: 10}}>Hobbies</Text>
                    <Image style={styles.iconcontainer} source={require("../images/smile.jpeg")}/>
                    </View> */}
                    {/* <Text style={{fontWeight:"bold", fontSize:15, padding: 10}}>{card.item.hobbies}</Text> */}
                    <View style={{flexDirection:"column", padding: 10}}>
                    <Image style={{height: 40, width:40, alignSelf:"center", borderRadius:50}} source={require("../images/location.jpeg")}/>
                    <Text style={{fontWeight:"bold", fontSize:15, padding: 10, color:"white"}}>{card.item.location}</Text>
                    </View>
                    <View style={{padding:10}}>
                    <TouchableOpacity style={{padding:10, backgroundColor:"#00BFFF", borderRadius:20, borderWidth:2, borderColor:"white"}} onPress={reportUser}>
                        <Text style={{color:"white"}}>Report User</Text>
                    </TouchableOpacity>
                    </View>
                    </View>
                    </View>
                </View>
      )
    }//add distance to user on location
        />
        {/* <View style={{flexDirection:"row", justifyContent:"space-evenly", bottom:150}}>
        <TouchableOpacity style={styles.swipeButtonCross} onPress={()=>profileSwipeLeft()}>
                <Entypo name="cross" size={30} color="red"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.swipeButtonHeart} onPress={()=>profileSwipeRight()}>
                <Entypo name="heart" size={30} color="green"/>
        </TouchableOpacity>
    </View> */}

    <View style={{flexDirection:"row", justifyContent:"center", bottom:100}}>
    <TouchableOpacity style={styles.swipeButtonUp} onPress={()=>navigation.goBack()}>
            <Entypo name="arrow-bold-up" size={30} color="white"/>
    </TouchableOpacity>
    </View>
         {/* <Foo ter/> */}
         <FlagModal other_user={flag_user} isVisible={flag_modal} setIsVisible={setFlagModal} matchedID={null}/>
        </View>
        // </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
  imagecontainer: {
    height:440,
    width:"90%", 
    borderRadius:20
   },
   iconcontainer: {
    height: 30,
    width:30
   },
   cardscontainer: {
      //  flex: 1,
      //  marginTop:-30,
   },
   cardcontainer: {
       backgroundColor: "white",
      //  height:500,
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
      //  bottom:70 ,
       paddingVertical: 15, 
       flexDirection:"row",
       justifyContent: "space-between",
       paddingHorizontal: 30
   },
//    swipeButtonCross:{
//       bottom: 10,
//       width: 50,
//       height: 50,
//       borderRadius: 50,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: "#FF5864"
//    },
//    swipeButtonHeart:{
//        bottom: 10,
//        width: 50,
//        height: 50,
//        borderRadius: 50,
//        alignItems: "center",
//        justifyContent: "center",
//        backgroundColor: "#32de84"
//     }, 
    swipeButtonUp: {
      bottom: 10,
      width: 60,
      height: 60,
      borderRadius: 50,
      borderWidth:2,
      borderColor:"white",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#00BFFF"
    }
});

export default ProfileSwipeScreen;
