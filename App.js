import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { Ionicons } from '@expo/vector-icons'

import Login from './Screens/Login'
import About from './Screens/About'
import Welcome from './Screens/Welcome'
import LoadingScreen from './Screens/LoadingScreen'

import VozacMain from './Screens/Vozac/main'
import VozacLinijaManager from './Screens/Vozac/VozacLinijaManager'
import VozacHelp from './Screens/Vozac/vozacHelp'

import TaxiVozacMain from './Screens/Taxi/main'

import KorisnikMain from './Screens/Korisnik/main'
import KorisnikStanice from './Screens/Korisnik/stanice'
import KorisnikProdajnaMjesta from './Screens/Korisnik/prodajnaMjesta'
import KorisnikPayByApp from './Screens/Korisnik/payByApp'
import KorisnikProfil from './Screens/Korisnik/profil'
import KorisnikPlaceno from './Screens/Korisnik/placeno'
import KorisnikNadopunjeno from './Screens/Korisnik/nadopunjeno'
import KorisnikTaxi from './Screens/Korisnik/taxi'
import TaxiPlati from './Screens/Korisnik/payForTaxi'
import StaniceRelacije from './Screens/Korisnik/StaniceRelacije'

import Revizor from './Screens/Revizor/main'

const Tabs = createBottomTabNavigator()
const Stack = createStackNavigator()

const AppIntro = createStackNavigator()
const AppIntroScreen = () => (
  <AppIntro.Navigator>
    <AppIntro.Screen name="Welcome" component={Welcome} options={{title: 'Molimo Vas da sačekate'}}/>
    <AppIntro.Screen name="Login" component={Login} />
  </AppIntro.Navigator>
)

const VozacTabs = createBottomTabNavigator()
const VozacTabsScreen = () => (
  <VozacTabs.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'VozacMain') {
        iconName = focused ? 'ios-bus' : 'ios-bus';
      } else if (route.name === 'VozacMain2') {
        iconName = focused ? 'ios-help-circle' : 'ios-help-circle-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}
  tabBarOptions={{
    activeTintColor: '#3366CC',
    inactiveTintColor: 'gray',
  }}
  >
    <VozacTabs.Screen name="VozacMain" component={VozacMain} options={{title: "Vozač"}}/>
    <VozacTabs.Screen name="VozacMain2" component={VozacHelp} options={{title: "Pomoć"}}/>
  </VozacTabs.Navigator>
)

const KorisnikMainTabs = createStackNavigator()
const KorisnikStack = () => (
  <KorisnikMainTabs>
    <KorisnikMainTabs.Screen name={"KorisnikHome1"} component={KorisnikMain} />
    <KorisnikMainTabs.Screen name={"KorisnikPayByApp"} component={KorisnikPayByApp} />
  </KorisnikMainTabs>
)

const KorisnikTabs = createBottomTabNavigator()
const KorisnikTabsScreen = () => (
  <KorisnikTabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'KorisnikHome') {
          iconName = focused ? 'ios-bus' : 'ios-bus';
        } else if (route.name === 'KorisnikStanice') {
          iconName = focused ? 'ios-pin' : 'ios-pin';
        }
        else if (route.name === 'KorisnikProdajnaMjesta') {
          iconName = focused ? 'ios-card' : 'ios-card';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: '#3366CC',
      inactiveTintColor: 'gray',
    }}
  >
    <KorisnikTabs.Screen name="KorisnikHome" component={KorisnikMain} 
            options={{
            headerLeft: null, title: 'Aktivne Linije', headerStyle: {
            backgroundColor: '#3366CC',}, 
            navigationOptions: {
            headerTintColor: 'white'}
            }}/>
    <KorisnikTabs.Screen name="KorisnikStanice" component={KorisnikStanice} options={{headerLeft: null, title: 'Stanice', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
    <KorisnikTabs.Screen name="KorisnikProdajnaMjesta" component={KorisnikProdajnaMjesta} options={{headerLeft: null, title: 'Prodajna Mjesta', headerStyle: {
      backgroundColor: '#3366CC',
    }, headerTintColor: 'white'}}/>
  </KorisnikTabs.Navigator>
)


export default () => {

  const [isLoading, setIsLoading, uloga ] = React.useState(true)
  const [userToken, setUserToken] =  React.useState(null)

  const authContext = React.useMemo(() => {
    return {
      signIn: (zanimanje) => {
        setIsLoading(false)
        setUserToken('asdf')
        uloga(zanimanje)
      },
      signOut: () => {
        setIsLoading(false)
        setUserToken(null)
      }
    }
  }, [])

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  })

  if(isLoading){
    return <LoadingScreen />
  }

  return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="AppIntroScreen" component={Login} options={{title: 'Dobrodošli', headerTitleStyle: { 
          textAlign:"center"}, headerStyle: {
            backgroundColor: '#3366CC',
          },headerTintColor: 'white'}}/>
          <Stack.Screen name="VozacMainTabs" component={VozacTabsScreen} options={{headerLeft: null, title: 'Glavni Izbornik', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
          <Stack.Screen name="VozacLinijaManager" component={VozacLinijaManager} options={{title: 'Upravljanje Linijom', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
          <Stack.Screen name="TaxiVozacMain" component={TaxiVozacMain} options={{headerLeft: null, title: 'Taxi', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
          <Stack.Screen name="KorisnikMain" component={KorisnikTabsScreen} options={{headerLeft: null, title: 'Početna', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
          <Stack.Screen name="PayByAppKorisnik" component={KorisnikPayByApp} options={{title: 'Pay By App', headerStyle: {
            backgroundColor: '#3366CC',
            }, headerTintColor: 'white'}}/>
          <Stack.Screen name="KorisnikProfil" component={KorisnikProfil} options={{title: 'Profil', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
          <Stack.Screen name="KorisnikPlaceno" component={KorisnikPlaceno} options={{title: 'Plaćene vožnje', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
          <Stack.Screen name="KorisnikNadopunjeno" component={KorisnikNadopunjeno} options={{title: 'Nadopune', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
          <Stack.Screen name="KorisnikTaxi" component={KorisnikTaxi} options={{title: 'Naruči Taxi', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
          <Stack.Screen name="TaxiPlati" component={TaxiPlati} options={{title: 'Plati Taxi', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
          <Stack.Screen name="Revizor" component={Revizor} options={{headerLeft: null, title: 'Revizor', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
          <Stack.Screen name="StaniceRelacije" component={StaniceRelacije} options={{headerLeft: null, title: 'Stanice', headerStyle: {
            backgroundColor: '#3366CC',
          }, headerTintColor: 'white'}}/>
       </Stack.Navigator>
      </NavigationContainer>
  )
}