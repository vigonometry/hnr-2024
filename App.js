import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Location from 'expo-location'
import { getDistance } from 'geolib';
import { API_KEY } from "@env"

export default function App() {
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
        busArrivalForStops.push(busArrivalForStops)
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
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      {errorMsg != null ? <Text>{errorMsg}</Text> : <></>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});