import { StatusBar } from "react-native";
import { Button, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from 'react-native-maps';

export function HomeScreen({navigation}){
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar 
            hidden= {true}/>
            <MapView width="100%" height="100%"/>
        
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
});
  