import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native';

import { initDatabase, insertTestShelf, insertTestItem, fetchItems, fetchShelves, resetDatabase } from './dbInit';
import  NavBar from './Components/NavBar'
import Scanner from './Components/Scanner';
import AppBar from './Components/AppBar';
import Form from './Components/Form';
import ShelfLevel from './Components/ShelfLevel';

export default function App() {
  const [items, setItems] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [state, setState] = useState('HOME');
  const [barcode,setBarcode]=useState(null);
  const [expireDate,setExpireDate]=useState(null);
  const [showShelfModal, setShowShelfModal] = useState(false);
  const [shelfNameInput, setShelfNameInput] = useState('');
  const [selectedShelf, setSelectedShelf] = useState(null);
  

  useEffect(() => {
    (async function() {
      await initDatabase();
      await loadShelves();
    })();
  }, []);

  async function loadShelves() {
    try {
      const fetchedShelves = await fetchShelves();
      setShelves(fetchedShelves);
    } catch (error) {
      console.log('Error loading shelves:', error);
    }
  }

  async function handleCreateShelf() {
    if (!shelfNameInput.trim()) {
      Alert.alert('Error', 'Shelf name cannot be empty');
      return;
    }
    try {
      await insertTestShelf(shelfNameInput);
      console.log('✓ Shelf created:', shelfNameInput);
      await loadShelves();
      Alert.alert('Success', `Shelf "${shelfNameInput}" created!`);
      setShelfNameInput('');
      setShowShelfModal(false);
    } catch (error) {
      console.log('Error creating shelf:', error);
      Alert.alert('Error', 'Failed to create shelf');
    }
  }
if(state==='HOME'){
  console.log("home screen")

  return (
    <View style={styles.container}>
      <AppBar></AppBar>
      <View style={styles.content}>
        <Text style={styles.title}>My Shelves</Text>
        <Button title="+ Add Shelf" onPress={() => setShowShelfModal(true)} />
        <FlatList
          style={styles.shelfList}
          data={shelves}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.shelfItem} onPress={() => {
              setSelectedShelf(item);
              setState('SHELF');
            }}>
              <Text style={styles.shelfName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No shelves yet. Create one to get started!</Text>
          }
        />
      </View>

      <Modal visible={showShelfModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Shelf</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter shelf name"
              value={shelfNameInput}
              onChangeText={setShelfNameInput}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={() => {
                setShowShelfModal(false);
                setShelfNameInput('');
              }} color="#999" />
              <Button title="Create" onPress={handleCreateShelf} color="#1067d9" />
            </View>
          </View>
        </View>
      </Modal>

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
    <AppBar></AppBar>
      <View style={styles.content}>
        <Form barCode={barcode} expireDate={expireDate} shelves={shelves}></Form>
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
if(state==='SHELF'){
  return(
    <View style={styles.container}>
      <AppBar></AppBar>
      <TouchableOpacity onPress={() => setState('HOME')} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <ShelfLevel shelf={selectedShelf} />
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  shelfList: {
    width: '100%',
    marginTop: 10,
  },
  shelfItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1067d9',
  },
  shelfName: {
    fontSize: 18,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1067d9',
    fontWeight: '600',
  },
});







