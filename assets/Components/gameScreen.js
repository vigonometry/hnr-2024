import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as Location from 'expo-location'

export function GameScreen({route, navigation}){
    const { BusStopCode, DistFromUser, TimeBeforeArrival, BSLat, BSLon } = route.params;
    const [userLocation, setUserLocation] = useState(null)

    useEffect(() => {
        const intervalID = setInterval(async () => {
            let location = await Location.getCurrentPositionAsync({})
            setUserLocation(location);
            console.log(location)
        }, 3000)

        return () => clearInterval(intervalID)
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
            <Text>Bus Stop Lat: {BSLat}</Text>
            <Text>Bus Stop Lon: {BSLon}</Text>
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
