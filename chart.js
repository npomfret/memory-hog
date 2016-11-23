'use strict';

import React from "react";
import {PropTypes, View, Text, Animated, StyleSheet, TouchableHighlight, Dimensions} from "react-native";

export default class Chart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      chartData: {}
    };
  }

  componentWillMount() {
    const data = this.props.data[0];

    this.update(data);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data[0] !== prevProps.data[0]) {
      this.update(this.props.data[0]);
    }
  }

  update(newData) {
    const newChartData = this.toChartData(newData);

    const chartData = this.state.chartData;

    const toAnimate = [];
    for (let name in newChartData) {
      if (!chartData[name]) {
        chartData[name] = new Animated.Value(newChartData[name]);
      } else {
        toAnimate.push(name);
      }
    }

    this.setState({chartData: chartData}, () => {
      Animated.parallel(toAnimate.map(item => {
        return Animated.timing(this.state.chartData[item], {toValue: newChartData[item]})
      })).start();
    });
  }

  toChartData(rawData) {
    const deviceWidth = Dimensions.get('window').width;

    const maxWidth = deviceWidth * 0.8;
    let maxValue = Number.MIN_VALUE;

    for(let name in rawData) {
      const rawValue = rawData[name];
      const itemValue = Number.parseInt(rawValue);
      rawData[name] = itemValue;

      if (itemValue > maxValue) {
        maxValue = itemValue;
      }
    }
    const unit = maxWidth / maxValue;

    const widths = {};
    for(let name in rawData) {
      const itemValue = rawData[name];
      widths[name] = itemValue * unit;
    }

    return widths
  }

  static formatBytes(bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return !bytes && '0 Bytes' || (bytes / Math.pow(1024, i)).toFixed(2) + " " + ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i]
  }

  render() {
    const data = this.props.data[0];

    const colours = ['#F55443', '#FCBD24', '#59838B', '#4D98E4', '#418E50', '#7B7FEC', '#3ABAA4'];

    const arr = [];
    let index = 0;
    for (let name in this.state.chartData) {
      const color = colours[index % colours.length];

      index++;
      const value = this.state.chartData[name];

      arr.push(
        <View key={name} style={styles.item}>
          <Text style={styles.label}>{name} ({Chart.formatBytes(data[name])})</Text>
          <View style={styles.data}>
            <Animated.View style={[styles.bar, {backgroundColor: color, width: value}]}/>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        {arr}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6
  },
  item: {
    flexDirection: 'column',
    marginBottom: 5,
    paddingHorizontal: 10
  },
  label: {
    color: '#CBCBCB',
    fontSize: 12,
    marginTop: 6
  },
  data: {
    flexDirection: 'row'
  },
  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 8,
    marginRight: 5
  },
});

