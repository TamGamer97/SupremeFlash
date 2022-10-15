import React, {useEffect, useState} from 'react';
import { Text, View, Image, Platform, TouchableOpacity } from 'react-native';
import { vh, vw } from 'react-native-expo-viewport-units';

export default function Settings()
{

    const Tab = ({name, value, func, opac=1}) => {
        return(
            <TouchableOpacity onPress={() => {func()}} style={{width: vw(85), height: 40, backgroundColor: '#2C303A', marginBottom: 10, opacity: opac}}>
                <Text style={{color: 'white', fontWeight:'bold', marginTop: 10, left: 10}}>{name}</Text>
                <Text style={{color: 'white', fontWeight:'bold', marginTop: 10, right: 10, position: 'absolute'}}>{value}</Text>
            </TouchableOpacity>
        )
    }

    return(
        <View style={{backgroundColor: '#22252D', height: vh(100), width: vw(100), display: 'flex', alignItems: 'center'}}>
            <Text style={{color: '#46FFAF', fontSize: 30, fontWeight: 'bold', position: 'absolute', left: 30, top: 50}}>
                Settings
            </Text>
            <Text style={{color: '#46FFAF', fontSize: 15, fontWeight: 'bold', position: 'absolute', left: 30, top: 90}}>
                Adjust / Manage Your App
            </Text>
            <Text style={{opacity: 0.5, color: '#46FFAF', fontSize: 15, fontWeight: 'bold', position: 'absolute', bottom: 70, textAlign: 'center'}}>
                App Version: v1.1
            </Text>

            <View style={{position: 'relative', top: 130}}>
                <Tab func={() => {console.log('hello')}} name={'Notifications'} value={'OFF'} />
                <Tab func={() => {console.log('hello')}} name={'Check for Updates'} />
                <Tab func={() => {console.log('hello')}} name={'Clear ALL Data'} />

                <Tab func={() => {console.log('hello')}} name={'Theme'} value={'Coming Soon'} opac={0.5} />
                <Tab func={() => {console.log('hello')}} name={'Export/Import Data'} value={'Coming Soon'} opac={0.5} />
                <Tab func={() => {console.log('hello')}} name={'Attempt Timer'} value={'Coming Soon'} opac={0.5} />
            </View>



        </View>
    )
}