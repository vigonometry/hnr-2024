import { StatusBar } from "react-native";
import { Button, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

export function HomeScreen({navigation}){
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar 
            hidden= {true}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'dodgeblue',
      alignItems: 'center',
      justifyContent: 'center',
    },
});
  