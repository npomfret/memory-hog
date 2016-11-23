'use strict';

import React, {Component} from "react";
import {AppRegistry, StyleSheet, Text, View, Button, NativeModules} from "react-native";

const RNDeviceInfo = NativeModules.RNDeviceInfo;

const _junk = [];
for (let i = 0; i < 1024 * 1024; i++) {
  _junk.push('');
}

export default class MemoryHog extends Component {
  constructor() {
    super();

    this.addJunk = this.addJunk.bind(this);
    this.state = {
      junk: []
    };

  }

  addJunk() {
    this.setState({junk: this.state.junk.concat(_junk)});
    this._update();
  }

  componentWillMount() {
    this.setState({memory: 0});
  }

  componentDidMount() {
    this._update();
  }

  _update() {
    RNDeviceInfo.memory('')
      .then((memory) => {
        this.setState({memory: memory});
      })
      .catch((err) => {
        console.warn("problem", err);
      })
  }

  static formatBytes(bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return !bytes && '0 Bytes' || (bytes / Math.pow(1024, i)).toFixed(2) + " " + ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i]
  }

  render() {
    const arr = [];
    for (let key in this.state.memory) {
      arr.push(<Text key={arr.length} style={styles.welcome}>{key}: {MemoryHog.formatBytes(this.state.memory[key])}</Text>);
    }

    return (
      <View style={styles.container}>
        {arr}

        <Button
          onPress={this.addJunk}
          title="Add Junk"
          style={{backgroundColor: "red"}}
          color="#841584"
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 8
  },
  welcome: {
    fontSize: 14,
    marginBottom: 4
  },
});

AppRegistry.registerComponent('MemoryHog', () => MemoryHog);
