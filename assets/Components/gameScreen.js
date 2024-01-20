import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as Location from 'expo-location'

export function GameScreen({route, navigation}){
    const { BusStopCode, DistFromUser, TimeBeforeArrival } = route.params;
    const [userLocation, setUserLocation] = useState(null)

    useEffect(() => {
        setInterval(async () => {
            let location = await Location.getCurrentPositionAsync({})
            setUserLocation(location);
        }, 20000)
    }, [])


    return (
        <SafeAreaView>
            <Text>Bus Stop to go to: {BusStopCode}</Text>
            <Text>Distance from User: {DistFromUser}m</Text>
            <Text>Time Remaining before Bus Arrival: {TimeBeforeArrival}</Text>
            {userLocation !== null ?
                <View>
                    <Text>User Lat: {userLocation.coords.latitude}</Text>
                    <Text>User Lon: {userLocation.coords.longitude}</Text>
                </View>
            : <></>}
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
