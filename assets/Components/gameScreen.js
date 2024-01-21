import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";
import { API_KEY } from "@env";
import { Overlay } from "@rneui/themed";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

export function GameScreen({ route, navigation }) {
  const {
    BusStopCode,
    BusService,
    ServiceIndex,
    DistFromUser,
    TimeBeforeArrival,
    BSLat,
    BSLon,
  } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [updatedBusArrival, setUpdatedBusArrival] = useState(TimeBeforeArrival);
  const [busIndex, setBusIndex] = useState(ServiceIndex);
  const coords = [];
  const [overlayVisible, changeOverlayVisibility] = useState(true);

  const toggleOverlay = () => {
    changeOverlayVisibility(!overlayVisible);
  };

  useEffect(() => {
    const intervalID = setInterval(async () => {
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      coords.push({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      try {
        const response = await axios.get(
          `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${BusStopCode}`,
          {
            headers: {
              AccountKey: API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const busServices = response.data.Services;
        let selectedService;
        for (let i = 0; i < busServices.length; i++) {
          if (busServices[i].ServiceNo == BusService) {
            selectedService = busServices[i];
            break;
          }
        }

        let tempArrival;
        let flag = false;
        while (true) {
          switch (busIndex) {
            case 1:
              tempArrival = Math.floor(
                (new Date(selectedService.NextBus.EstimatedArrival) -
                  new Date()) /
                  (1000 * 60)
              );
              if (tempArrival > updatedBusArrival && busIndex != 0) {
                setBusIndex(busIndex - 1);
              } else {
                setUpdatedBusArrival(tempArrival);
                flag = true;
              }
            case 2:
              tempArrival = Math.floor(
                (new Date(selectedService.NextBus2.EstimatedArrival) -
                  new Date()) /
                  (1000 * 60)
              );
              if (tempArrival > updatedBusArrival && busIndex != 0) {
                setBusIndex(busIndex - 1);
              } else {
                setUpdatedBusArrival(tempArrival);
                flag = true;
              }
            case 3:
              tempArrival = Math.floor(
                (new Date(selectedService.NextBus3.EstimatedArrival) -
                  new Date()) /
                  (1000 * 60)
              );
              if (tempArrival > updatedBusArrival && busIndex != 0) {
                setBusIndex(busIndex - 1);
              } else {
                setUpdatedBusArrival(tempArrival);
                flag = true;
              }
            default:
              break;
          }
          if (flag) {
            break;
          }
        }
      } catch (err) {
        console.log(err);
      }

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
        <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay}>
          <Text>Bus Stop to go to: {BusStopCode}</Text>
          <Text>Distance from User: {DistFromUser}m</Text>
          <Text>Time Remaining before Bus Arrival: {updatedBusArrival}</Text>
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
        </Overlay>
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
