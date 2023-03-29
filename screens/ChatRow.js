import { useNavigation } from '@react-navigation/native'
import { onSnapshot, orderBy, query, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import UnreadHighlighter from '../components/UnreadHighlighter';

const ChatRow = ({ matchedDetails }) => {

    const  { user } = useAuth();
    const [ matchedUserInfo, setMatchedUserInfo ] = useState(null);
    const [ lastMessage, setLastMessage ] = useState();
    const [ read, setRead ] = useState();
    const [ loading, setLoading ] = useState(true);
    const navigator = useNavigation();
   

    useEffect(()=>{
        setMatchedUserInfo(getMatchedUserInfo(matchedDetails.users,user.uid));
    },[matchedDetails, user]);


    const setVars = (data) => {
        setLastMessage(data?.message);
        if(data && data?.userId !== user.uid){
            setRead(data.read);
        } else if(data && data?.userId === user.uid){
            setRead(true);
        } else {
            setRead(false);
        }
        setLoading(false);
    }

    useEffect(()=>
    onSnapshot(query(collection(db,"matches",matchedDetails.id,"messages"), 
        orderBy("timestamp", "desc")), (snapshot) => 
        setVars(snapshot.docs[0]?.data())
        )
        , [matchedDetails, db]);
    

    return ( 
        !loading && matchedUserInfo && (
        <View style={{paddingBottom:10, width:"90%"}}>
        <TouchableOpacity style={styles.container} onPress={()=>navigator.navigate("Message",{
            matchedDetails
        })}>
         <Image style = {{height:60, width:60, borderRadius:50}} source = {{uri:matchedUserInfo[1]?.images[0]}}/>
         <View style={{padding:10}}>
            <Text style={{fontWeight:"bold", fontSize:20, paddingLeft:10, paddingBottom:5}}>{matchedUserInfo[1]?.displayName}</Text>
            <Text style={{paddingLeft:10}}>{lastMessage || "Say Hi!"}</Text>
         </View>
         {!read && <UnreadHighlighter/>}
       </TouchableOpacity>
       </View>
    )
    )


}

const styles = StyleSheet.create({
    container:{
        left:15,
        flexDirection:"row",
        backgroundColor:"white",
        alignItems:"center",
        padding:5,
        shadowColor:"#000",
        borderRadius:15,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation:2
    }
})


export default ChatRow
