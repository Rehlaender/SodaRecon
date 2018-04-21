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
  View,
  Alert,
  Image,
  TouchableHighlight,
  Animated,
  TextInput
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
      loading: false,
      ip: ''
    }

    this._sendImage = this._sendImage.bind(this);
    this._toggleByLoading = this._toggleByLoading.bind(this);
  }
  _sendImage(image) {
    // const panpan = "https://cansrecognition.herokuapp.com/cans";
    // const pabellonIp = "http://192.168.43.180:5000/recognition";
    // const panpan = "http://192.168.43.151:5000/cans";
    const recognitionApi = "https://test-flask-201421.appspot.com/recognition";
    return fetch(recognitionApi, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        img: image
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({soda: responseJson});
        this.setState({loading: !this.state.loading});
        console.log(responseJson, '========!');
        if(this.state.soda.length > 0) {
            Alert.alert(`person:${this.state.soda[0].name}`, `prob:${this.state.soda[0].prob}, \ncords{x:${this.state.soda[0].cords.x},y:${this.state.soda[0].cords.y},w:${this.state.soda[0].cords.w}, h:${this.state.soda[0].cords.h}}`);
        }
         
        else {
            Alert.alert(`Couldn't find a face`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _toggleByLoading() {
    if(!this.state.loading) {
      return (
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[ take picture! ]</Text>
      );
    } else {
      return (
          <Text style={styles.capture}>*loading*</Text>
      );
    }
  }

  takePicture() {
    const options = {};
    this.setState({loading: !this.state.loading});
    this.camera.capture({metadata: options})
      .then((data) => {
        const datData = data;
        RNFetchBlob.fs.readFile(datData.mediaUri, 'base64')
        .then((blober) => {
          let imageBlob = `${blober}`;
          this._sendImage(imageBlob);
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

          { this._toggleByLoading() }


        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  ipLabel: {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  ipInput: {
    width: '900%',
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',

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
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#ccc',
  }
});
