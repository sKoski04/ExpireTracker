import React from 'react';
import { useEffect, useState } from 'react';
import {Button, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { insertTestItem, getProductByBarcode } from '../dbInit';


function Form({barCode,expireDate, shelves}){
  const [productName, setProductName] = useState('');
  const [date, setDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState(shelves && shelves.length > 0 ? shelves[0].id : null);

  useEffect(() => {
    async function loadProductName() {
      if (barCode) {
        try {
          const product = await getProductByBarcode(barCode);
          if (product) {
            console.log('Auto-filling product name:', product.name);
            setProductName(product.name);
          }
        } catch (error) {
          console.log('Error loading product name:', error);
        }
      }
    }
    loadProductName();
  }, [barCode]);

  async function handleProductSave(){
    if (!productName.trim()) {
      alert('Please enter a product name');
      return;
    }
    if (!dateSelected) {
      alert('Please select an expiration date');
      return;
    }
    if (!selectedShelf) {
      alert('Please select a shelf');
      return;
    }
    try {
      await insertTestItem(selectedShelf, barCode, productName, date.toISOString().split('T')[0]);
      console.log('✓ Product saved successfully! - Name:', productName, 'Barcode:', barCode, 'Expires:', date.toISOString().split('T')[0], 'Shelf ID:', selectedShelf);
      alert('Product saved successfully!');
      setProductName('');
      setDate(new Date());
      setDateSelected(false);
    } catch (error) {
      console.log('Error saving product:', error);
      alert('Error saving product');
    }
  }
    return(
      <View style={styles.wrapper}>
        <Text style={styles.title}>Information about your product</Text>
        <View style={styles.container}>
             <Text style={styles.infoText}>Here you can see some basic information about the scanned product. The name of the product is automatically filled if a similar product has been saved earlier. </Text>
              <TextInput style={styles.lilTitles} value={'Barcode: '+barCode} placeholder='Please enter barcode manually' editable={false}/>
             <TextInput style={styles.lilTitles} placeholder='Product name' value={productName} onChangeText={setProductName}/>
             <Text style={styles.lilTitles}>Select Shelf:</Text>
             <ScrollView style={styles.shelfSelector}>
               {shelves && shelves.map((shelf) => (
                 <TouchableOpacity
                   key={shelf.id}
                   style={[styles.shelfOption, selectedShelf === shelf.id && styles.shelfOptionSelected]}
                   onPress={() => setSelectedShelf(shelf.id)}
                 >
                   <Text style={[styles.shelfOptionText, selectedShelf === shelf.id && styles.shelfOptionTextSelected]}>
                     {shelf.name}
                   </Text>
                 </TouchableOpacity>
               ))}
             </ScrollView>
             <TouchableOpacity  onPress={function() {setDateSelected(true)}} ><Text style={styles.lilTitles} >{dateSelected ? date.toDateString() : 'Select Expire Date'}</Text></TouchableOpacity>
        <View style={styles.formBack}>
          </View>
           
           
          <Button style={styles.button} title='Save Product' onPress={handleProductSave}></Button>
         {dateSelected && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate);
                setDateSelected(true);
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
    
    

   height:400,
   width:400,
    backgroundColor: 'rgba(16, 103, 217, 0.31)',
    borderRadius:16
  },
  formBack: {
    flex: 1,
   alignItems:'center',
   justifyContent:'flex-end',
     backgroundColor: 'rgba(255, 255, 255, 0)',
   height:350,
   width:350,

   
  },
  button:{
    paddingTop:100,
    color:'brown',
    borderRadius:16,
  },
  title:{
fontSize:20,
  },
  lilTitles:{
    fontSize: 16,
    margin:0,
    textAlign: '',
  },
wrapper:{
alignItems:'center',
},
shelfSelector: {
  width: '100%',
  height: 100,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 5,
},
shelfOption: {
  padding: 10,
  marginBottom: 5,
  borderRadius: 6,
  backgroundColor: '#f0f0f0',
  borderWidth: 1,
  borderColor: '#ddd',
},
shelfOptionSelected: {
  backgroundColor: '#1067d9',
  borderColor: '#1067d9',
},
shelfOptionText: {
  fontSize: 14,
  color: '#333',
},
shelfOptionTextSelected: {
  color: 'white',
  fontWeight: 'bold',
},
picker: {
  width: '100%',
  height: 50,
  marginBottom: 10,
},
infoText:{
  textAlign:'center',
  marginBottom:50,
}
});

export default Form