/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useRef } from 'react';
import axios from 'react-native-axios';
import { data } from './inputs.json';
import { RNCamera } from 'react-native-camera';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>Waiting</Text>
  </View>
);

const App = () => {
  const camera = useRef(null);
  const [res, setRes] = useState(null);

  const takePicture = async () => {
    try {
      if (camera) {
        const options = {
          quality: 0.5,
          base64: true,
        };
        const pictureData = await camera.current.takePictureAsync(options);
        const response = await axios.post('http://172.22.41.143:8000', {
          data: pictureData,
        });
        setRes(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <RNCamera
              ref={camera}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              autoFocus={RNCamera.Constants.AutoFocus.on}
              flashMode={RNCamera.Constants.FlashMode.off}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              onGoogleVisionBarcodesDetected={({ barcodes }) => {
                console.log(barcodes);
              }}>
              {({ camera, status }) => {
                if (status !== 'READY') return <PendingView />;
                return (
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => takePicture(camera)}>
                      <Text style={{ fontSize: 14 }}>Take Picture</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </RNCamera>
          </View>
          <View>
            <Text style={styles.title}>{res}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 50,
    fontSize: 28,
    color: '#010203',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 280,
    // width: 280,
  },
  button: {
    backgroundColor: '#ffffff66',
    padding: 10,
    borderRadius: 50,
  },
});

export default App;
