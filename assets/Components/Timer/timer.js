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
    return (
      <View>
        {this.state.time >= 0 ? <Text variant="displayLarge">{this.state.time}</Text> : <Icon source="emoticon-sad" width="50%"/>}
        {this.state.time <= 120 ? <Text variant="displayLarge" style={{color: "red"}}>RUN</Text> : <></>}
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
