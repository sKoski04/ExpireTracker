import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function NavBar(props) {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem} onPress={function() { props.onChangeScreen('HOME'); }}>
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={function() { props.onChangeScreen('ADD'); }}>
        <Text style={styles.navText}>Add</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={function() { props.onChangeScreen('HELP'); }}>
        <Text style={styles.navText}>Help</Text>
      </TouchableOpacity>
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
    backgroundColor: '#326cbe2c',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0,
    borderColor: '#000000',
    borderRadius:10
    
  },
  navItem: { padding: 10 },
  navText: { fontSize: 16, color: '#333' },
});

