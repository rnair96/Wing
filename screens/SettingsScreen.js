import React, { Component, useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, TextInput, Modal, TouchableHighlight,} from 'react-native';
import useAuth from '../hooks/useAuth';
import Header from '../Header';
import { useNavigation, useRoute } from '@react-navigation/core';
import { deleteDoc, doc, getDocs, collection, writeBatch, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';



const SettingsScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    // const [notifications, setNotifications] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState(user.email)
    const { params } = useRoute();
    const profile = params;


    useEffect(()=>{
        if (profile) {
            setEmail(profile.email);
        }

    },[profile])


    // const editNotifications = () => {
    //     if(notifications){
    //         console.log("Notifications set to false");
    //         setNotifications(false);
            
    //     }else{
    //         console.log("Notifications set to true");
    //         setNotifications(true);

    //     }
    //     //update db for notifications of user
    // }

    const updateEmail = () => {
        updateDoc(doc(db, 'users',user.uid), {
            email:email
            }).then(()=> {
            navigation.navigate("Home");
            console.log("new email for user set to:", email)
        }).catch((error) => {
            alert(error.message)
        });
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

        
        {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => editNotifications}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Edit Push Notifications</Text>
        </TouchableOpacity> */}
        <Text style = {{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Contact Email</Text>
        <View style ={{flexDirection:"row"}}>
        <TextInput
        value = {email}
        onChangeText = {setEmail} 
        style={{padding:10, borderWidth:2, borderColor:"grey", borderRadius:15}}/>
        <TouchableOpacity style={styles.savebuttonContainer} onPress={() => updateEmail()}>
        <Text style={{textAlign:"center", fontSize: 12, fontWeight:"bold", color:"white"}}>Update</Text>
        </TouchableOpacity>
        </View>

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
              onPress = {() => setModalVisible(true)}>
              <Text style={{textAlign:"center", color:"white", fontSize: 15, fontWeight:"bold"}}>Delete Account</Text>
          </TouchableOpacity>

            </View>

            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize:14, textAlign:"center", paddingBottom:10}}>Are you sure you want to delete your account? All data will be permanantly lost</Text>
            <TouchableHighlight
              style={{ borderColor:"grey", borderWidth:2, padding:15, width:300}}
              onPress={() => {
                deleteAll();
              }}
            >
              <Text style={styles.textStyle}>Yes</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ borderColor:"grey", borderWidth:2, padding:15, width:300}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>No</Text>
            </TouchableHighlight>
          </View>
          </View>
      </Modal>

          </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    savebuttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 40,
        margin: 10,
        borderRadius:10,
        backgroundColor:"green"
      },
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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
      },
      modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding:10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      textStyle: {
          color: 'black',
          fontWeight: 'bold',
          textAlign: 'center'
        }
    });

export default SettingsScreen
