import React, { Component, useState } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import useAuth from '../hooks/useAuth';
import Header from '../Header';
import { useNavigation } from '@react-navigation/core';
import { deleteDoc, doc, getDocs, collection, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';



const SettingsScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState(true);
    const [email, setEmail] = useState(user.email)

    //create a useEffect to update notifications state and email state from db


    const editNotifications = () => {
        if(notifications){
            console.log("Notifications set to false");
            setNotifications(false);
            
        }else{
            console.log("Notifications set to true");
            setNotifications(true);

        }
        //update db for notifications of user
    }

    const updateEmail = () => {
        console.log("update DB with new Email", email)
        //update db with Email
    }


    //deleting matches, passes and swipes, and user

    const deleteAll = async () => {
        await deleteInfo().then(()=> {
            deleteUser();
        }).catch(error => {
            console.log('There was an error',);
        })
    }

    const deleteInfo = async () => {
        deleteMatches();
        deleteSwipeHistory("swipes");
        deleteSwipeHistory("passes");
        // deleteOthersHistory();
    }

    const deleteUser = async () => {
        await deleteDoc(doc(db, 'users', user.uid)).then(() => {
            logout();
            console.log("User has been deleted successfully.")
        })
        .catch(error => {
            console.log('Error deleting user',error);
        })
    }

    const deleteMatches = async () => {
        const batch = writeBatch(db);
        const matches =[]
        await getDocs(collection(db,"matches")).then((snapshot) => {
            snapshot.docs.filter((doc)=> doc.id.includes(user.uid)).map((doc) => matches.push(doc.id))
        })

        if (matches.length>0){
            matches.map((matchID)=>{
                batch.delete(doc(db,'matches',matchID))
            })
    
            await batch.commit().then(() => {
                console.log('Matches deleted successfully.');
            }).catch((error) => {
                console.error('Error deleting matches: ', error);
            });
        }
        
    }

    const deleteSwipeHistory = async (swipe_collection) => {
        const batch = writeBatch(db);
        const history =[]
        await getDocs(collection(db, "users", user.uid, swipe_collection)).then((snapshot) => {
            snapshot.docs.map((doc) => history.push(doc.id))
        })


        if (history.length>0){
            history.map((historyID)=>{
                batch.delete(doc(db,'users',user.uid, swipe_collection, historyID))
            })
    
            await batch.commit().then(() => {
                console.log(swipe_collection, 'History deleted successfully.');
            }).catch((error) => {
                console.error('Error deleting',swipe_collection,'history: ', error);
            });
        }
        
    }

    // const deleteOthersHistory = async () => {
    //     const history =[]
    //     await getDocs(collection(db, "users")).then((snapshot) => {
    //         snapshot.docs.filter((doc) => 
    //         await getDocs(collection(db, 'users', doc.id, "swipes").then((swipesnapshot) =>{
    //             swipesnapshot.docs.filter((swipe) => swipe.id === user.uid).map((swipe) => {
    //                 history.push[doc.id]
    //             })
    //         }

    //         ))
    //         )}
    //         )
    // }


    return (
        <SafeAreaView>
        <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Settings"}/>
        <View style={{height:"90%", width:"100%", alignItems:"center", justifyContent:"space-evenly"}}>

        
        <TouchableOpacity style={styles.buttonContainer} onPress={() => editNotifications}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Edit Push Notifications</Text>
        </TouchableOpacity>

        <Text style = {{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Update Contact Email</Text>
        <TextInput
        value = {email}
        onChangeText = {setEmail} 
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => updateEmail}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("PrivacyPolicy")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Terms")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Terms of Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Guidelines")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Community Guidelines</Text>
        </TouchableOpacity>

          <TouchableOpacity 
              style={[{width:200, height:50, padding:15, borderRadius:10}, {backgroundColor:"#00308F"}]}
              onPress = {logout}>
              <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity 
              style={[{width:200, height:50, padding:15, borderRadius:10}, {backgroundColor:"red"}]}
              onPress = {deleteAll}>
              <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Delete Account</Text>
          </TouchableOpacity>

            </View>
          </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      height: 50,
      margin: 10,
      borderWidth: 1,
      borderColor: '#ccc'
    },
    iconcontainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        borderColor:"#00BFFF",
        borderWidth: 2
    }
    });

export default SettingsScreen
