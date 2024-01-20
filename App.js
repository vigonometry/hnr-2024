import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'
import { getDistance } from 'geolib';
import { API_KEY } from "@env"
import { RouteHandler } from './assets/Components/navigation';

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
    console.log(busStops)
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
      await getBusArrivalForNearestStops(nearestStops)
    })()
  })

  return (
    RouteHandler()
  );
}


