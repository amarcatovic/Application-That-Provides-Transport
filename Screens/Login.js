import React, { Component } from 'react';
import { Alert, Image, Button, TextInput, View, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView } from 'react-native';
import getIP from '../config'

import { render } from 'react-dom';

export default class Login extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      email: '',
      password: '',
    }
  }
  
  onLogin = async() => {  
    fetch(`http://${getIP()}/publictransportcloud/api/KorisnikAplikacije/login.php`, {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({email: this.state.email, password: this.state.password}),
    })
    .then(response => response.json())
    .then(data => {
      this.setState({data})

      if(this.state.data.uloga == "Vozač")
      {
        this.props.navigation.navigate('VozacMainTabs', {
          screen: 'VozacMain',
          params: { data: this.state.data }})
      } 
      else if (this.state.data.uloga == "Taxi")
      {
        this.props.navigation.navigate('TaxiVozacMain', {data: this.state.data})
      }
      else if (this.state.data.uloga == "Korisnik")
      {
        this.props.navigation.navigate('KorisnikMain', {screen: "KorisnikHome", params: {data: this.state.data}})
      }
      else if (this.state.data.uloga == "Revizor")
      {
        this.props.navigation.navigate('Revizor', {data: this.state.data})
      }
    })
    .catch((error) => {
        alert('Geška prilikom prijavljivanja, molimo Vas da pokušate ponovo')
    })
    
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Image style={styles.tinyLogo} source={require('../imgs/logo.png')} />
        <View style={styles.form}>
          <TextInput
            style={{width: '100%'}}
            onChangeText={(email) => this.setState({ email })}
            placeholder={'Email'}
            style={styles.input}
            editable
          />
          <TextInput
            editable={true}
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={'Lozinka'}
            secureTextEntry={true}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={this.onLogin.bind(this)}>
            <Text style={styles.text}>Prijavi Se</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 50,
    backgroundColor: '#e0e0e0'
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
  tinyLogo: {
    width: '50%',
    height: '40%',
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
    marginTop: 50,
    fontWeight: 'bold',
    fontSize: 50
  },
  text:{
    color: 'white',
  },
  form: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    width: '100%'
  },
  TextInputStyleClass:{
    textAlign: 'center',
    height: 50,
     borderWidth: 2,
     borderColor: '#FF5722',
     borderRadius: 20 ,
     backgroundColor : "#FFFFFF",  
     marginBottom: 20   
    }
});
