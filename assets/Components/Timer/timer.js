import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, Text } from "react-native-paper";
export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: props.time,
    };
  }

  render() {
    console.log(this.state.time)
    let color = this.state.time > 60 ? "black" : "red"
    return (
      <View>
        {this.state.time >= 0 && this.state.time <= 300 ? <Text variant="displayLarge" style={{color: color}}>{this.state.time}s</Text> : <Text variant="displayLarge" style={{color: color}}>{Math.floor(this.state.time / 60)}min</Text>}
        {this.state.time <= 120 ? <Text variant="displayLarge" style={{color: color}}>RUN</Text> : <Text variant="headlineMedium">You 'still have' time... Chill....</Text>}
      </View>
    );
  }

  componentDidMount() {
    this.startTimer();
  }

  startTimer = () => {
    this.interval = setInterval(() => {
      this.setState((state) => ({
        time: state.time - 1,
      }));
    }, 1000);
  };

  //If the timer stops
  // stopTimer = () => {
  //     clearInterval(this.interval);
  //   };
}
