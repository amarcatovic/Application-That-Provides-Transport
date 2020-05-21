import React, { Component } from 'react'
import { Alert, Text, Button, FlatList, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import getIP from '../../config'

export default class Profile extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        data: this.props.route.params.data,  
    }
  }

  render() {
      return(
        <View style={styles.container}>
            <FlatList
                data={this.state.data}
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={styles.relacija}
                        onPress={() => alert("TODO")}>
                        <Image style={styles.tinyLogo} source={require('../../imgs/prmj.png')} />
                        <View style={styles.textoviRelacija}>
                        <Text style={[styles.textRelacija, {fontWeight: 'bold', fontSize: 20}]}>{item.poslovnica}, {item.grad}</Text>
                            <Text style={styles.textRelacija}>Datum: {item.datum}</Text>
                            <Text style={styles.textRelacija}>Količina: {item.kolicina}KM</Text>
                        </View>
                    </TouchableOpacity> 
                )}
                keyExtractor={item => item.id}
                extraData={this.state}
            />
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    width: '100%',
    padding: 10
  },
  relacija: {
    width: '90%',
    backgroundColor: '#edebeb',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.52,
    shadowRadius: 7.22,
    elevation: 1,
    borderRadius: 30,
    marginBottom: 20,
    },
    textRelacija: {
    fontSize: 10,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
    },
    textRelacijaOdabrana: {
    fontSize: 10,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'green'
    },
    tinyLogo: {
    width: 60,
    height: 60,
    resizeMode: 'stretch',
    },
    optionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    width: '100%'
    }
})
