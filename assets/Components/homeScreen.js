import { StatusBar, Button, StyleSheet, View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapView from 'react-native-maps';

const Tab = createBottomTabNavigator();

export function HomeScreen({navigation}){
    return (
        <>
        <Tab.Navigator>
            <Tab.Screen name="Map" component={MapScreen} options={{ headerShown: false }}/>
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
        <StatusBar hidden= {true}/>
        </>
    );
}

function MapScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <MapView width="100%" height="100%"/>
        </SafeAreaView>
    )
    
}

function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
        <Text>Some preferences</Text>
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
  