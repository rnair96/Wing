import React, { Component } from 'react'
import { Text, View, Image, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';


const FlaggedScreen =()=> {
    const {logout} = useAuth();
    const { params } = useRoute();

    const { flag, flag_number } = params;


    return (
      <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"space-evenly", backgroundColor:"#F08080", opacity:0.95}}>
        <Text style={{color:"white", fontSize:23, fontWeight:"bold"}}> Your Account Has Been Flagged</Text>
        <Image style={{height:150, width:150, backgroundColor:"#F08080"}} source={require("../images/jail.png")}/>

        <View style={{alignItems:"center", justifyContent:'space-evenly', margin:10}}>
            {flag_number < 3 ?(
                <View>
                <Text style={styles.boldtext}>You will not be able to continue use of Wing and until you've resolved this flag: {flag.type}</Text>
                <Text style={styles.textstyle}>Please email support@wing.community for assistance on this matter.</Text>
                <Text style={styles.textstyle}>In the email, provide email address and name associated with this account as well as the type of flag raised on your account.</Text>
                <Text style={styles.textstyle}>As a reminder, we at Wing do not allow any type of NSFW/adult content, inappropriate behavior, harrasment and the like.</Text>
                <Text style={styles.boldtext}>Therefore if you are reported three times, your account will be permanantly blocked.</Text>
                </View>
            ):(
                <View>
                  <Text style={styles.boldtext}>Your account has reached the maximum number of reported activity and is now permanantly banned.</Text>
                  <Text style={styles.textstyle}>If you believe there has been a mistake, you can email support@wing.community for assistance </Text>
                  <Text style={styles.boldtext}>As a reminder, we at Wing do not allow any type of NSFW/adult content, inappropriate behavior, harrasment and the like.</Text>
                </View>
            )}
            <TouchableOpacity style={{borderRadius:10, borderWidth:3, padding:10, top:10}} onPress={logout}>
              <Text>Logout</Text>
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
      padding:5
    }
  });
  


export default FlaggedScreen
