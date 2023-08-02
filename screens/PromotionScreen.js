import React, { Component, useEffect } from 'react'
import { Text, View, Image, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RankBadge } from '../lib/RankBadge';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';


const PromotionScreen =()=> {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { params } = useRoute();

    const rank = params;

    const handleSubmit = async () => {
        updateDoc(doc(db, global.users, user.uid), {
            recently_promoted: false
        }).then(() => {
            navigation.navigate("Home")
        }
        ).catch((error) => {
            alert(error.message)
        });
    }   

    return (
      <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly", backgroundColor:"#00BFFF", opacity:0.95}}>
        <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}> You Have Been Promoted to </Text>
        <Image style={{height:150, width:200, backgroundColor:"#00BFFF"}} source={RankBadge.getBadge(rank)}/>
        <Text style={{color:"white", fontSize:30, fontWeight:"bold"}}> {rank}</Text>

        <View style={{alignItems:"center", justifyContent:'space-evenly', margin:5}}>
            {rank === "Airman" ?(
                <View style={{padding:5, alignItems:"center"}}>
                <Text style={styles.boldtext}>Congratulations on gaining your first rank in Wing!</Text>
                <Text style={styles.boldtext}>In the Wing community, we believe the most valuable part about you is NOT your looks, your money, or your status like other apps...</Text>
                <Text style={styles.boldtext}>But the value you give others. Helping them with their problems or "missions". Being a true WING.</Text>
                <Text style={styles.boldtext}>Here's how it works:</Text>
                <View style={{padding:5}}>
                    <Text style={styles.boldtext}>1. Match with a Wing whose mission you can help</Text>
                    <Text style={styles.boldtext}>2. Help unselfishly</Text>
                    <Text style={styles.boldtext}>3. Encourage them to rate you honestly after, through the chat options</Text>
                    <Text style={styles.boldtext}>4. Watch yourself grow in our ranks and become highlighted as a Top Wing in the community!</Text>
                </View>
                </View>
            ):(
                <View style={{padding:10, alignItems:"center"}}>
                    <Text style={styles.boldtext}>"The best way to find yourself is to lose yourself in service of others."</Text>
                    <Text style={styles.boldtext}>- Mahatma Gandhi</Text>
                    <Text style={styles.boldtext}>Keep up the great work!</Text>
                </View>
            )}
             <TouchableOpacity style={{borderRadius:10, borderWidth:3, padding:10, top:10, color:"white"}} onPress={handleSubmit}>
              <Text>Return to Swiping</Text>
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
  


export default PromotionScreen
