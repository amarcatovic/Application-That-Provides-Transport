import React, { Component } from 'react'
import { Alert, Text, Button, TextInput, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import getIP from '../../config'

export default class Profile extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        data: this.props.route.params.data,  
        loadingPlacene: true,
        loadingNadopune: true,
        placeno: [],
        nadopunjeno: []
    }
  }

  componentDidMount(){
    this.ucitajKorisnika()
  }

  ucitajKorisnika = async () => {
    await fetch(`http://${getIP()}/publictransportcloud/api/Korisnik/single.php?id=${this.state.data.id}`)
    .then(response => response.json())
    .then(data => {  
        this.setState({data})  
      }) 
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

  ucitajNadopune = async () => {
    await fetch(`http://${getIP()}/publictransportcloud/api/Nadopune/read.php?id=${this.state.data.id}`)
    .then(response => response.json())
    .then(data => {  
        if(data.message)
        {
            this.setState({nadopunjeno: []})
        }
        else
        {
            this.setState({nadopunjeno: data.data})
        }
        this.setState({loadingNadopune: false})
      }) 
  }

  izracunajPlacene = () => {
      let suma = 0
      if(!this.state.placeno || this.state.placeno.length === 0)
        return 0

      if(!this.state.loadingPlacene)
        this.state.placeno.map(x => suma += parseFloat(x.cijena))

      return '-' + suma +'KM'
  }

  izracunajNadopune = () => {
    let suma = 0
    if(!this.state.nadopunjeno || this.state.nadopunjeno.length === 0)
      return 0
    
    this.state.nadopunjeno.map(x => suma += parseFloat(x.kolicina))

    return '+' + suma +'KM'
}

  dodajE = (ime) => {
      const slovo = ime[ime.length - 1]
      if(slovo == 'a' || slovo == 'e' || slovo == 'i' || slovo == 'o' || slovo == 'u' || slovo == 'k' )
        return ime

      return ime + 'e'
  }
  
  render() {
    if(this.state.loadingPlacene && this.state.loadingNadopune)
    {
        this.ucitajPlaceneLinije()
        this.ucitajNadopune()
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
                <View style={styles.profilInfo}>
                    <View style={styles.txtovi}>
                        <Text style={styles.txt}>Ćao, {this.dodajE(this.state.data.ime)}</Text>
                        <Text style={{fontSize: 15}}>{this.state.data.grad}, {this.state.data.drzava}</Text>
                        <Text style={{fontSize: 15}}>Broj kartice: {this.state.data.brojKartice}</Text>
                    </View>
                        <Text style={styles.txt}>{this.state.data.stanje}KM</Text>
                </View>

                <TouchableOpacity style={styles.panel} onPress={() => this.props.navigation.navigate('KorisnikPlaceno', {data: this.state.placeno})} >
                    <Text style={{fontSize: 25, color: '#3366CC', fontWeight: 'bold'}}>Plaćene vožnje:</Text>
                    <View style={styles.panelBottom}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#3366CC'}}>{this.izracunajPlacene()}</Text>
                        <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('KorisnikPlaceno', {data: this.state.placeno})} >
                            <Text style={{color: 'white', fontWeight: 'bold'}}>Pogledaj</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.panel} onPress={() => this.props.navigation.navigate('KorisnikNadopunjeno', {data: this.state.nadopunjeno})} >
                    <Text style={{fontSize: 25, color: '#3366CC', fontWeight: 'bold'}}>Nadopune:</Text>
                    <View style={styles.panelBottom}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#3366CC'}}>{this.izracunajNadopune()}</Text>
                        <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('KorisnikNadopunjeno', {data: this.state.nadopunjeno})} >
                            <Text style={{color: 'white', fontWeight: 'bold'}}>Pogledaj</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

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
    justifyContent: 'space-between',
    backgroundColor: '#e0e0e0',
    width: '100%',
    paddingBottom: 30
  },
  profilInfo: {
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 20,
    flexDirection: 'row',
    paddingRight: 40
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
  txtovi: {
    width: '70%'
  },
  txt: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#3366CC',
      marginTop: 10
  },
  tinyLogo: {
    width: '50%',
    height: '40%',
    resizeMode: 'stretch',
  },
  panel: {
    backgroundColor: '#edebeb',
    width: '90%',
    borderRadius: 15,
    padding: 20
  },
  panelBottom: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center'
  },
  btn: {
      backgroundColor: '#3366CC',
      padding: 10,
      borderRadius: 45,
  }
})
