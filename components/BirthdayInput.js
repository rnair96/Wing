import React, { useState } from 'react'
import { View, TextInput } from 'react-native'


const BirthdayInput = ({setAge, birthdate, setBirthDate}) => {
    // const [birthday, setBirthday] = useState();

    function handleBirthdayChange(text) {
        const dateRegex = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
        if (dateRegex.test(text)) {
            setBirthDate(text);
            const birthDate = new Date(text);
            const currentDate = new Date();
            const differenceInMs = currentDate.getTime() - birthDate.getTime();
            const ageDate = new Date(differenceInMs);
            const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
            console.log("calculated age",calculatedAge)
            setAge(calculatedAge);
        } else {
            console.log("ERROR parsing birthdate");
        }
        
      }
  
    return (
      <View>
        <TextInput 
          placeholder="MM/DD/YYYY" 
          value={birthdate} 
          style={{fontSize:15, alignItems:"center", borderWidth:2, borderColor:"grey", padding:10, borderRadius:15, color:"white"}}
          placeholderTextColor={"grey"} 
          onChangeText={handleBirthdayChange}/>
      </View>
    );
}

export default BirthdayInput
