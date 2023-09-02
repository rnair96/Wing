import React, { Component, useState, useEffect } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet, TextInput, Modal, TouchableHighlight} from 'react-native';
import useAuth from '../hooks/useAuth';
import Header from '../Header';
import { useNavigation, useRoute } from '@react-navigation/core';
import { deleteDoc, doc, getDocs, collection, writeBatch, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { storage } from '../firebase';
import { deleteObject, ref, listAll} from "firebase/storage";



const AccountScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    // const [notifications, setNotifications] = useState(true);
    const [ loadingImages, setLoadingImages ] = useState(false);
    const [ loadingMatches, setLoadingMatches ] = useState(false);
    const [ loadingSwipes, setLoadingSwipes ] = useState(false);
    const [ loadingPasses, setLoadingPasses ] = useState(false);


    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState(user.email)
    const [activeStudent, setActiveStudent] = useState(false);
    const { params } = useRoute();
    const profile = params;


    useEffect(()=>{
        if (profile) {
            setEmail(profile.email);

            if(profile?.university_student && profile.university_student.status==="active"){
                setActiveStudent(true);
            }
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
        updateDoc(doc(db, global.users,user.uid), {
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
            if(!loadingImages && !loadingMatches && !loadingPasses && !loadingSwipes){
                console.log("All Info deleted");
                deleteUser();
            }
        }).catch(error => {
            console.error('There was an error',error);
        })
    }

    const deleteInfo = async () => {
        setLoadingImages(true);
        setLoadingMatches(true);
        setLoadingPasses(true);
        setLoadingSwipes(true);
        deleteStoredImages();
        deleteMatches();
        deleteSwipeHistory("swipes");
        deleteSwipeHistory("passes");
        // deleteOthersHistory();
    }

    const deleteUser = async () => {
        await deleteDoc(doc(db, global.users, user.uid)).then(() => {
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
        await getDocs(collection(db,global.matches)).then((snapshot) => {
            snapshot.docs.filter((doc)=> doc.id.includes(user.uid)).map((doc) => matches.push(doc.id))
        })

        if (matches.length>0){
            
            matches.map((matchID)=>{
                batch.delete(doc(db,global.matches,matchID))
            })
    
            await batch.commit().then(() => {
                console.log('Matches deleted successfully.');
            }).catch((error) => {
                console.error('Error deleting matches: ', error);
            });
        }
        setLoadingMatches(false);
    }


    const deleteSwipeHistory = async (swipe_collection) => {
        const batch = writeBatch(db);
        const history =[]
        await getDocs(collection(db, global.users, user.uid, swipe_collection)).then((snapshot) => {
            snapshot.docs.map((doc) => history.push(doc.id))
        })


        if (history.length>0){
            history.map((historyID)=>{
                batch.delete(doc(db,global.users,user.uid, swipe_collection, historyID))
            })
    
            await batch.commit().then(() => {
                console.log(swipe_collection, 'History deleted successfully.');
            }).catch((error) => {
                console.error('Error deleting',swipe_collection,'history: ', error);
            });
        }

        swipe_collection === "swipes" ? setLoadingSwipes(false): setLoadingPasses(false);
        
    }

    const deleteStoredImages = async() => {
          console.log("Deleting images")

          for(let i = 0; i < 3; i++){
            const folderName = `images/${user.uid}/${i}/`      
            const folderRef = ref(storage, folderName);

          listAll(folderRef)
            .then((result) => {
            // Loop through each file and delete it
                result.items.forEach((fileRef) => {
                deleteObject(fileRef).then(() => {
                    console.log(`File ${fileRef.name} deleted successfully`);
                }).catch((error) => {
                    console.error(`Error deleting file ${fileRef.name}: ${error}`);
                });
                });

        // Once all files are deleted, delete the folder itself
                // deleteObject(folderRef).then(() => {
                //     console.log(`Folder ${folderName} deleted successfully`);
                // }).catch((error) => {
                //     console.error(`Error deleting folder ${folderName}: ${error}`);
                // });
            })
            .catch((error) => {
                console.error(`Error listing files in folder ${folderName}: ${error}`);
            }); 

          }
          setLoadingImages(false);
    }

    // const deleteOthersHistory = async () => {
    //     const history =[]
    //     await getDocs(collection(db, global.users)).then((snapshot) => {
    //         snapshot.docs.filter((doc) => 
    //         await getDocs(collection(db, global.users, doc.id, "swipes").then((swipesnapshot) =>{
    //             swipesnapshot.docs.filter((swipe) => swipe.id === user.uid).map((swipe) => {
    //                 history.push[doc.id]
    //             })
    //         }

    //         ))
    //         )}
    //         )
    // }

    const updateUniversitySetting = async () => {

        await updateDoc(doc(db, global.users, user.uid), {
            universityPreference: "No",
            university_student: {
                status: "inactive",
                class_level: profile.university_student.class_level,
                grad_year: profile.university_student.grad_year
            },
        }).then(() => {
            navigation.navigate("ToggleProfile",profile)
            alert("Congrats on graduating to Wing Professional! Please update your profile to optimize matching.")
        }).catch((error) => {
            alert(error.message)
        });
    }


    return (
        <SafeAreaView>
        <Header style={{fontSize:20, fontWeight: "bold", padding:20}} title={"Account"}/>
        <View style={{height:"90%", width:"100%", alignItems:"center", justifyContent:"space-evenly"}}>


        {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => editNotifications}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Edit Push Notifications</Text>
        </TouchableOpacity> */}

        {activeStudent && (
            <View style={{alignItems:"center", justifyContent:"space-evenly", padding:10, height:"30%", width:"100%"}}>
                <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Leave Wing-U?</Text>
                <Text style={{fontSize:12, margin:10}}>Graduate Wing University and upgrade your profile and matching as a Professional!</Text>
                <TouchableOpacity style={{...styles.savebuttonContainer, width:200}} onPress={() =>updateUniversitySetting()}>
                    <Text style={{textAlign:"center", fontSize: 12, fontWeight:"bold", color:"white"}}>Yes, Graduate Me</Text>
                </TouchableOpacity>
            </View>
        )}
        
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

        {/* should actually cycle through all providerData for potential password authentication */}
        {user.providerData[0].providerId === "password" && (<TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("ChangePassword")}>
        <Text style={{textAlign:"center", fontSize: 15, fontWeight:"bold"}}>Change Password</Text>
        </TouchableOpacity>)}

        {/* create a tab for Account, then give options there to update email address, change password, delete account or logout, 
        Turn Off Student Options for Profile (Doing so will remove you from Wing University)*/}

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

export default AccountScreen;