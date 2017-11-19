/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      soda: '',
    }

    this._sendImage = this._sendImage.bind(this);
  }
  _sendImage(image) {
    const panpan = "https://reservamoseto.herokuapp.com/image";
    return fetch(panpan, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: image
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({soda: responseJson});
        Alert.alert(`You found a ${responseJson}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => {
        const datData = data;
        RNFetchBlob.fs.readFile(datData.mediaUri, 'base64')
        .then((blober) => {
          let imageBlob = `data:image/jpg;base64,${blober}`;
          console.log(imageBlob);
        })
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
