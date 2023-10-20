import React, {useState} from 'react'
import { View, TextInput, Text } from 'react-native'


const BirthdayInput = ({setAge, birthdate, setBirthDate}) => {
    const [inputvalue, setInputValue] = useState(birthdate);

    function handleBirthdayChange(text) {
      setInputValue(text);
        const dateRegex = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
        if (dateRegex.test(text)) {
          setBirthDate(text);
            const parts = text.split('/');
            const reformattedDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
            const birthDate = new Date(reformattedDate);
            // const birthDate = new Date(text);
            console.log("birthdate", birthDate)
            const currentDate = new Date();
            console.log("current date", currentDate);
            const differenceInMs = currentDate.getTime() - birthDate.getTime();
            console.log("difference ms", differenceInMs)
            const ageDate = new Date(differenceInMs);
            console.log("age date",ageDate);
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
          value={inputvalue} 
          style={{fontSize:15, alignItems:"center", borderWidth:2, borderColor:"grey", padding:10, borderRadius:15, marginBottom:10, backgroundColor:"#E0E0E0"}}
          placeholderTextColor={"grey"} 
          onChangeText={handleBirthdayChange}/>
      </View>
    );
}

export default BirthdayInput
