import React from 'react';
import { useEffect, useState } from 'react';
import {Button, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';



function Form(){
     const [date, setDate] = useState(new Date());
     const [dateSelected,setDateSelected]=useState(false);
    return(
        <View style={styles.container}>
             <Text>Information about your product</Text>
        <View style={styles.formBack}>
           
            <TextInput>Barcode</TextInput>
             <TextInput>name</TextInput>
             <TouchableOpacity onPress={function() {setDateSelected(true)}} ><Text>Select Expire Date</Text></TouchableOpacity>
          <Button style={styles.button} title='Save Product'></Button>
         {dateSelected && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                console.log(selectedDate)
                setDateSelected(false);
              }
            }}
          />
        
        )}
            
           

        </View>
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
   
    padding:20,
    alignItems:'center',
    

   height:400,
   width:400,
    backgroundColor: '#cc1a1aff',
    borderRadius:16
  },
  formBack: {
    flex: 1,
   alignItems:'center',
     backgroundColor: '#dededeff',
   height:350,
   width:350,

   
  },
  button:{
    paddingTop:100,
    color:'brown',
    borderRadius:16,
  },
});

export default Form