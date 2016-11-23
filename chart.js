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

    console.log("update", newData, newChartData);

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
          <Text style={styles.label}>{name} ({data[name]})</Text>
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
    flexDirection: 'column',
    marginTop: 6
  },
  // Item
  item: {
    flexDirection: 'column',
    marginBottom: 5,
    paddingHorizontal: 10
  },
  label: {
    color: '#CBCBCB',
    fontSize: 12,
    top: 2
  },
  data: {
    flexDirection: 'row'
  },
  dataNumber: {
    color: '#CBCBCB',
    fontSize: 11
  },
  // Bar
  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 8,
    marginRight: 5
  },
  // controller
  controller: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  button: {
    flex: 1,
    position: 'relative',
    top: -1
  },
  chevronLeft: {
    alignSelf: 'flex-end',
    height: 28,
    marginRight: 10,
    width: 28
  },
  chevronRight: {
    alignSelf: 'flex-start',
    height: 28,
    marginLeft: 10,
    width: 28
  },
  date: {
    color: '#6B7C96',
    flex: 1,
    fontSize: 22,
    fontWeight: '300',
    height: 28,
    textAlign: 'center'
  }

});

