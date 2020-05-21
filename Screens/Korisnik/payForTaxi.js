import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import getIP from '../../config'

export default function PayByAppTaxi({route, navigation}) {
    
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)

  const [zahtjev_id, setId] = useState(route.params.zahtjev)
  const [brojKartice, setKartica] = useState(route.params.kartica)

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)

    if(data != zahtjev_id)
    {
        alert("Greška")
        return
    }

    fetch(`http://${getIP()}/publictransportcloud/api/TaxiZahtjev/plati.php`, {
    method: 'PUT', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: zahtjev_id, kartica: brojKartice}),
    })
    .then(response => response.json())
    .then(dataJSON => {
      alert(`Taxi Vožnja Plaćena`)
      navigation.goBack()
    })
    .catch((error) => {
        alert("Greška")
    })
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}
