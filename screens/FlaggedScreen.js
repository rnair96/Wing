import React, { Component } from 'react'
import { Text, View, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';


const FlaggedScreen =()=> {
    const { params } = useRoute();

    const { flag, flag_number } = params;


    return (
      <View style={{flex:1, alignItems:"center", justifyContent:"space-evenly", backgroundColor:"#F08080", opacity:0.95}}>
        <Text style={{color:"white", fontSize:40, fontWeight:"bold"}}> You've Been Flagged</Text>

        <View style={{alignItems:"center", justifyContent:'space-evenly'}}>
            {flag_number > 3 ?(
                <View>
                <Text>You will not be able to continue use of Wing and until you've resolved this flag: {flag.type}</Text>
                <Text>Please email support@wing.community for assistance on this matter.</Text>
                <Text>Provide email and name associated with this account as well as the type of flag raised on your account.</Text>
                <Text>As a reminder, we at Wing do not allow any type of adult content, inappropriate behavior, harrasment and the like.</Text>
                <Text>Our platform is space to cultivate valued networks and relationships that help our users progress faster in their missions in life. We believe in keeping our user base at a high quality to maintain this experience. Therefore if you are reported three times, your account will be permanantly blocked.</Text>
                </View>
            ):(
                <View>
                    <Text>Your account has reached the maximum number of reported activity and is now permanantly banned.</Text>
                    <Text>If you believe there has been a mistake, you can email support@wing.community for assistance </Text>
                    <Text>As a reminder, we at Wing do not allow any type of adult content, inappropriate behavior, harrasment and the like.</Text>
                    <Text>Our platform is space to cultivate valued networks and relationships that help our users progress faster in their missions in life. We believe in keeping our user base at a high quality to maintain this experience.</Text>
                </View>
            )}
            
        </View>
       
      </View>
    )
  }


export default FlaggedScreen
