import React, {useEffect, useState} from 'react';
import { Text, View, Image, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeIcon from './Files/homeicon.png'
import flashcardsicon from './Files/flashcardsicon.png'
import SettingsIcon from './Files/settingsicon.png'

import Home from './JS/Home'
import Flashcard from './JS/Flashcards'
import Settings from './JS/Settings'
import Attempt from './JS/Attempt'
import Create from './JS/Create'
import Manage from './JS/Manage'
import ManageSubjects from './JS/ManageSubjects'

// react navigator docs >>> https://reactnavigation.org/docs/tab-based-navigation/

const Tab = createBottomTabNavigator();

export default function App() {

  var mainColor = '#46FFAF';
  var bgColor = '#22252D';

  let MyTheme = {
    dark: false,
    colors: {
      primary: mainColor,
      background: mainColor,
      card: bgColor,
      text: mainColor,
      border: mainColor,
      notification: mainColor,
    },
  };

  function HomeFunction()
  {
      return <Home/>
  }

  function FlashcardsFunction({navigation})
  {
      return <Flashcard navigation={navigation}/>
  }

  function SettingsFunction({navigation})
  {
      return <Settings/>
  }

  function AttemptFunction({navigation})
  {
      return <Attempt navigation={navigation} />
  }

  function CreateFunction({navigation})
  {
      return <Create navigation={navigation} />
  }

  function ManageFunction({navigation})
  {
      return <Manage navigation={navigation} />
  }

  function ManageSubjectsFunction({navigation})
  {
      return <ManageSubjects navigation={navigation} />
  }

  return (
    <NavigationContainer theme={MyTheme} >
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeFunction} options={{ headerShown: false, tabBarIcon: ({ color, size, focused }) => (<Image style={[{width :25, height: 25, marginTop: 5}, focused ? {opacity: 1} : {opacity: 0.4}]} source={HomeIcon} />), }} />
        <Tab.Screen name="Flashcards" component={FlashcardsFunction} options={{ headerShown: false, tabBarIcon: ({ color, size, focused }) => (<Image style={[{width :25, height: 25, marginTop: 5}, focused ? {opacity: 1} : {opacity: 0.4}]} source={flashcardsicon} />),  }} />
        <Tab.Screen name="Settings" component={SettingsFunction} options={{ headerShown: false, tabBarIcon: ({ color, size, focused }) => (<Image style={[{width :25, height: 25, marginTop: 5}, focused ? {opacity: 1} : {opacity: 0.4}]} source={SettingsIcon} />),  }} />

        <Tab.Screen name="Attempt" component={AttemptFunction} options={{ tabBarStyle: { display: 'none' }, tabBarButton: (props) => null, tabBarShowLabel: false, headerShown: false}} />
        <Tab.Screen name="Create" component={CreateFunction} options={{ tabBarStyle: { display: 'none' }, tabBarButton: (props) => null, tabBarShowLabel: false, headerShown: false}} />
        <Tab.Screen name="Manage" component={ManageFunction} options={{ tabBarStyle: { display: 'none' }, tabBarButton: (props) => null, tabBarShowLabel: false, headerShown: false}} />
        <Tab.Screen name="ManageSubjects" component={ManageSubjectsFunction} options={{ tabBarStyle: { display: 'none' }, tabBarButton: (props) => null, tabBarShowLabel: false, headerShown: false}} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}