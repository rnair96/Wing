import React from 'react'
import { Button, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons} from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper";

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    console.log("HomeScreen user ", user);

    const DUMMY_DATA = [
        {
            firstName: "Rajesh",
            lastName: "Nair",
            occupation: "Entrepreneur",
            photoURL: require("../images/dummy_users/4.png"),
            age: 26,
            id: 1,
        },
        {
            firstName: "Johnny",
            lastName:"Sins",
            occupation: "Police Officer",
            photoURL: require("../images/dummy_users/sins.jpeg"),
            age: 37,
            id: 2,
        },
        {
            firstName: "Mia",
            lastName: "Khalifa",
            occupation: "Doctor",
            photoURL: require("../images/dummy_users/mia.jpg"),
            age: 27,
            id: 3,
        },
        {
            firstName: "Riley",
            lastName: "Reid",
            occupation: "Lawyer",
            photoURL: require("../images/dummy_users/riley.jpg"),
            id: 4,
        },
        {
            firstName: "Lana",
            lastName: "Rhodes",
            occupation: "Engineer",
            photoURL: require("../images/dummy_users/lana.jpeg"),
            age: 29,
            id: 5,
        }

    ]


  return (
   <SafeAreaView style={{flex:1}}>
    {/* Header */}
    <View>
    <Button title= "Logout" onPress= {logout}/>
        <TouchableOpacity onPress= {logout}>
            <Image style = {styles.imagecontainer} source={{ uri: user.photoURL }}/>
        </TouchableOpacity>
        <TouchableOpacity style={ {alignItems: "center"}}>
            <Image style={styles.iconcontainer} source={require("../images/tinder.png")}/>
        </TouchableOpacity>
        <TouchableOpacity style={{left: 330, bottom: 60}}>
            <Ionicons name="chatbubbles-sharp" size={30} color = "#FF5864" onPress={() => navigation.navigate("Chat")}/>
        </TouchableOpacity>
    </View>
    {/* End of Header */}
    {/* Cards */}
    <View style={styles.cardscontainer}>
        <Swiper cards={DUMMY_DATA} 
            stackSize={5}
            animateCardOpacity={true}
            verticalSwipe={false}
            containerStyle={{backgroundColor:"transparent"}}
            renderCard={(card)=>(
                <View key={card.id} style={styles.cardcontainer}>
                    <Image style={{height:500 ,width:335, borderRadius:20}} source={card.photoURL}/>
                    <View>
                        <View>
                            <Text>
                                {card.firstName}
                            </Text>
                            <Text>
                            {card.occupation}
                            </Text>
                        </View>
                        <Text>{card.age}</Text>
                    </View>
                </View>
            )}
        />
    </View>
   </SafeAreaView>
  )
}

const styles = StyleSheet.create({
   imagecontainer: {
        width: 30,
        height: 30,
        borderRadius: 50,
        left: 10,
        top: 20,
    },
    iconcontainer: {
        height: 50,
        width: 50,
        borderRadius: 50,
        bottom: 25,
    },
    cardscontainer: {
        flex: 1,
        marginTop:-80,
    },
    cardcontainer: {
        backgroundColor: "white",
        height:500,
        borderRadius: 20
        
    }
});


export default HomeScreen
