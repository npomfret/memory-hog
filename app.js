'use strict';

import React, {Component} from "react";
import {AppRegistry, StyleSheet, Text, View, Button, NativeModules, AppState} from "react-native";
import Chart from "./chart";

const RNDeviceInfo = NativeModules.RNDeviceInfo;

const _junk = [];
for (let i = 0; i < 1024 * 1024 * 10; i++) {
  _junk.push(Math.random());
}

export default class MemoryHog extends Component {
  constructor() {
    super();

    this._addJunk = this._addJunk.bind(this);
    this._update = this._update.bind(this);
    this._clearJunk = this._clearJunk.bind(this);
    this._handleMemoryWarning = this._handleMemoryWarning.bind(this);

    AppState.addEventListener('memoryWarning', this._handleMemoryWarning);

    this.state = {
      memory: {}
    };
    this._count = 0;
  }

  _handleMemoryWarning() {
    console.warn("Memory warning");
  }

  _clearJunk() {
    for(let name in this.state) {
      if(name.startsWith("junk_")) {
        const state = {};
        state[name] = null;
        this.setState(state);
      }
    }
  }

  _addJunk() {
    const junk = {};
    junk["junk_" + this._count++] = _junk.slice();

    this.setState(junk);

    this._update();
  }

  componentDidMount() {
    setInterval(this._update, 4 * 1000);
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

  render() {
    let count = 0;
    for(let name in this.state) {
      if(name.startsWith("junk_") && this.state[name]) {
        count++;
      }
    }

    return (
      <View style={styles.container}>

        <Button
          onPress={this._addJunk}
          title="Add Junk"
          style={{backgroundColor: "red"}}
          color="#841584"
        />

        <Button
          onPress={this._clearJunk}
          title="Clear Junk"
          style={{backgroundColor: "red"}}
          color="#841584"
        />

        <View style={{flex: 1}}>
          <Chart data={[this.state.memory]} />
        </View>

        <Text>Junk: {count}x{_junk.length}</Text>

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
