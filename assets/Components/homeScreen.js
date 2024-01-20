import { StatusBar, Button, StyleSheet, View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapScreen } from "./Bottom tabs/mapScreen";
import { SettingsScreen } from "./Bottom tabs/settingsScreen";

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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
});
  