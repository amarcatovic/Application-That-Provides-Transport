import React, { Component } from 'react'
import { Alert, Text, Button, TextInput, View, StyleSheet, FlatList, TouchableOpacity, Image, Picker } from 'react-native'
import DatePicker from 'react-native-datepicker'
import QRCode from 'react-native-qrcode-svg'

import getIP from '../../config'

export default class main extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      data: this.props.route.params.data, 
      loadingAktivne: true,
      dolazak: '',
      reload: true,
      zahtjev_id: 0,
      prihvatiOpcije: false,
      zavrsiOpcije: false,
      prihvacen: false,
      placanje: false,
      ocijeni: false,
      grad_id: 1,
      ocjena: 0,
      loadingGrad: true,
      gradovi: [],
    }
  }

  componentDidMount(){
    setInterval(() => {
      this.setState({reload: true})
    }, 2000)

    this.ucitajGradove()
    this.ucitajAktivneZahtjeve()
  }

  ucitajGradove = async () => {
    await fetch(`http://${getIP()}/publictransportcloud/api/Grad/read.php`)
    .then(response => response.json())
    .then(data => {  
        this.setState({gradovi: data.data})
        this.setState({loadingGrad: false})
      }) 
  }

  ucitajAktivneZahtjeve = async () => {
    await fetch(`http://${getIP()}/publictransportcloud/api/TaxiZahtjev/aktivni.php?id=${this.state.grad_id}`)
    .then(response => response.json())
    .then(data => {  
        if(data.message)
        {
          this.setState({taxiZahtjevi: []})
        }
        else
        {
          this.setState({taxiZahtjevi: data.data})
        }
          this.setState({loadingAktivne: false, reload: false, zavrsiOpcije: true})
      })
  }

  ucitajStatuse = async () => {
    await fetch(`http://${getIP()}/publictransportcloud/api/TaxiZahtjev/vozac-status.php?id=${this.state.data.id}`)
    .then(response => response.json())
    .then(data => {  
        if(data.message)
        {
          this.setState({taxiStatusi: []})
        }
        else
        {
          this.setState({taxiStatusi: data.data})
        }
      }).then(() => this.provjeriStanja())
  }

  provjeriStanja = () =>{
  
    if(this.state.taxiStatusi)
    {
        this.state.taxiStatusi.map(zahtjev => {
        if(zahtjev.status === "Prihvaćen")
        {
            this.setState({prihvacen: true, placanje: false, ocijeni: false, zahtjev_id: zahtjev.id})
        }
        else if(zahtjev.status === "Plaćanje")
        {
            this.setState({placanje: true, prihvacen: false, ocijeni: false, zahtjev_id: zahtjev.id})
        }
        else if(zahtjev.status === "Ocijeni"){
            this.setState({ocijeni: true, placanje: false, prihvacen: false, zahtjev_id: zahtjev.id})
        }
        else if(zahtjev.status === "Završen" && zahtjev.id == this.state.zahtjev_id)
          this.setState({ocjena: zahtjev.ocjena, ocijeni: false})
        else
        {
          this.setState({ocijeni: false, placanje: false, prihvacen: false})
        }})
    }
}

  prihvatiVoznju = async() => {  
    fetch(`http://${getIP()}/publictransportcloud/api/TaxiZahtjev/prihvati-zahtjev.php`, {
    method: 'PUT', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: this.state.zahtjev_id, dolazak: this.state.dolazak, vozac_id: this.state.data.id}),
    })
    .then(response => response.json())
    .then(data => {
        alert("Prihvaćeno! Mušterija Vas čeka!")
    })
    .catch((error) => {
        alert('Geška prilikom prijavljivanja, molimo Vas da pokušate ponovo' + error)
    })  

    this.setState({prihvatiOpcije: false})
  }

  naplatiVoznju = async() => {  
    fetch(`http://${getIP()}/publictransportcloud/api/TaxiZahtjev/naplati.php`, {
    method: 'PUT', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: this.state.zahtjev_id, cijena: this.state.cijena}),
    })
    .then(response => response.json())
    .then(data => {
      this.setState({prihvacen: false, placanje: true})
    })
    .catch((error) => {
        alert('Geška prilikom naplate')
    })  

    this.setState({prihvatiOpcije: false})
  }
  
  render() {

    if(this.state.reload)
    {
      this.ucitajAktivneZahtjeve()
      this.ucitajStatuse()
    }

    if(this.state.loadingAktivne && this.state.loadingGrad)
    {
      return(
        <View style={styles.container}>
          <Text>Učitavanje...</Text>
        </View>
      )
    }
    else
    {
      return (
        <View style={styles.container}>
          <View style={styles.profileView}>
            <Text style={[styles.profileText, {color: '#3366CC', fontSize: 30, fontWeight: 'bold'}]}>{this.state.data.ime} {this.state.data.prezime}</Text>
            <Text style={styles.profileText}>Automobil: {this.state.data.marka} {this.state.data.model}, {this.state.data.boja} boja</Text>
            <Text style={styles.profileText}>Ocjena: {parseFloat(this.state.data.ocjena).toFixed(2)}</Text>
          </View>
            {this.state.zahtjev_id !== 0 && this.state.ocjena !== 0 ? 
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#3366CC', fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>Vožnja završena, dobili ste ocjenu {this.state.ocjena}</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={() => this.setState({zahtjev_id: 0})}><Text>OK</Text></TouchableOpacity>
              </View> : undefined
            }

            {this.state.prihvatiOpcije ? (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <DatePicker
                    style={{width: 400, marginBottom: 20}}
                    date={this.state.dolazak}
                    mode="datetime"
                    placeholder="Dolazak do mušterije"
                    format="YYYY-MM-DD HH:mm"
                    minDate="2020-05-01"
                    maxDate="2021-06-01"
                    confirmBtnText="Potvrdi"
                    cancelBtnText="Poništi"
                    customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        marginLeft: 36
                    }
                    }}
                    onDateChange={(date) => {this.setState({dolazak: date})}}
                />
                <TouchableOpacity onPress={() => this.prihvatiVoznju()} style={styles.loginBtn}><Text style={{color: 'white'}}>Prihvati vožnju</Text></TouchableOpacity>
              </View>
            ) : undefined}

            {this.state.prihvacen ? <View style={{width: '80%', justifyContent:'center', alignItems: 'center'}}>
              <TextInput
                editable={true}
                value={this.state.cijena}
                onChangeText={(cijena) => this.setState({ cijena })}
                placeholder={'Cijena Vožnje'}
                style={[styles.input, {width: '40%'}]}
              />
              <TouchableOpacity
                style={[styles.loginBtn, {width: '50%'}]}
                onPress={() => this.naplatiVoznju()}>
                <Text style={[styles.text, {color: 'white'}]}>Naplati Vožnju</Text>
              </TouchableOpacity>
            </View> : undefined}


            {this.state.placanje ? <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <QRCode
                  value={this.state.zahtjev_id}
                  color={'#3366CC'}
                  backgroundColor={'white'}
                  size={350}
                  logo={require('../../imgs/logo.png')}
                  logoMargin={2}
                  logoSize={50}
                  logoBorderRadius={10}
                  logoBackgroundColor={'transparent'}
              />
              <Text>Pokažite QR Kod mušteriji</Text>
            </View> : undefined}

            {this.state.ocijeni ? (<View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#3366CC', fontSize: 15}}>Molimo čekajte da vas mušterija ocijeni</Text>
            </View>) : undefined}


            <Picker
              style={{ height: 50, width: '80%' }}
              mode="dropdown"
              selectedValue={this.state.grad_id}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({grad_id: itemValue})
                this.setState({reload: true})
                }}>
              {this.state.gradovi.map(grad => <Picker.Item label={grad.naziv} value={grad.id}/>)}
            </Picker>
            <FlatList
              data={this.state.taxiZahtjevi}
              renderItem={({item}) => (
                  <TouchableOpacity
                      style={styles.relacija}
                      onPress={() => this.setState({zahtjev_id: item.id, prihvatiOpcije: true})}>
                      <Image style={styles.tinyLogo} source={require('../../imgs/Taxi.png')} />
                      <View style={styles.textoviRelacija}>
                          <Text style={[styles.textRelacija, {fontWeight: 'bold', fontSize: 20}]}>{item.lokacija}</Text>
                          <Text style={styles.textRelacija}>Opis: {item.opis}</Text>
                          <Text style={styles.textRelacija}>Vrijeme: {item.vrijeme}</Text>
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
    width: '80%',
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    marginTop: 10,
    color: 'white',
    borderRadius: 90,
    backgroundColor: '#3366CC',
    opacity: 0.8,
    fontWeight: 'bold',
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
    textoviRelacija: {
      width: '70%',
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
    loginBtn: {
      backgroundColor: '#3366CC',
      color: 'white',
      padding: 20,
      borderWidth: 1,
      borderRadius:50,
      height: 30,
      width: '100%',
      alignItems:'center',
      justifyContent:'center',
      fontWeight: 'bold',
      fontSize: 50
    },
    profileView: {
      width: '100%',
      padding: 20,
      justifyContent: 'flex-start'
    },
    profileText: {
      fontSize: 20,
      fontWeight: '400',     
    }
})
