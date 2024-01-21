import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class Timer extends React.Component {

    state = {
        time: 100,
      };
    
    render() {
    return (
        <View>
            <Text>{this.state.time}</Text>
        </View>
    );
    }

    componentDidMount() {
        this.startTimer();
    }

    startTimer = () => {
        this.interval = setInterval(() => {
        this.setState(state => ({
        time: state.time - 1,
        }));
    }, 1000);
    };
    
    //If the timer stops
    // stopTimer = () => {
    //     clearInterval(this.interval);
    //   };
  }