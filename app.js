'use strict';

import React, {Component} from "react";
import {AppRegistry, StyleSheet, Text, View, Button, NativeModules, AppState} from "react-native";
import Chart from "./chart";

const RNDeviceInfo = NativeModules.RNDeviceInfo;

const _junk = [];
for (let i = 0; i < 1024 * 1024; i++) {
  _junk.push('');
}

export default class MemoryHog extends Component {
  constructor() {
    super();

    this._addJunk = this._addJunk.bind(this);
    this._update = this._update.bind(this);
    this._handleMemoryWarning = this._handleMemoryWarning.bind(this);

    AppState.addEventListener('memoryWarning', this._handleMemoryWarning);

    this.state = {
      junk: [],
      memory: {}
    };
  }

  _handleMemoryWarning() {
    console.warn("Memory warning");
  }

  _addJunk() {
    this.setState({junk: this.state.junk.concat(_junk)});
    this._update();
  }

  componentDidMount() {
    this._update();

    setInterval(this._update, 1000);
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
        <Text>Junk: {this.state.junk.length}</Text>

        <Button
          onPress={this._addJunk}
          title="Add Junk"
          style={{backgroundColor: "red"}}
          color="#841584"
        />

        <Button
          onPress={() => this.setState({junk: []})}
          title="Clear Junk"
          style={{backgroundColor: "red"}}
          color="#841584"
        />

        <View style={{flex: 1}}>
          <Chart data={[
            {'pts': 10, 'ast': 20, 'reb': 30, 'stl': 40, 'blk': 50, 'tov': 60, 'min': 70},
            {'pts': 100, 'ast': 20, 'reb': 30, 'stl': 40, 'blk': 50, 'tov': 60, 'min': 70},
            {'pts': 1, 'ast': 20, 'reb': 30, 'stl': 40, 'blk': 50, 'tov': 60, 'min': 70},
          ]} />
        </View>

        {arr}

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
