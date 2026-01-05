import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
function AppBar(){
    return(
        <View style={styles.palkki}>
         <Text style={styles.text}>Foodie</Text>
        </View>
    );

}
const styles = StyleSheet.create({
palkki:{
    backgroundColor:'#326cbe2c',
    height:100,
    width: '100%',
    paddingTop:50,
    justifyContent:'center',
    alignItems:'center'

},
text:{
    color:'black',
    fontWeight:'bold',
    fontSize:25

}
});

export default AppBar