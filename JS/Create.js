import React, {useEffect, useState} from 'react';
import { Text, View, Image, Platform,TouchableOpacity, TextInput } from 'react-native';
import { vh, vw } from 'react-native-expo-viewport-units';
import { useIsFocused } from "@react-navigation/native";

import { Picker } from "@react-native-picker/picker"

import {save, load, clearAll} from '../JS/Functions'

export default function Create({navigation})
{
    const isFocused = useIsFocused();

    const [opac, setOpac] = useState([0.3, 1])
    const [colorBorder, setColorBorders] = useState([1,0,0,0,0,0])
    const eachColor = ['red', '#304DBF', '#BFAC30', '#52C44E', 'orange', '#D544C6']
    const [subjects, setSubject] = useState([])
    const [thisSubject, setThisSubject] = useState()
    const [name, SetName] = useState('')

    const [pickerOpac, setPickerOpac] = useState(1)
    const [pickerEnabled, setPickerEnabled] = useState(true)
    const [colorOpac, setColorsOpac] = useState(0.3)

    useEffect(() => {
        console.log(name)
    }, [name])

    useEffect(() => {
        setColorBorders([1,0,0,0,0,0])
    },[isFocused])

    // useEffect(() => {

    //     load('subjectList')
    //         .then((sl) => {
    //             sl = JSON.parse(sl)

    //             let newS = subjects
    //             sl.map(s => {
    //                 newS.push(s.name)
    //                 console.log(s.name)
    //             })
    //             setSubject(newS)

    //             // console.log(subjects)
    //         })
    // }, [])

    useEffect(() => {
        if(opac[0] == 1) // subject is choosen
        {
            setPickerEnabled(false)
            setPickerOpac(0.3)
            setColorsOpac(1)
        }else{ // set choosen
            setPickerEnabled(true)
            setPickerOpac(1)
            setColorsOpac(0.3)

            load('subjectList')
                .then((sl) => {
                    sl = JSON.parse(sl)
                    let newList = []
                    sl.map(s => {
                        newList.push(s.name)
                    })

                    setSubject(newList)
                })
        }
    }, [opac])

    async function continueFunc()
    {
        console.log('Continueing')

        SetName('')

        let isSubject = false 
        if(opac[0] == 1 ) {isSubject = true}
        const theName = name
        const choosenSubject = thisSubject
        let color = ''
        colorBorder.map((c, ind) => {if (c == 1) {color = eachColor[ind]} })

        let subjectList = await load('subjectList')

        subjectList = JSON.parse(subjectList)

        if(isSubject)
        {
            subjectList.push( {name: theName, color: color, key: subjectList.length, sets:[] })
        }else{
            console.log(name)
            subjectList[choosenSubject].sets.push(
                {name: theName, score: 0, cards: [] }
            )
            console.log(subjectList[choosenSubject])
        }

        console.log('Done')
        save('subjectList', JSON.stringify(subjectList))

        navigation.navigate('Flashcards')
    }

    return(
        <View style={{backgroundColor: '#22252D', height: vh(100), width: vw(100)}}>
            <Text style={{color: '#46FFAF', fontSize: 30, fontWeight: 'bold', position: 'absolute', left: 30, top: 50}}>
                Create:
            </Text>
            <Text style={{color: '#46FFAF', opacity: 0.7, fontSize: 15, fontWeight: 'bold', position: 'absolute', left: 30, top: 90}}>
                Choose what to Create
            </Text>
            <View style={{display: 'flex', alignItems: 'center'}}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => {setOpac([1, 0.3])}} style={{opacity: opac[0], width: vw(40), marginRight: 5, height: 50, backgroundColor: '#2C303A', marginTop: 120}}>
                        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>Subject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setOpac([0.3, 1])}} style={{opacity: opac[1], width: vw(40), marginLeft: 5, height: 50, backgroundColor: '#2C303A', marginTop: 120}}>
                        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>Set (Cards)</Text>
                    </TouchableOpacity>
                </View>

                <TextInput placeholder='Name' value={name} onChangeText={SetName} style={{backgroundColor: '#2C303A', width: vw(80), color: 'white', height: 40, marginTop: 30, paddingLeft: 10, color: '#46FFAF'}} placeholderTextColor={'#46FFAF'} />
                
                <Picker
                    enabled={pickerEnabled}
                    selectedValue={thisSubject}
                    onValueChange={(value, index) => setThisSubject(value)}
                    mode="dropdown" // Android only
                    style={{width: vw(80), height:30, marginTop: 20, backgroundColor: '#2C303A', color: '#46FFAF', opacity: pickerOpac}}
                >
                    <Picker.Item label="Select a Subject for this Set" value="Unknown" />
                    {
                        
                        subjects.map((s, ind) => {
                            if(s != 'UnkownIgnore')
                            {
                                return(
                                    <Picker.Item label={s} value={ind} />
                                )
                            }
                        })
                    }
                </Picker>

                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => { if(opac[0] == 1) {setColorBorders([1,0,0,0,0,0])}}} style={{opacity: colorOpac, width: 30, height: 30, backgroundColor: '#C44E4E', borderWidth: colorBorder[0], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { if(opac[0] == 1) {setColorBorders([0,1,0,0,0,0])}}} style={{opacity: colorOpac, width: 30, height: 30, backgroundColor: '#304DBF', borderWidth: colorBorder[1], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { if(opac[0] == 1) {setColorBorders([0,0,1,0,0,0])}}} style={{opacity: colorOpac, width: 30, height: 30, backgroundColor: '#BFAC30', borderWidth: colorBorder[2], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { if(opac[0] == 1) {setColorBorders([0,0,0,1,0,0])}}} style={{opacity: colorOpac, width: 30, height: 30, backgroundColor: '#52C44E', borderWidth: colorBorder[3], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { if(opac[0] == 1) {setColorBorders([0,0,0,0,1,0])}}} style={{opacity: colorOpac, width: 30, height: 30, backgroundColor: 'orange', borderWidth: colorBorder[4], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { if(opac[0] == 1) {setColorBorders([0,0,0,0,0,1])}}} style={{opacity: colorOpac, width: 30, height: 30, backgroundColor: '#D544C6', borderWidth: colorBorder[5], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                </View>


            </View>
                
            <View style={{display: 'flex', alignItems: 'center'}}>
                <View style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => {navigation.navigate('Flashcards')}} style={{width: 140, marginRight: 10, height: 50, borderWidth: 1, borderColor: '#46FFAF', backgroundColor: '#2C303A', borderRadius: 10, marginTop: 50}}>
                        <Text style={{color: '#46FFAF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {continueFunc()}} style={{width: 140, marginLeft: 10, height: 50, borderWidth: 1, borderColor: '#46FFAF', backgroundColor: '#2C303A', borderRadius: 10, marginTop: 50}}>
                        <Text style={{color: '#46FFAF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}