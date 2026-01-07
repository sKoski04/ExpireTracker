import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
function Scanner({ onScan, style,props }) {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

 useEffect(() => {
    requestPermission();
  }, []);

 console.log('permission:'+ permission)

function handleScan(result) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
  if (scanned) return;
  setScanned(true);
  console.log(result.data);
    if (onScan) onScan(result.data);
  
}





 if (!permission) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#000" />
      <Text>Pyydetään lupaa...</Text>
    </View>
  );
}

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  if(scanned){
  return(
    <View>
      <Text>Scanned successfully</Text>
    </View>
  );
}
  return (
    <View style={styles.camWrapper}>
  <CameraView
    style={[styles.container, style]}
   
    onCameraReady={() => console.log('Camera ready')}
   onBarcodeScanned={handleScan}
   

  />
  </View>
);






}

const styles = StyleSheet.create({
  container: { width: 400, height: 160, borderRadius: 16, overflow: 'hidden', backgroundColor: '#e3d9d9ff' },
  frame: { position: 'absolute', top: 16, left: 16, right: 16, bottom: 16, borderWidth: 2, borderColor: '#fff', borderRadius: 12 },
  center: { width: 260, height: 260, borderRadius: 16, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  camWrapper:{justifyContent:'center',alignItems:'center', backgroundColor:'none'}
});

export default Scanner;
