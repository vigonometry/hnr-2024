import { StatusBar } from "react-native";
import { Button, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, List, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, {
  BottomSheetScrollView,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

export function MapScreen() {
  const navigation = useNavigation();

  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
    },
    busStopContainer: {
      marginBottom: 10,
    },
    busStopBuses: {
      display: "flex",
      flexDirection: "col",
      gap: 5,
    },
    busStopBus: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 5,
    },
    busStopArrivals: {
      marginLeft: "auto",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    busArrivalTiming: {
      padding: 10,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 4,
    },
    bottomSheetStops: {
      display: "flex",
      gap: 10,
      marginLeft: 15,
      marginRight: 15,
    },
    bold: {
      fontWeight: "600",
    },
    divider: {
      borderBottomColor: "black",
      borderBottomWidth: 1,
    },
  });
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["25%", "60%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("tChanges", index);
  }, []);
  const triggerDist = 500;

  // States
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearbyStops, setNearbyStops] = useState(null);
  const [nearbyStopsArrival, setNearbyStopsArrival] = useState(null);
  async function findNearestBusStops(currentLocation) {
    const data = await AsyncStorage.getItem("BusStops");
    const stops = await JSON.parse(data);

    let nearbyStops = [];
    console.log("T1")
    for (let i = 0; i < stops.length; i++) {
      console.log(i)
      const dist = getDistance(
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        }, // User's Location
        { latitude: stops[i].Latitude, longitude: stops[i].Longitude } // Bus Stop's Location
      );
      if (dist <= triggerDist) {
        let updatedStop = stops[i];
        updatedStop["distFromUser"] = dist;
        nearbyStops.push(updatedStop);
      }
    }
    console.log("T2")

    // Sort According to Distance from User
    nearbyStops.sort((a, b) => a.distFromUser - b.distFromUser);
    return nearbyStops;
  }

  async function getBusArrivalForNearestStops(busStops) {
    let busArrivalForStops = [];

    for (let stopIndex = 0; stopIndex < busStops.length; stopIndex++) {
      const busStopCode = busStops[stopIndex]["BusStopCode"];
      try {
        const response = await axios.get(
          `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`,
          {
            headers: {
              AccountKey: API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const busStopWithArrival = {
          BusStopCode: busStopCode,
          Services: response.data.Services,
        };
        busArrivalForStops.push(busStopWithArrival);
      } catch (err) {
        console.log(err);
      }
    }
    return busArrivalForStops;
  }

  useEffect(() => {
    (async () => {
      const tempCheck = await AsyncStorage.getItem("BusStops");

      if (tempCheck === "[]" || tempCheck === null) {
        let stops = [];
        for (let skip = 0; skip < 13; skip++) {
          try {
            // Get List of Bus Stops
            const response = await axios.get(
              `http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${
                skip * 500
              }`,
              {
                headers: {
                  AccountKey: API_KEY,
                  "Content-Type": "application/json",
                },
              }
            );

            stops = stops.concat(response.data.value);
          } catch (err) {
            console.log(err);
          }
        }

        await AsyncStorage.setItem("BusStops", JSON.stringify(stops));
      }

      // Ask for User's Location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get User Location
      console.log("Getting LK Location...")
      let lastLoc = await Location.getLastKnownPositionAsync();
      setUserLocation(lastLoc);
      console.log("LK Location Retrieved.")

      // Get List of Nearest Bus Stops
      console.log("Getting Nearest Stops")
      const nearestStops = await findNearestBusStops(lastLoc);
      setNearbyStops(nearestStops);

      // Get Bus Arrival Info for Nearest Bus Stops
      console.log("Getting Nearest Stops with Bus Arrivals")
      const stopCodeWBusArrival = await getBusArrivalForNearestStops(
        nearestStops
      );
      setNearbyStopsArrival(stopCodeWBusArrival);

      console.log(nearestStops)
      console.log(stopCodeWBusArrival)
    })();
  }, []);

  useEffect(() => {
    setInterval(async () => {
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    }, 10000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <MapView width="100%" height="100%" showsUserLocation>
        {nearbyStops !== null ?
          nearbyStops.map((stop) => (
            <Marker
              coordinate={{
                latitude: stop.Latitude,
                longitude: stop.Longitude,
              }}
              title={stop.Description}
              description={`${(
                stop.distFromUser / 1000
              ).toFixed(2)} km`}
              pinColor="red"
            />
          ))
        : <></>}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetScrollView>
          <View style={styles.bottomSheetStops}>
            {nearbyStops !== null && nearbyStopsArrival !== null ? (
              nearbyStops.map((stop) => (
                <List.Accordion
                  title={stop.Description}
                  description={`${stop.RoadName} | ${(
                    stop.distFromUser / 1000
                  ).toFixed(2)} km`}
                  key={stop.BusStopCode}
                >
                  <View style={styles.busStopBuses}>
                    {nearbyStopsArrival.map((busStop) =>
                      busStop.BusStopCode == stop.BusStopCode ? (
                        busStop.Services.map((stopBuses) => (
                          <View
                            key={stopBuses.ServiceNo}
                            style={styles.busStopBus}
                          >
                            <Text>{stopBuses.ServiceNo}</Text>
                            <View style={styles.busStopArrivals}>
                              {stopBuses.NextBus !== null ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate("game", {
                                      BusStopCode: busStop.BusStopCode,
                                      BusService: stopBuses.ServiceNo,
                                      ServiceIndex: 1,
                                      BSLat: stop.Latitude,
                                      BSLon: stop.Longitude,
                                      DistFromUser: stop.distFromUser,
                                      TimeBeforeArrival: Math.floor(
                                        (new Date(
                                          stopBuses.NextBus.EstimatedArrival
                                        ) -
                                          new Date()) /
                                          (1000 * 60)
                                      ),
                                    })
                                  }
                                >
                                  <Text style={styles.busArrivalTiming}>
                                    {Math.floor(
                                      (new Date(
                                        stopBuses.NextBus.EstimatedArrival
                                      ) -
                                        new Date()) /
                                        (1000 * 60)
                                    ) < 0
                                      ? "Left!"
                                      : Math.floor(
                                          (new Date(
                                            stopBuses.NextBus.EstimatedArrival
                                          ) -
                                            new Date()) /
                                            (1000 * 60)
                                        )}
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <></>
                              )}
                              {stopBuses.NextBus2 !== null ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate("game", {
                                      BusStopCode: busStop.BusStopCode,
                                      BusService: stopBuses.ServiceNo,
                                      ServiceIndex: 2,
                                      BSLat: stop.Latitude,
                                      BSLon: stop.Longitude,
                                      DistFromUser: stop.distFromUser,
                                      TimeBeforeArrival: Math.floor(
                                        (new Date(
                                          stopBuses.NextBus2.EstimatedArrival
                                        ) -
                                          new Date()) /
                                          (1000 * 60)
                                      ),
                                    })
                                  }
                                >
                                  <Text style={styles.busArrivalTiming}>
                                    {Math.floor(
                                      (new Date(
                                        stopBuses.NextBus2.EstimatedArrival
                                      ) -
                                        new Date()) /
                                        (1000 * 60)
                                    ) < 0
                                      ? "Left!"
                                      : Math.floor(
                                          (new Date(
                                            stopBuses.NextBus2.EstimatedArrival
                                          ) -
                                            new Date()) /
                                            (1000 * 60)
                                        )}
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <></>
                              )}
                              {stopBuses.NextBus3 !== null ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate("game", {
                                      BusStopCode: busStop.BusStopCode,
                                      BusService: stopBuses.ServiceNo,
                                      ServiceIndex: 3,
                                      BSLat: stop.Latitude,
                                      BSLon: stop.Longitude,
                                      DistFromUser: stop.distFromUser,
                                      TimeBeforeArrival: Math.floor(
                                        (new Date(
                                          stopBuses.NextBus3.EstimatedArrival
                                        ) -
                                          new Date()) /
                                          (1000 * 60)
                                      ),
                                    })
                                  }
                                >
                                  <Text style={styles.busArrivalTiming}>
                                    {Math.floor(
                                      (new Date(
                                        stopBuses.NextBus3.EstimatedArrival
                                      ) -
                                        new Date()) /
                                        (1000 * 60)
                                    ) < 0
                                      ? "Left!"
                                      : Math.floor(
                                          (new Date(
                                            stopBuses.NextBus3.EstimatedArrival
                                          ) -
                                            new Date()) /
                                            (1000 * 60)
                                        )}
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <></>
                              )}
                            </View>
                          </View>
                        ))
                      ) : (
                        <></>
                      )
                    )}
                  </View>
                </List.Accordion>
              ))
            ) : (
              <ActivityIndicator animating={true} />
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}
