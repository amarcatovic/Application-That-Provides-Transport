import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Alert, StyleSheet, Text, View, Dimensions, Image  } from 'react-native';
import getIP from '../../config'

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location';

export default function ProdajnaMjesta() {
    const [location, setLocation] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [latitude, setLat] = useState(null)
    const [longitude, setLng] = useState(null)
    const [time, setTime] = useState(true)
    const [stanice, setStanice] = useState([])
    const [gradovi, setGradovi] = useState([])
    const [gradID, setGradID] = useState([0])

  
    useEffect(() => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
        )
      } else {
        (async () => {
          let { status } = await Location.requestPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
          }
  
          if(location === null){
              let location = await Location.getCurrentPositionAsync({maximumAge: 100})
              ucitajStanice()
              ucitajGradove()
              setLocation(location)
          }
        })();
      }
    })

    const ucitajGradove = async () => {
        await fetch(`http://${getIP()}/publictransportcloud/api/ProdajnoMjesto/read.php`)
        .then(response => response.json())
        .then(data => {  
            setGradovi(data.data)
          }) 
      }

    const ucitajStanice = async () => {
        await fetch(`http://${getIP()}/publictransportcloud/api/ProdajnoMjesto/read.php`)
        .then(response => response.json())
        .then(data => { 
            if(data.message)
            {
                setStanice([])
            }
            else
            {
                setStanice(data.data)
            }
          }) 
      }
  
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location && time) {
      setLat(location.coords.latitude)
      setLng(location.coords.longitude)
      setTime(false)
    }
  
    return (
        <View style={styles.container}>
        <MapView style={styles.mapStyle}
            showsUserLocation 
            initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }}>
            {stanice.map(stanica => <Marker coordinate={{latitude: parseFloat(stanica.lat), longitude: parseFloat(stanica.lng)}} title={stanica.naziv} description={stanica.adresa}>
                <Image source={require('../../imgs/prmj.png')} style={{ width: 25, height: 25 }}/>
            </Marker>)}
        </MapView>
    </View>
    )
  }
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});