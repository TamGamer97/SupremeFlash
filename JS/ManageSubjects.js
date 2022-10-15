import React, {useEffect, useState, useRef} from 'react';
import { Text, View, Image, Platform, ScrollView, Animated, TouchableOpacity, TextInput } from 'react-native';
import { vh, vw } from 'react-native-expo-viewport-units';
import { useIsFocused } from "@react-navigation/native";

import { Picker } from "@react-native-picker/picker"

import FlipIcon from '../Files/flipIcon.png'
import removeIcon from '../Files/removebtn.png'
import { load, save } from './Functions';

export default function ManageSubjects({navigation})
{
    const isFocused = useIsFocused();

    const [colorBorder, setColorBorders] = useState([0,0,0,0,0,0])
    const eachColor = ['#C44E4E', '#304DBF', '#BFAC30', '#52C44E', 'orange', '#D544C6']

    const [thisSubject, setThisSubject] = useState(0)
    const [subjects, setSubjects] = useState([])
    const [subjectsColors, setSubjectsColors] = useState([])

    const [name, SetName] = useState('')

    useEffect(() => {
        load('subjectList')
            .then((sl) => {
                sl = JSON.parse(sl)

                var s = []
                var sc = []

                for (var x = 0; x < sl.length; x++)
                {
                    s.push(sl[x].name)
                    sc.push(sl[x].color)
                }
                
                setSubjects(s)
                setSubjectsColors(sc)
            })
        }, [isFocused])
        
        useEffect(() => {
            console.log('changed ' + thisSubject)
            SetName(thisSubject)
            
            let sc = 'a'
            var cb = [0, 0, 0, 0, 0, 0]

            for (var x = 0; x < subjects.length; x++)
            {
                if(subjects[x] == thisSubject)
                {
                    // console.log('found a')
                    sc = subjectsColors[x]
                    break
                }
            }
            
            // console.log(sc)

            for (var y = 0; y < eachColor.length; y++)
            {
                if(eachColor[y] == sc)
                {
                    cb[y] = 1
                }
            }

            // console.log(cb)

            setColorBorders(cb)
            
        }, [thisSubject])

    function deleteSubject()
    {
        load('subjectList')
            .then(sl => {
                sl = JSON.parse(sl)

                for (var x = 0; x < sl.length; x++)
                {
                    if(sl[x].name == thisSubject)
                    {
                        var filtered = sl.filter(function(el) { return el.name != thisSubject; })
                    }
                }

                console.log(filtered)
                save('subjectList', JSON.stringify(filtered))
                navigation.navigate('Home')
            })
    }

    function continueFunc()
    {
        load('subjectList')
            .then(sl => {
                sl = JSON.parse(sl)

                console.log(sl)
                for( var a = 0; a < sl.length; a++)
                {
                    if(sl[a].name == thisSubject)
                    {
                        sl[a].name = name
        
                        var newColor = ''
                        for (var x = 0; x < colorBorder.length; x++)
                        {
                            if(colorBorder[x] == 1)
                            {
                                newColor = eachColor[x]
                            }
                        }
        
                        sl[a].color = newColor
                        break
                    }
                }

                save('subjectList', JSON.stringify(sl))
                navigation.navigate('Flashcards')

            })
    }
        
    return(
        <View style={{backgroundColor: '#22252D', height: vh(100), width: vw(100)}}>
            <Text style={{color: '#46FFAF', fontSize: 30, fontWeight: 'bold', position: 'absolute', left: 30, top: 50}}>
                Manage Subjects
            </Text>
            <Text style={{color: '#46FFAF', fontSize: 15, fontWeight: 'bold', position: 'absolute', left: 30, top: 90}}>
                Manage your Subjects
            </Text>

            <View style={{display: 'flex', alignItems: 'center', top: 130}}>

                <Picker
                        selectedValue={thisSubject}
                        onValueChange={(value, index) => setThisSubject(value)}
                        mode="dropdown" // Android only
                        style={{width: vw(80), height:30, marginTop: 20, backgroundColor: '#2C303A', color: '#46FFAF', opacity: 1}}
                    >
                        <Picker.Item label="Select a Subject to Manage" value="Unknown" />
                        {
                            
                            subjects.map((s, ind) => {
                                if(s != 'UnkownIgnore')
                                {
                                    return(
                                        <Picker.Item label={s} value={s} />
                                    )
                                }
                            })
                        }
                </Picker>

                <TextInput value={name} onChangeText={SetName} style={{backgroundColor: '#2C303A', width: vw(80), color: 'white', height: 40, marginTop: 30, paddingLeft: 10, color: '#46FFAF'}} placeholderTextColor={'#46FFAF'} />
                
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => { {setColorBorders([1,0,0,0,0,0])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: '#C44E4E', borderWidth: colorBorder[0], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { {setColorBorders([0,1,0,0,0,0])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: '#304DBF', borderWidth: colorBorder[1], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { {setColorBorders([0,0,1,0,0,0])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: '#BFAC30', borderWidth: colorBorder[2], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { {setColorBorders([0,0,0,1,0,0])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: '#52C44E', borderWidth: colorBorder[3], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { {setColorBorders([0,0,0,0,1,0])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: 'orange', borderWidth: colorBorder[4], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { {setColorBorders([0,0,0,0,0,1])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: '#D544C6', borderWidth: colorBorder[5], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                </View>


                <View style={{display: 'flex', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {deleteSubject()}} style={{width: 170, height: 50, borderWidth: 1, borderColor: '#46FFAF', backgroundColor: '#2C303A', borderRadius: 10, position: 'relative', top: 30}}>
                        <Text style={{color: '#46FFAF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>Delete Subject</Text>
                    </TouchableOpacity>
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


            

        </View>
    )
}