import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const GradYearPicker = ({selectedYear, setSelectedYear}) => {
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  
  const nextFiveYears = Array.from({ length: 10 }, (_, index) => currentYear + index);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
        style={styles.picker}
      >
        {nextFiveYears.map(year => (
          <Picker.Item key={year} label={year.toString()} value={year} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom:100,
    backgroundColor:"white",
    borderRadius:20
  },
  picker: {
    width: 200,
    height: 50,
  },
});

export default GradYearPicker;
