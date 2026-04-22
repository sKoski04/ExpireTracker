import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

export default function NavBar(props) {
  return (
    <View style={styles.navBar}>
      <Pressable style={styles.navItem} onPress={function() { props.onChangeScreen('HOME'); }}>
       
        <Text style={styles.navText}>Home</Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={function() { props.onChangeScreen('ADD'); }}>
        <Text style={styles.navText}>Add</Text>
      </Pressable>

      <Pressable style={styles.navItem} onPress={function() { props.onChangeScreen('HELP'); }}>
        <Text style={styles.navText}>Help</Text>
      </Pressable>

      
    </View>
  );
}
const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#DCCCAC',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0,
    borderColor: '#000000',
    borderRadius:10
    
  },
  navItem: { padding: 10, backgroundColor:'#546B41', borderRadius:10, minWidth:80, alignItems:'center' },
  navText: { fontSize: 16, color: '#FFF8EC' },
});

