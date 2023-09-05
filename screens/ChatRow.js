import { useNavigation } from '@react-navigation/native'
import { onSnapshot, orderBy, query, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import UnreadHighlighter from '../components/UnreadHighlighter';
import getTime from '../lib/getTime';

const ChatRow = ({ matchedDetails }) => {

    const  { user } = useAuth();
    const [ matchedUserInfo, setMatchedUserInfo ] = useState(null);
    const [ lastMessage, setLastMessage ] = useState();
    const [ read, setRead ] = useState();
    const [ loading, setLoading ] = useState(true);
    const [ timestamp, setTimeStamp ] = useState();
    const navigator = useNavigation();
   

    useEffect(()=>{
        setMatchedUserInfo(getMatchedUserInfo(matchedDetails.users,user.uid));
    },[matchedDetails, user]);


    const setVars = (data) => {
        if(data && data?.message?.length>15){
            const message = data?.message?.slice(0,15)+"..."
            setLastMessage(message);
        } else{
            setLastMessage(data?.message)
        }

        if(data && data?.timestamp){
            let milliseconds = data?.timestamp.seconds * 1000 + Math.floor(data?.timestamp.nanoseconds / 1000000);
            const time = getTime(new Date(milliseconds))
            setTimeStamp(time);
        }
        
        if(data && data?.userId !== user.uid){
            setRead(data.read);
        } else if(data && data?.userId === user.uid){
            setRead(true);
        } else {
            setRead(false);
        }
        setLoading(false);
    }

    useEffect(()=>{

        const unsub = onSnapshot(query(collection(db,global.matches,matchedDetails.id,"messages"), 
            orderBy("timestamp", "desc")), (snapshot) => 
            setVars(snapshot.docs[0]?.data())
            )

        return () => {
            unsub();
        };
        
    }, [matchedDetails, db]);
        
    

    return ( 
        !loading && matchedUserInfo && (
        <View style={{padding:10, width:"95%"}}>
        <TouchableOpacity style={styles.container} onPress={()=>navigator.navigate("Message",{
            matchedDetails
        })}>
        {/* {!read ? <UnreadHighlighter/>:<View style={{padding:15}}></View>} */}
        <Image style = {{height:60, width:60, borderRadius:50, borderWidth:1, borderColor:"#00BFFF"}} source = {{uri:matchedUserInfo[1]?.images[0]}}/>
         <View style={{flexDirection:"row"}}>
         <View style={{padding:10}}>
            <Text style={{fontWeight:"bold", fontSize:20, paddingLeft:10, paddingBottom:5, color:"white"}}>{matchedUserInfo[1]?.displayName}</Text>
            {!read? (
                <Text style={{paddingLeft:10, color:"white", fontWeight:"bold"}}>{lastMessage|| "Say Hi!"}</Text>
            ):(
                <Text style={{paddingLeft:10, color:"white"}}>{lastMessage|| "Say Hi!"}</Text>
            )}
         </View>
         <View style={{position:"absolute", left:190, top:20, flexDirection:"row"}}>
         <Text style={{fontSize:10, color:"white"}}>{timestamp||"New Match"}</Text>
         {!read && <UnreadHighlighter/>}
        </View>
         </View>
       </TouchableOpacity>
       </View>
    )
    )


}

const styles = StyleSheet.create({
    container:{
        left:15,
        flexDirection:"row",
        backgroundColor:"#00308F",
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
