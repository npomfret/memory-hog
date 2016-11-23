'use strict';

import React from "react";
import {PropTypes, View, Text, Animated, StyleSheet, TouchableHighlight, Dimensions} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default class Chart extends React.Component {

  constructor(props) {
    super(props);
    const data = this.props.data[0];
    const chartData = this.toChartData(data);

    const initial = {};
    for(let name in chartData) {
      initial[name] = new Animated.Value(chartData[name]);
    }

    this.state = {
      currentIndex: 0,
      chatData: initial
    }
  }

  toChartData(rawData) {
    const deviceWidth = Dimensions.get('window').width;
    const maxWidth = deviceWidth * 0.8;
    const indicators = Object.keys(rawData);
    const widths = {};
    let max = Number.MIN_VALUE;

    indicators.forEach(item => {
      const itemWidth = rawData[item];
      if (itemWidth > max) {
        max = itemWidth;
      }
    });

    indicators.forEach(item => {
      const itemWidth = rawData[item] / max;
      widths[item] = maxWidth * itemWidth;
    });

    return widths
  }

  componentDidUpdate(prevProps, prevState) {

  }

  onPressLeft() {
    const {currentIndex} = this.state;
    if (currentIndex < this.props.data.length - 1)
      this.handleAnimation(currentIndex + 1)
  }

  onPressRight() {
    const {currentIndex} = this.state;
    if (currentIndex > 0)
      this.handleAnimation(currentIndex - 1)
  }

  handleAnimation(newIndex) {
    const newData = this.toChartData(this.props.data[newIndex]);

    this.update(newData);

    this.setState({currentIndex: newIndex})
  }

  update(newData) {
    const indicators = Object.keys(newData);

    Animated.parallel(indicators.map(item => {
      return Animated.timing(this.state.chatData[item], {toValue: newData[item]})
    })).start();
  }

  render() {
    const {currentIndex} = this.state;
    const data = this.props.data[currentIndex];

    const canPrev = currentIndex < this.props.data.length - 1 ? 1 : 0;
    const canNext = currentIndex > 0 ? 1 : 0;

    const colours = ['#F55443', '#FCBD24', '#59838B', '#4D98E4', '#418E50', '#7B7FEC', '#3ABAA4'];

    const arr = [];
    let index = 0;
    for (let name in data) {
      const color = colours[index % colours.length];

      index++;
      const value = this.state.chatData[name];
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

        <View style={styles.controller}>
          <TouchableHighlight onPress={this.onPressLeft.bind(this)} underlayColor='transparent' style={[styles.button, {opacity: canPrev}]}>
            <Icon name='ios-arrow-back' size={28} color='#6B7C96' style={styles.chevronLeft}/>
          </TouchableHighlight>
          <Text style={styles.date}>kjkj</Text>
          <TouchableHighlight onPress={this.onPressRight.bind(this)} underlayColor='transparent' style={[styles.button, {opacity: canNext}]}>
            <Icon name='ios-arrow-forward' size={28} color='#6B7C96' style={styles.chevronRight}/>
          </TouchableHighlight>
        </View>
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

