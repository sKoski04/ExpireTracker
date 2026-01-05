import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';

import { initDatabase, insertTestShelf, insertTestItem, fetchItems,resetDatabase } from './dbInit';
import NavBar from './NavBar';
import Scanner from './Scanner';
import AppBar from './AppBar';
import Form from './Form';

export default function App() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState('HOME');
  const [barcode,setBarcode]=useState(null);
  

  useEffect(() => {
    (async function() {
    initDatabase();
      
    })();
  }, []);
if(state==='HOME'){
  console.log("home screen")


  return (
    <View style={styles.container}>
      <AppBar></AppBar>
      <View style={styles.content}>
        <Text style={styles.title}>Home Screen</Text>
      </View>
     <NavBar onChangeScreen={setState} />
    </View>
  );
}
if(state==='ADD'){
  console.log("ADD screen")


  return (
    <View style={styles.container}>
      <AppBar></AppBar>
    <View style={styles.content}>
     <Text style={styles.text}>Scan your item</Text>
   <Scanner onScan={function(code){
    console.log('code:'+code);
    setBarcode(code);
    console.log(code)
    console.log('useStateCode:'+barcode)
    setState('FORM')
   }} style={null}></Scanner>
   <Text style={styles.text2}>Aim The Camera to a barcode</Text>  
   <NavBar onChangeScreen={setState} />
   </View> 
   </View>
  );
}
if(state==='FORM'){
console.log('Form')

  return(
  <View style={styles.container}>
      <View style={styles.content}>
        <Form></Form>
      </View>
     <NavBar onChangeScreen={setState} />
    </View>
);
}
if(state==='HELP'){
  return(
      <View style={styles.container}>
          <AppBar></AppBar>
      <View style={styles.content}>
        <Text style={styles.title}>HELP</Text>
      </View>
     <NavBar onChangeScreen={setState} />
    </View>

  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
    text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
      text2: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});







