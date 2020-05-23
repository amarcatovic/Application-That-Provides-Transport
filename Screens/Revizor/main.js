import React, { Component } from 'react'
import { Alert, Text, Button, TextInput, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';

import getIP from '../../config'

export default class Revizor extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        data: this.props.route.params.data,  
        scanned: false,
        hasPermission: 'no',
        vozilo_id: null,
        linija_id: 0,
        loadLinija: false,
        skenirajKartu: false,
        napusti: false,
    }
  }

  ucitajLiniju = async (reg) => {
    await fetch(`http://${getIP()}/publictransportcloud/api/Revizor/vozilo.php?reg=${reg}`)
    .then(response => response.json())
    .then(data => {  
        if(data.message)
        {
          alert("Greška! Pokušajte ponovo!")
        }
        else
        {
          this.setState({linija_id: data.data[0].id})
          this.ucitajPodatkeLinije(data.data[0].id)
        }
      })
  }

  ucitajPodatkeLinije = async (id) => {
    await fetch(`http://${getIP()}/publictransportcloud/api/Linija/single.php?id=${id}`)
    .then(response => response.json())
    .then(data => {  
        this.setState({linija: data})
      })
  }

  ucitajVozilo = async (reg) => {
    await fetch(`http://${getIP()}/publictransportcloud/api/Vozilo/single.php?reg=${reg}`)
    .then(response => response.json())
    .then(data => {  
        this.setState({vozilo: data, napusti: true})
      })
  }

  ucitajKartu = async (id) => {
    await fetch(`http://${getIP()}/publictransportcloud/api/Revizor/provjera.php?l=${this.state.linija_id}&k=${id}`)
    .then(response => response.json())
    .then(data => {  
        if(data.data[0].broj == 0)
        {
          alert("Nije Plaćeno")
        }
        else if(parseInt(data.data[0].broj) != 0)
        {
            alert("Plaćeno")
        }
        else 
        {
            alert("Greška prilikom skeniranja")
        }
      })
  }

  
  componentDidMount(){
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      this.setState({hasPermission: 'granted'});
    })()
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({scanned: false, loadLinija: false, vozilo_id: data})
    this.ucitajLiniju(data)
    this.ucitajVozilo(data)
  }

  handleKartaScanned = ({ type, data }) => {
    this.setState({scanned: false, skenirajKartu: false})
    this.ucitajKartu(data)
  }
  

  render() {
      return(
        <View style={styles.container}>
            {this.state.vozilo ? <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                {this.state.linija ? <Text style={styles.info}>{this.state.linija.polaziste} - {this.state.linija.odrediste}</Text> : undefined}
                <Text style={styles.info}>{this.state.vozilo.prevoznik}</Text>
                <Text style={styles.info}>{this.state.vozilo.tip} - {this.state.vozilo.naziv}</Text> 
            </View> : undefined}
            {this.state.loadLinija ? <BarCodeScanner
                onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            /> : undefined}
            {this.state.skenirajKartu ? <BarCodeScanner
                onBarCodeScanned={this.state.scanned ? undefined : this.handleKartaScanned}
                style={StyleSheet.absoluteFillObject}
            /> : undefined}

            {!this.state.skenirajKartu && !this.state.loadLinija ? (
            <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity style={styles.loginBtn} onPress={() => this.setState({loadLinija: true})}>
                    <Text style={styles.text}>Registruj vozilo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginBtn} onPress={() => this.setState({skenirajKartu: true})}>
                    <Text style={styles.text}>Skeniraj Kartu</Text>
                </TouchableOpacity>
            </View>
            ) : undefined }

            {this.state.vozilo && !this.state.skenirajKartu && !this.state.loadLinija ? <TouchableOpacity style={styles.loginBtn} onPress={() => this.setState({vozilo: null})}>
                    <Text style={styles.text}>Napusti Vozilo</Text>
                </TouchableOpacity> : undefined}


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
    paddingBottom: 30
  },
  loginBtn: {
    backgroundColor: '#3366CC',
    color: 'white',
    padding: 20,
    borderWidth: 1,
    borderRadius:50,
    height: 30,
    width: '50%',
    alignItems:'center',
    justifyContent:'center',
    marginTop: 50,
    fontWeight: 'bold',
    fontSize: 50
  },
  text:{
    color: 'white',
  },
  info: {
    fontSize: 30,
    fontWeight: 'bold'
  },
})
