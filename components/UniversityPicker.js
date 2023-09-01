import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';


const UniversityPicker =({university_chosen, setUniversity}) => {
  const [universities, setUniversities] = useState([{name:"University of Maryland College Park"},{name:"Georgetown University"},{name:"American University"}]);

  // useEffect(() => {
  //   fetch('https://universities.hipolabs.com/search?country=United States')
  //     .then(response => response.json())
  //     .then(data => setUniversities(data));
  // }, []);

  return (
    <View>
      <Picker
            style={{width:400, height:150, paddingBottom:100}}
          selectedValue={university_chosen ? university_chosen : ""}
          onValueChange={setUniversity}>
        {universities.map((university, index) => (
          <Picker.Item key={index} label={university.name} value={university.name} />
        ))}
      </Picker>
    </View>
  );
}

export default UniversityPicker;
