import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Alert, StyleSheet, Text, View, Dimensions, Picker, Image } from 'react-native';
import getIP from '../../config'

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location';

export default function Stanice({route, navigation}) {
    const [location, setLocation] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [latitude, setLat] = useState(null)
    const [longitude, setLng] = useState(null)
    const [time, setTime] = useState(true)
    const [stanice, setStanice] = useState([])
    const [relacija_id, setRelacija] = useState(route.params.relacija_id)

  
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
              setLocation(location)
          }
        })();
      }
    })

    const ucitajStanice = async () => {
        await fetch(`http://${getIP()}/publictransportcloud/api/Linija/stanice-relacija.php?id=${relacija_id}`)
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
            {stanice.map(stanica => <Marker coordinate={{latitude: parseFloat(stanica.lat), longitude: parseFloat(stanica.lng)}} title={stanica.naziv}>
                {stanica.tip == "Autobus" ? <Image source={require('../../imgs/bus.png')} style={{ width: 25, height: 25 }}/> : undefined}
                {stanica.tip == "Tramvaj" ? <Image source={require('../../imgs/Tramvaj.png')} style={{ width: 25, height: 25 }}/> : undefined}
                {stanica.tip == "Voz" ? <Image source={require('../../imgs/Voz.png')} style={{ width: 25, height: 25 }}/> : undefined}
                {stanica.tip == "Žičara" ? <Image source={require('../../imgs/Zicara.png')} style={{ width: 25, height: 25 }}/> : undefined}
                </Marker>
                )}
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