import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import MapView from 'react-native-maps';

export function MapScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <MapView width="100%" height="100%"/>
        </SafeAreaView>
    )  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
});