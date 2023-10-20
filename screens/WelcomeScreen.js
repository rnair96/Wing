import React, { useState } from 'react'
import { Text, View, Image, SafeAreaView, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo, Ionicons } from '@expo/vector-icons';




const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [isTutorial, setIsTutorial] = useState(false);
  // , alignItems:"center", justifyContent:"space-evenly", backgroundColor:"#00BFFF", opacity:0.95
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-evenly" }}>
      <ImageBackground
        resizeMode='cover'
        style={{ flex: 1 }}
        source={require("../images/pilots2.jpeg")}>
        {!isTutorial ? (
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: "15%" }}>
            <Text style={{ color: "#00308F", fontSize: 40, fontWeight: "bold", padding: 5, fontFamily: "Times New Roman" }}> Welcome to</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#00308F", fontSize: 50, fontWeight: "bold", padding: 5, fontFamily: "Times New Roman" }}> Wing</Text>
              <Image style={{ height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: "#00308F", top: 5, backgroundColor: "#00BFFF" }} source={require("../images/logo.png")} />
            </View>
          </View>
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: "15%" }}>
            <Text style={{ color: "#00308F", fontSize: 40, fontWeight: "bold", padding: 5, fontFamily: "Times New Roman" }}> A Quick Tutorial</Text>
          </View>
        )}
        {/* <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>Find your Wingman. Go on Missions.</Text> */}
        {/* <Image style={{height:150, width:200, backgroundColor:"#00BFFF"}} source={require("../images/helping_others.png")}/> */}
        {/* <Image style={{height:150, width:200, backgroundColor:"#00BFFF"}} source={require("../images/pilots2.jpeg")}/> */}



        {!isTutorial ? (
          <View style={{ alignItems: "center", justifyContent: 'space-evenly', height: "60%", backgroundColor: "#00308F", opacity: 0.8, borderRadius: 20, marginHorizontal: "23%", marginTop: "10%" }}>

            <View style={{ padding: 5 }}>
              <Text style={styles.boldtext}>Find a Wing.</Text>
              <Text style={styles.boldtext}>Go On Missions.</Text>
              <Text style={styles.boldtext}>Build Your Network.</Text>
            </View>

            <TouchableOpacity style={{ borderRadius: 10, borderWidth: 3, padding: 10, top: 10, borderColor: "white" }} onPress={() => { setIsTutorial(true) }}>{/*, navigate to TutorialScreen */}
              <Text style={{ color: "white", fontSize: 17 }}>Take A Quick Tutorial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ borderRadius: 10, borderWidth: 3, padding: 10, top: 10, borderColor: "white" }} onPress={() => { navigation.navigate("Home") }}>{/*, {tutorial_bool: false} */}
              <Text style={{ color: "white", fontSize: 17 }}>Start Swiping!</Text>
            </TouchableOpacity>
          </View>
        ) : (

          <View style={{ alignItems: "center", height: "70%", backgroundColor: "#00308F", opacity: 0.8, borderRadius: 20, marginHorizontal: "10%", marginTop: "5%" }}>
            <ScrollView style={{ margin: 10, borderWidth: 1, borderColor: "white", borderRadius: 10 }}>
              <View>
                <Text style={styles.boldtext}>1. Swiping through Wings</Text>
                <Text style={styles.tutorialText}>This is your Swipe Screen, where you will be given a list of Wing profiles to swipe through.</Text>
                {/* <View style={{justifyContent:"center", width:"100%"}}> */}
                <Image style={{ height: 500, width: 250, margin: 10, padding: 10 }} source={require("../images/swipescreen.png")} />
                {/* </View> */}
                <View style={{ flexDirection: "row", margin: 10, padding: 3 }}>
                  <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Press </Text>
                  <View style={styles.swipeButtonHeart}>
                    <Entypo name="mail" size={12} color="green" />
                  </View>
                </View>
                <Text style={styles.tutorialText}>To send a Chat Request to a profile you like.</Text>
                <View style={{ flexDirection: "row", margin: 10, padding: 3 }}>
                  <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Press </Text>
                  <View style={styles.swipeButtonCross}>
                    <Entypo name="cross" size={12} color="red" />
                  </View>
                </View>
                <Text style={styles.tutorialText}>To pass a profile you don’t like.</Text>
                <Text style={styles.tutorialText}>You can also tap the profile to get more details about them.</Text>
                <Text style={styles.boldtext}>2. Respond & Chat</Text>
                <Text style={styles.tutorialText}>To see your Active Chats and Requests that other users have sent you,</Text>
                <View style={{ flexDirection: "row", margin: 10, padding: 3 }}>
                  <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Tap </Text>
                  <View style={{ bottom: 10 }}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#00BFFF" />
                  </View>
                </View>
                <Text style={styles.tutorialText}>Responding to a Request will move that user to your Active Chats and create a new chat thread.</Text>
                <Image style={{ height: 500, width: 250, margin: 10, padding: 10 }} source={require("../images/request_response.png")} />
                <Text style={styles.boldtext}>3. Local Missions & Events</Text>
                <Text style={styles.tutorialText}>Get exclusive access to promotional deals with bars, restuarants, events and other local establishments that you can explore with your Wing!</Text>
                <Text style={styles.tutorialText}>Simply check the News & Promos thread in your Active Chats to take advantage of the latest deals.</Text>
                <Image style={{ height: 200, width: 250, margin: 10, padding: 10 }} source={require("../images/local_deals.jpg")} />
                <Text style={styles.boldtext}>4. More Options</Text>
                <Text style={styles.tutorialText}>To edit and view your own profile,</Text>
                <View style={{ flexDirection: "row", margin: 10, padding: 3 }}>
                  <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Tap </Text>
                  <View style={{ bottom: 10 }}>
                    <Ionicons name="person" size={30} color="#00BFFF" />
                  </View>
                </View>
                <Text style={styles.tutorialText}>For Settings, Matching Preferences, or Help options,</Text>
                <View style={{ flexDirection: "row", margin: 10, padding: 3 }}>
                  <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Tap </Text>
                  <Image style={styles.iconcontainer} source={require("../images/logo.png")} />

                </View>
                <Text style={styles.boldtext}>Ok, you’re all set to find your Wing and go on Missions!</Text>

              </View>
            </ScrollView>
            <View style={{ padding: 20 }}>
              <TouchableOpacity style={{ borderRadius: 10, borderWidth: 3, padding: 10, borderColor: "white" }} onPress={() => { navigation.navigate("Home") }}>
                <Text style={{ color: "white", fontSize: 17 }}>Start Swiping!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  textstyle: {
    fontSize: 15,
    padding: 5
  },
  boldtext: {
    fontSize: 17,
    fontWeight: "bold",
    padding: 5,
    margin: 10,
    color: "white",
    // fontFamily:"Calibri"
  },
  tutorialText: {
    fontSize: 15,
    fontWeight: "bold",
    padding: 3,
    margin: 10,
    color: "white",
  },
  iconcontainer: {
    height: 30,
    width: 30,
    borderRadius: 50,
    bottom: 5,
    backgroundColor: "#00BFFF",
  },
  swipeButtonHeart: {
    bottom: 5,
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#32de84"
  },
  swipeButtonCross: {
    bottom: 5,
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5864"
  }
});



export default WelcomeScreen
