import React, { Component } from 'react'
import { Alert, Text, Button, TextInput, View, StyleSheet, TouchableOpacity, Picker, FlatList, Image } from 'react-native'
import getIP from '../../config'

export default class main extends Component {
  constructor(props) {
    super(props)
    

    this.state = {
      data: this.props.route.params.data,  
      loadingTip: true,
      loadingLinije: true,
      loadingGrad: true,
      selectedGrad: 1,
      selectedTip: 1,
      reloadLinije: false,
      payWindow: false,
      taxiWindow: false,
      profilWindow: false,
      mainWindow: true,
      taxiZahtjevi: [],
      loadingTaxi: true,
      aktivniZahtjeviCount: 0,
    }
  }

  componentDidMount(){
    this.ucitajGradove()
    this.ucitajTipove()
    this.ucitajAktivneLinije()
    this.ucitajTaxiZahtjeve()
    setInterval(() => {this.setState({reloadLinije: true})}, 5000)
  }

  ucitajGradove = async () => {
    await fetch(`http://${getIP()}/publictransportcloud/api/Grad/read.php`)
    .then(response => response.json())
    .then(data => {  
        this.setState({gradovi: data.data})
        this.setState({loadingGrad: false})
      }) 
  }

  ucitajTipove = async () => {
    await fetch(`http://${getIP()}/publictransportcloud/api/TipVozila/read.php`)
    .then(response => response.json())
    .then(data => {  
        this.setState({tipovi: data.data})
        this.setState({loadingTip: false})
      }) 
  }

  ucitajAktivneLinije = async () => {
    await fetch(`http://${getIP()}/publictransportcloud/api/Linija/read.php?g=${this.state.selectedGrad}&t=${this.state.selectedTip}`)
    .then(response => response.json())
    .then(data => {  
        this.setState({aktivneLinije: data.data})
        this.setState({loadingLinije: false})
        this.setState({reloadLinije: false})
      }) 
  }

  ucitajTaxiZahtjeve = async () => {
    await fetch(`http://${getIP()}/publictransportcloud/api/TaxiZahtjev/read.php?id=${this.state.data.id}`)
    .then(response => response.json())
    .then(data => {  
        if(data.message)
        {
          this.setState({taxiZahtjevi: []})
        }
        else
        {
          let brojac = 0
          data.data.map(zahtjev => {
            if(zahtjev.status === "Prihvaćen")
              brojac++
          })

          this.setState({taxiZahtjevi: data.data, aktivniZahtjeviCount: brojac})
        }
          this.setState({loadingTaxi: false})
      }) 
  }
  
  render() {
    if(this.state.reloadLinije)
    {
      this.ucitajAktivneLinije()
      this.ucitajTaxiZahtjeve()
    }
    if(this.state.loadingGrad || this.state.loadingTip || this.state.loadingLinije){
      this.ucitajAktivneLinije()
      return (
        <View style={styles.container} >
          <Text>Loading...</Text>
        </View>
      )
    }
    else if(this.state.mainWindow)
    {
      return (
        <View style={styles.container} >
          <View style={styles.optionIcons}>
            <TouchableOpacity 
              onPress={() => this.props.navigation.navigate('KorisnikTaxi', {data: this.state.data, taxi: this.state.taxiZahtjevi})}>
              {this.state.aktivniZahtjeviCount > 0 ? <Image style={styles.tinyLogo} source={require('../../imgs/Taxi-Zahtjev.png')} /> : <Image style={styles.tinyLogo} source={require('../../imgs/Taxi.png')} />}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => this.props.navigation.navigate('PayByAppKorisnik', {data: this.state.data})}>
              <Image style={styles.tinyLogo} source={require('../../imgs/QR.png')} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => this.props.navigation.navigate('KorisnikProfil', {data: this.state.data})}>
              <Image style={styles.tinyLogo} source={require('../../imgs/Profil.png')} />
            </TouchableOpacity>
          </View>
        <Picker
          style={{ height: 50, width: '80%' }}
          mode="dropdown"
          selectedValue={this.state.selectedGrad}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({selectedGrad: itemValue, loadingLinije: true})
            }}>
          {this.state.gradovi.map(grad => <Picker.Item label={grad.naziv} value={grad.id}/>)}
        </Picker>
        <Picker
          style={{ height: 50, width: '80%' }}
          mode="dropdown"
          selectedValue={this.state.selectedTip}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({selectedTip: itemValue, loadingLinije: true})
            }}>
          {this.state.tipovi.map(tip => <Picker.Item label={tip.naziv} value={tip.id}/>)}
          </Picker>
          <FlatList
            data={this.state.aktivneLinije}
            renderItem={({item}) => (
                <TouchableOpacity
                    style={styles.relacija}
                    onPress={() => this.props.navigation.navigate('StaniceRelacije', {relacija_id: item.relacija_id})}>
                      {item.tip == "Autobus" ? <Image style={styles.tinyLogo} source={require('../../imgs/bus.png')} /> : undefined }
                      {item.tip == "Trolejbus" ? <Image style={styles.tinyLogo} source={require('../../imgs/bus.png')} /> : undefined }
                      {item.tip == "Tramvaj" ? <Image style={styles.tinyLogo} source={require('../../imgs/Tramvaj.png')} /> : undefined }
                      {item.tip == "Voz" ? <Image style={styles.tinyLogo} source={require('../../imgs/Voz.png')} /> : undefined }
                      {item.tip == "Metro" ? <Image style={styles.tinyLogo} source={require('../../imgs/Metro.png')} /> : undefined }
                      {item.tip == "Žičara" ? <Image style={styles.tinyLogo} source={require('../../imgs/Zicara.png')} /> : undefined }
                    <View style={styles.textoviRelacija}>
                        <Text style={[styles.textRelacija, {fontWeight: 'bold', fontSize: 20}]}>{item.polaziste} - {item.odrediste}</Text>
                        <Text style={styles.textRelacija}>Sljedeća stanica: {item.sljedecaStanica}</Text>
                        <Text style={styles.textRelacija}>Cijena karte: {item.cijena}</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
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
  btn: {
      margin: 20,
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
