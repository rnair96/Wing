import React from 'react'
import { Text, View, Image, SafeAreaView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const WelcomeScreen =()=> {
    const navigation = useNavigation();
// , alignItems:"center", justifyContent:"space-evenly", backgroundColor:"#00BFFF", opacity:0.95
    return (
      <SafeAreaView style={{flex:1, justifyContent:"space-evenly"}}>
        <ImageBackground
        resizeMode='cover'
        style = {{flex:1}} 
        source={require("../images/pilots2.jpeg")}>
          <View style={{alignItems:"center", justifyContent:"center", marginTop:"15%"}}>
            <Text style={{color:"#00308F", fontSize:40, fontWeight:"bold", padding:5, fontFamily:"Times New Roman"}}> Welcome to</Text>
            <View style={{flexDirection:"row"}}>
            <Text style={{color:"#00308F", fontSize:50, fontWeight:"bold", padding:5, fontFamily:"Times New Roman"}}> Wing</Text>
            <Image style={{height:50, width:50, borderRadius:50, borderWidth:1, borderColor:"#00308F", top:5, backgroundColor:"#00BFFF"}} source={require("../images/logo.png")}/>
            </View>
            </View>
            {/* <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>Find your Wingman. Go on Missions.</Text> */}
            {/* <Image style={{height:150, width:200, backgroundColor:"#00BFFF"}} source={require("../images/helping_others.png")}/> */}
            {/* <Image style={{height:150, width:200, backgroundColor:"#00BFFF"}} source={require("../images/pilots2.jpeg")}/> */}

        
        

        <View style={{alignItems:"center", justifyContent:'space-evenly', height:"60%", backgroundColor:"#00308F", opacity:0.8, borderRadius:20, marginHorizontal:"18.5%", marginTop:"10%"}}>
                {/* <View style={{padding:5, alignItems:"center", justifyContent:"center"}}> */}
                {/* <Text style={styles.boldtext}>In the Wing community, we believe the most valuable part about you is NOT your looks, your money, or your status... </Text>
                <Text style={styles.boldtext}>BUT THE VALUE YOU GIVE TO OTHERS.</Text> */}
                <Text style={styles.boldtext}>It's Simple.</Text>
                <View style={{padding:5}}>
                    <Text style={styles.boldtext}>1. Find a Wing</Text>
                    <Text style={styles.boldtext}>2. Go On Missions</Text>
                    <Text style={styles.boldtext}>3. Build Your Network</Text>
                </View>
                {/* <Text style={{...styles.boldtext, textAlign:"center", fontSize:20}}> "If you give more than you expect to recieve, you will recieve more than you ever expect" - Tony Robbins</Text> */}
                {/* </View> */}
             <TouchableOpacity style={{borderRadius:10, borderWidth:3, padding:10, top:10, borderColor:"white"}} onPress={()=>{navigation.navigate("Home")}}>{/*, navigate to TutorialScreen */}
              <Text style={{color:"white", fontSize:17}}>Take A Quick Tutorial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{borderRadius:10, borderWidth:3, padding:10, top:10, borderColor:"white"}} onPress={()=>{navigation.navigate("Home")}}>{/*, {tutorial_bool: false} */}
              <Text style={{color:"white", fontSize:17}}>Start Swiping!</Text>
            </TouchableOpacity>
        </View>
        </ImageBackground>
      </SafeAreaView>
    )
  }

  const styles = StyleSheet.create({
    textstyle: {
      fontSize:15,
      padding:5
    },
    boldtext: {
      fontSize:17,
      fontWeight:"bold",
      padding:5,
      margin:10,
      color:"white",
      // fontFamily:"Calibri"
    }
  });
  


export default WelcomeScreen
