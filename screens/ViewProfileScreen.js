import React from 'react';
import { View, ScrollView, Text, SafeAreaView, Image, StyleSheet, FlatList} from 'react-native';
import { RankBadge } from '../lib/RankBadge';
import tagColor from '../lib/colorTag';


const ViewProfileScreen = ({profile}) => {
    
return (
      <SafeAreaView style={{flex:1}}>

    <View>
      <FlatList
      data = {[profile]}
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
            <View style={{margin:10, padding:10, borderRadius:50, backgroundColor: tagColor(card.item.mission_tag)}}>
            <Text style={{fontWeight:"bold", fontSize:12, color:"white"}}>{card.item.mission_tag}</Text>
            </View>
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
            <Text style={{fontWeight:"bold", fontSize:15, padding: 10, color:"white"}}>{card.item.medals}</Text>
            <Image style={styles.imagecontainer} source={{uri: card.item.images[2]}}/>
            <View style={{flexDirection:"row", padding: 10}}>
            <Text style = {{padding: 10, color:"white"}}>A Bit About Me</Text>
            {/* <Image style={styles.iconcontainer} source={require("../images/medal.jpg")}/>
            <Text style = {{padding: 10}}>Medals</Text>
            <Image style={styles.iconcontainer} source={require("../images/medal.jpg")}/> */}
            </View>
            <Text style={{fontWeight:"bold", fontSize:15, padding: 10, color:"white"}}>{card.item.bio}</Text>
            {/* <Text style={{fontWeight:"bold", fontSize:15, padding: 10}}>{card.item.accomplishments}</Text> */}
            </View>

            <View style={{height:200}}>
            <View style={{backgroundColor:"#00308F", margin:10, borderRadius:20, alignItems:"center"}}>
            {/* <View style={{flexDirection:"row", padding: 10}}> */}
            {/* <Image style={styles.iconcontainer} source={require("../images/smile.jpeg")}/> */}
            {/* <Image style={styles.iconcontainer} source={require("../images/smile.jpeg")}/> */}
            {/* </View> */}
            <View style={{flexDirection:"column", padding: 10}}>
            <Image style={{height: 40, width:40, alignSelf:"center", borderRadius:50}} source={require("../images/location.jpeg")}/>
            <Text style={{fontWeight:"bold", fontSize:15, padding: 10, color:"white"}}>{card.item.location}</Text>
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
  formTitle :{
    fontSize:15, 
    fontWeight: "bold", 
    color:"#00308F", 
    padding:20
  },
  imagecontainer: {
    height:440,
    width:"90%", 
    borderRadius:20
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
}
})

export default ViewProfileScreen;
