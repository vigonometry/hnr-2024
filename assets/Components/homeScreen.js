import { StatusBar } from "react-native";
import { Button, StyleSheet, View } from "react-native"
import { ActivityIndicator, Text, List } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useMemo , useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'
import { getDistance } from 'geolib';
import { API_KEY } from "@env"

export function HomeScreen({navigation}){
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['25%', '75%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const triggerDist = 500

  // States
  const [userLocation, setUserLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [nearbyStops, setNearbyStops] = useState(null)
  const [nearbyStopsArrival, setNearbyStopsArrival] = useState(null)

  async function findNearestBusStops(currentLocation) {
    const data = await AsyncStorage.getItem("BusStops")
    const stops = await JSON.parse(data)

    let nearbyStops = []
    for (let i = 0; i < stops.length; i++) {
      const dist = getDistance(
        {latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude}, // User's Location
        {latitude: stops[i].Latitude, longitude: stops[i].Longitude} // Bus Stop's Location
      )
      if (dist <= triggerDist) {
        let updatedStop = stops[i]
        updatedStop["distFromUser"] = dist
        nearbyStops.push(updatedStop)
      }
    }

    // Sort According to Distance from User
    nearbyStops.sort((a, b) => a.distFromUser - b.distFromUser)

    return nearbyStops
  }

  async function getBusArrivalForNearestStops(busStops) {
    let busArrivalForStops = []

    for (let stopIndex = 0; stopIndex < busStops.length; stopIndex++) {
      const busStopCode = busStops[stopIndex]["BusStopCode"]

      try {
        const response = await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`, {
          headers: {
            "AccountKey": API_KEY,
            "Content-Type": "application/json"
          }
        })

        const busStopWithArrival = {
          "BusStopCode": busStopCode,
          "Services": response.data.Services
        }
        busArrivalForStops.push(busStopWithArrival)
      } catch (err) {
        console.log(err)
      }
    }

    return busArrivalForStops
  }

  useEffect(() => {
    (async () => {
      if (AsyncStorage.getItem("BusStops") === null) {
        let stops = []
        for (let skip = 0; skip < 13; skip++) {
          try {
            // Get List of Bus Stops
            const response = await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${skip*500}`, {
              headers: {
                "AccountKey": API_KEY,
                "Content-Type": "application/json"
              }
            })
            
            stops = stops.concat(response.data.value)
          } catch (err) {
            console.log(err)
          }
        }

        await AsyncStorage.setItem("BusStops", JSON.stringify(stops))
      }
      
      // Get User's Location
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return;
      }

      let location = await Location.getCurrentPositionAsync({})
      setUserLocation(location)

      // Get List of Nearest Bus Stops
      const nearestStops = await findNearestBusStops(location)
      setNearbyStops(nearestStops)

      // Get Bus Arrival Info for Nearest Bus Stops
      const stopCodeWBusArrival = await getBusArrivalForNearestStops(nearestStops)
      setNearbyStopsArrival(stopCodeWBusArrival)
    })()
  }, [])
  
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar 
        hidden= {true}/>
    
        <MapView width="100%" height="100%"/>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.bottomSheetStops}>
            {nearbyStops !== null && nearbyStopsArrival !== null ? 
            nearbyStops.map((stop) => (
              <List.Accordion
                title={stop.Description}
                description={`${stop.RoadName} | ${(stop.distFromUser/1000).toFixed(2)} km`}
                key={stop.BusStopCode}
              >
                {nearbyStopsArrival.map(busStop => (
                  busStop.BusStopCode == stop.BusStopCode ?
                    busStop.Services.map(stopBuses => (
                      <View key={stopBuses.ServiceNo} style={styles.busStopBuses}>
                        <Text>{stopBuses.ServiceNo}</Text>
                        <View style={styles.busStopArrivals}>
                          {stopBuses.NextBus !== null ? 
                            <Text>{Math.floor((new Date(stopBuses.NextBus.EstimatedArrival) - new Date()) / (1000 * 60))}</Text>
                          : <></>}
                          {stopBuses.NextBus2 !== null ? 
                            <Text>{Math.floor((new Date(stopBuses.NextBus2.EstimatedArrival) - new Date()) / (1000 * 60))}</Text>
                            : <></>}
                          {stopBuses.NextBus3 !== null ? 
                            <Text>{Math.floor((new Date(stopBuses.NextBus3.EstimatedArrival) - new Date()) / (1000 * 60))}</Text>
                            : <></>}
                        </View>
                      </View>
                    ))
                  : <></>
                ))}
                {/* {nearbyStopsArrival
                  .filter(stopDetail => stopDetail.BusStopCode === stop.BusStopCode)
                  .map(stopDetail => (
                    stopDetail.Services.map(stopBuses => (
                      <Text>{stopBuses.ServiceNo}</Text>
                    ))
                  ))
                } */}
              </List.Accordion>
            )) : <ActivityIndicator animating={true} />}
          </View>
        </BottomSheet>
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
    busStopContainer: {
      marginBottom: 10
    },
    busStopBuses: {
      display: "flex",
      flexDirection: "row",
      paddingLeft: 10,
      paddingRight: 10,
    },
    busStopArrivals: {
      marginLeft: "auto",
      display: "flex",
      flexDirection: "row",
      gap: 5
    },
    bottomSheetStops: {
      display: "flex",
      gap: "10",
      marginLeft: 15,
      marginRight: 15
    },
    bold: {
      fontWeight: "600"
    },
    divider: {
      borderBottomColor: 'black',
      borderBottomWidth: 1
    }
});  