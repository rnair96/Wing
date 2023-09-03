import React from 'react'
import { Text, View, Image, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const WelcomeScreen =()=> {
    const navigation = useNavigation();

    return (
      <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly", backgroundColor:"#00BFFF", opacity:0.95}}>
            <Text style={{color:"white", fontSize:25, fontWeight:"bold"}}> Mission. Service. WING. </Text>
            <Image style={{height:150, width:200, backgroundColor:"#00BFFF"}} source={require("../images/helping_others.png")}/>
        
        

        <View style={{alignItems:"center", justifyContent:'space-evenly', height:"60%"}}>
                {/* <View style={{padding:5, alignItems:"center", justifyContent:"center"}}> */}
                <Text style={styles.boldtext}>In the Wing community, we believe the most valuable part about you is NOT your looks, your money, or your status... </Text>
                <Text style={styles.boldtext}>BUT THE VALUE YOU GIVE TO OTHERS.</Text>
                <Text style={styles.boldtext}>Here's how it works:</Text>
                <View style={{padding:5}}>
                    <Text style={styles.boldtext}>1. Match with a Wing whose mission you can help</Text>
                    <Text style={styles.boldtext}>2. Help unselfishly</Text>
                    <Text style={styles.boldtext}>3. Build your network as you become a valued Wing in the community!</Text>
                </View>
                <Text style={{...styles.boldtext, textAlign:"center", fontSize:20}}> "If you give more than you expect to recieve, you will recieve more than you ever expect" - Tony Robbins</Text>
                {/* </View> */}
             <TouchableOpacity style={{borderRadius:10, borderWidth:3, padding:10, top:10, color:"white"}} onPress={()=>{navigation.navigate("Home")}}>
              <Text>Start Swiping!</Text>
            </TouchableOpacity>
        </View>
       
      </SafeAreaView>
    )
  }

  const styles = StyleSheet.create({
    textstyle: {
      fontSize:15,
      padding:5
    },
    boldtext: {
      fontSize:15,
      fontWeight:"bold",
      padding:5,
      color:"white"
    }
  });
  


export default WelcomeScreen
