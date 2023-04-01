import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import getTime from '../lib/getTime';

const RecieverMessage = ({ message })  => {
    const [time, setTime ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    
    if(message && message?.timestamp){
      let milliseconds = message.timestamp.seconds * 1000 + Math.floor(message.timestamp.nanoseconds / 1000000);
      setTime(getTime(new Date(milliseconds)));
      setLoading(false);
    }
    
  },[message])


    return (
    !loading && (
    <View style={{ padding:5, maxWidth: 250, marginRight:"auto", alignSelf:"flex-start", flexDirection:"row"}}>
        <Image
            style = {{height: 50, width: 50, borderRadius:50}}
            source = {{uri: message.photoURL}}
        />
        <View style={{alignItems:"center"}}>
        <View style={{left:5, backgroundColor:"#00BFFF", borderBottomLeftRadius:20, borderBottomRightRadius:20, borderTopRightRadius:20}}>
            <Text style={{color:"white", padding:10, fontSize:20}}> {message.message} </Text>
        </View>
        <Text style={{fontSize:15, color:"grey"}}>{time}</Text>
        </View>
    </View>
    )

    )
}

export default RecieverMessage
