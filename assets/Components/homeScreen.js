import { StatusBar, Button, StyleSheet, View, Text, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapScreen } from "./Tabs/mapScreen";
import { SettingsScreen } from "./Tabs/settingsScreen";
import { CustomHomeHeader } from "./Headers/header_home";

const Tab = createBottomTabNavigator();

export function HomeScreen({navigation}){
    return (
        <>
        <Tab.Navigator screenOptions={{headerTransparent: true}}>
            <Tab.Screen name="Map" component={MapScreen} options={{tabBarIcon: () => <Image height={20} width={20} source={{uri:"https://cdn-icons-png.flaticon.com/128/447/447031.png"}}/>}}/>
            <Tab.Screen name="Settings" component={SettingsScreen} options={{tabBarIcon: () => <Image height={20} width={20} source={{uri:"https://cdn-icons-png.flaticon.com/128/484/484613.png"}}/>}}/>
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
