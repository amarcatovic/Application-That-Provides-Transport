import React, { Component } from 'react'
import { Alert, Text, Button, FlatList, TextInput, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Rating, AirbnbRating } from 'react-native-ratings'

import getIP from '../../config'

export default class taxi extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
        data: this.props.route.params.data, 
        taxi:  this.props.route.params.taxi,
        lokacija: '',
        opis: '',
        brojac: 0,
        voznja_id: 0,
        loadingTaxi: true,
        loading: true,
    }
  }

  componentDidMount(){
    setInterval(() => {
        this.setState({loadingTaxi: true})
    }, 5000)
    this.ucitajTaxiZahtjeve()
    this.setState({loading: false})
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
          this.setState({taxi: data.data})
        }
          this.setState({loadingTaxi: false})
      }).then(() => this.provjeriStanja())
  }
  

  provjeriStanja = () =>{
        let brojac = 0
        let plati = 0
        let ocijeni = 0
        let ceka = 0

        if(this.state.taxi)
        {
            this.state.taxi.map(zahtjev => {
            if(zahtjev.status === "Prihvaćen")
            {
                brojac++
                this.setState({zahtjev_id: zahtjev.id})
            }
            if(zahtjev.status === "Na Čekanju" && zahtjev.vrijeme != "Istekao")
            {
                ceka++
                this.setState({zahtjev_id: zahtjev.id})
            }
            if(zahtjev.status === "Plaćanje")
            {
                plati++
                this.setState({zahtjev_id: zahtjev.id})
            }
            if(zahtjev.status === "Ocijeni"){
                ocijeni++
                this.setState({zahtjev_id: zahtjev.id})
            }
            
            })

            this.setState({brojac, plati, ocijeni, ceka})
        }
  }

  ocijeni = (rating = 5) => {
    fetch(`http://${getIP()}/publictransportcloud/api/TaxiZahtjev/ocijeni.php`, {
    method: 'PUT', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: this.state.zahtjev_id, ocjena: rating}),
    })
    .then(response => response.json())
    .then(dataJSON => {
    })
  }

  naruciTaxi = () => {
    fetch(`http://${getIP()}/publictransportcloud/api/TaxiZahtjev/create.php`, {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: this.state.data.id, lokacija: this.state.lokacija, opis: this.state.opis, grad_id: this.state.data.grad_id}),
    })
    .then(response => response.json())
    .then(dataJSON => {
        this.ucitajTaxiZahtjeve()
    })
  }

  otkaziTaxi = () => {
    fetch(`http://${getIP()}/publictransportcloud/api/TaxiZahtjev/ponisti-zahtjev.php`, {
    method: 'PUT', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: this.state.taxi[0].id}),
    })
    .then(response => response.json())
    .then(dataJSON => {
        this.ucitajTaxiZahtjeve()
        alert("Otkazano!")
        this.setState({ceka: 0})
    }).catch(e => alert(e))
  }

  render() {
      if(this.state.loadingTaxi)
      {
          this.ucitajTaxiZahtjeve()
      }

      if(this.state.loading)
      {
          return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center', fontSize: 20, color:'#3366CC', fontWeight: 'bold'}}>Učitavanje...</Text>
            </View>
          )
      }
      else
      {
      return(
          
        <View style={styles.container}>
            {this.state.ceka != 0 && !this.state.loading ? <TouchableOpacity style={styles.loginBtn} onPress={() => {this.otkaziTaxi()}}>
                <Text style={styles.text}>Otkaži Taxi</Text>
            </TouchableOpacity> : undefined}
            {this.state.brojac != 0 && !this.state.loading ? (<View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
            <Text style={{textAlign: 'center', fontSize: 20, color:'#3366CC', fontWeight: 'bold'}}>Vožnju je prihvatio vozač s prosječnom ocjenom {parseFloat(this.state.taxi[0].ocjenaVozac).toFixed(2)}</Text>
            <Text style={{textAlign: 'center', fontSize: 20, color:'#3366CC', marginTop: 10, fontWeight: 'bold'}}>Automobil: {this.state.taxi[0].marka} {this.state.taxi[0].model}, boja: {this.state.taxi[0].boja}</Text>
            <TouchableOpacity style={styles.loginBtn} onPress={() => {this.otkaziTaxi()}}>
                <Text style={styles.text}>Otkaži Taxi</Text>
            </TouchableOpacity>
            </View>) : undefined}
            {this.state.brojac === 0 && this.state.plati === 0 && this.state.ocijeni === 0 && this.state.ceka === 0 && !this.state.loading ? (
            <View style={styles.wrapper}>
            <TextInput
                style={{width: '100%'}}
                onChangeText={(lokacija) => this.setState({ lokacija })}
                placeholder={'Lokacija'}
                style={styles.input}
                editable
            />
            <TextInput
                style={[styles.input, {height: 100}]}
                multiline
                numberOfLines={3}
                onChangeText={(opis) => this.setState({ opis })}
                placeholder={'Opis'}
                editable
            />
            <TouchableOpacity style={styles.loginBtn} onPress={() => {
                this.naruciTaxi()
                this.ucitajTaxiZahtjeve()
                this.setState({ceka: 1})
                }}>
                <Text style={styles.text}>Naruči Taxi</Text>
            </TouchableOpacity>
            </View>) : undefined }
            {this.state.ceka != 0 && !this.state.loading ? <Text style={{fontSize: 20, color:'#3366CC', margin: 20, fontWeight: 'bold', textAlign: 'center'}}>Molimo pričekajte da neki od vozača prihvate vaš zahtjev</Text> : undefined}
            {this.state.plati != 0 && !this.state.loading ? (
            <View style={styles.wrapper}>
            <TouchableOpacity style={styles.loginBtn} onPress={() => {
                this.props.navigation.navigate('TaxiPlati', {zahtjev: this.state.zahtjev_id, kartica: this.state.data.brojKartice})
                this.setState({plati: 0})
                this.setState({ocijeni: 1})
                }}>
            <Text style={styles.text}>Plati Taxi</Text>
            </TouchableOpacity>
            </View>) : undefined }

            {this.state.ocijeni != 0 && !this.state.loading ? (
            <View style={styles.wrapper}>
            <AirbnbRating
                count={5}
                reviews={["Užasno", "Loše", "Dobro", "Ugodno", "Sjajno"]}
                defaultRating={5}
                size={50}
                onFinishRating={(rating) => Alert.alert(
                    "Ocijeni Vožnju",
                    "Da li ste sigurni da želite ocijeniti vašu vožnju sa ocjenom " + rating + "?",
                    [
                        {
                        text: "Ne",
                        },
                        { text: "Da", onPress: () => {
                            this.ocijeni(rating)
                            this.setState({ocijeni: 0})
                            alert("Vožnja završena!")
                        }}
                    ],
                    { cancelable: false }
                )}
            />
            <Text style={{fontSize: 20, color:'#3366CC', margin: 20, fontWeight: 'bold'}}>Ocijenite vašu taxi vožnju</Text>
            </View>) : undefined }
             
          <FlatList
            data={this.state.taxi}
            renderItem={({item}) => (
                <TouchableOpacity
                    style={styles.relacija}
                    onPress={() => alert("TODO")}>
                    <Image style={styles.tinyLogo} source={require('../../imgs/Taxi.png')} />
                    <View style={styles.textoviRelacija}>
                        <Text style={[styles.textRelacija, {fontWeight: 'bold', fontSize: 20}]}>{item.lokacija}</Text>
                        <Text style={styles.textRelacija}>Vrijeme zahtjeva: {item.vrijeme}</Text>
                        {item.vrijeme == 'Istekao' ? undefined : <Text style={styles.textRelacija}>Status: {item.status}</Text>}
                        {item.cijena != null ? <Text style={styles.textRelacija}>Cijena: {item.cijena}</Text> : undefined}
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
    backgroundColor: '#e0e0e0',
    width: '100%',
    padding: 10
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
    borderRadius: 10,
    backgroundColor: '#3366CC',
    opacity: 0.8,
    fontWeight: 'bold',
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
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 50,
    marginBottom: 20
  },
  text:{
    color: 'white',
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
    wrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
