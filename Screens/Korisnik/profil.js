import React, { Component } from 'react'
import { Alert, Text, Button, TextInput, View, StyleSheet, Image } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import getIP from '../../config'

export default class Profile extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        data: this.props.route.params.data,  
        loadingPlacene: true,
    }
  }

  ucitajPlaceneLinije = async () => {
    await fetch(`http://${getIP()}/publictransportcloud/api/LinijaPlacanje/read.php?id=${this.state.data.id}`)
    .then(response => response.json())
    .then(data => {  
        if(data.message)
        {
            this.setState({placeno: []})
        }
        else
        {
            this.setState({placeno: data.data})
        }
        this.setState({loadingPlacene: false})
      }) 
  }
  
  render() {
    if(this.state.loadingPlacene)
    {
        this.ucitajPlaceneLinije()
        return (
            <View style={styles.container}>
                <Text>Učitavam...</Text>
            </View>
        )
    }
    else
    {
        return (
            <View style={styles.container}>
              <Text style={styles.txt}>{this.state.data.ime} {this.state.data.prezime}</Text>
              <QRCode
                  value={this.state.data.brojKartice}
                  color={'#3366CC'}
                  backgroundColor={'white'}
                  size={150}
                  logo={require('../../imgs/logo.png')}
                  logoMargin={2}
                  logoSize={20}
                  logoBorderRadius={10}
                  logoBackgroundColor={'transparent'}
              />
            </View>
          )
    }   
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    marginTop: 10,
  },
  txt: {
      fontSize: 50,
      color: '#3366CC',
      marginTop: 50
  },
  tinyLogo: {
    width: '50%',
    height: '40%',
    resizeMode: 'stretch',
  }
});
