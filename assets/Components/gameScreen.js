import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";

export function GameScreen({ route, navigation }) {
  const { BusStopCode, DistFromUser, TimeBeforeArrival, BSLat, BSLon } =
    route.params;
  const [userLocation, setUserLocation] = useState(null);
  const coords = [];

  useEffect(() => {
    const intervalID = setInterval(async () => {
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      coords.push({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log(location);
    }, 3000);

    return () => clearInterval(intervalID);
  }, []);

  return (
    <SafeAreaView>
      <MapView width="100%" height="100%" showsUserLocation>
        {userLocation != null ? (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            pinColor="red"
          />
        ) : (
          <></>
        )}
        <Marker
          coordinate={{ latitude: BSLat, longitude: BSLon }}
          pinColor="green"
        />
        {userLocation != null ? <Polyline coordinates={coords} /> : <></>}
      </MapView>
      <View>
        <Text>Bus Stop to go to: {BusStopCode}</Text>
        <Text>Distance from User: {DistFromUser}m</Text>
        <Text>Time Remaining before Bus Arrival: {TimeBeforeArrival}</Text>
        {userLocation !== null ? (
          <View>
            <Text>User Lat: {userLocation.coords.latitude}</Text>
            <Text>User Lon: {userLocation.coords.longitude}</Text>
          </View>
        ) : (
          <></>
        )}
        <Text>Bus Stop Lat: {BSLat}</Text>
        <Text>Bus Stop Lon: {BSLon}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

