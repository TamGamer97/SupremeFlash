import React, {useEffect, useState, useRef} from 'react';
import { Text, View, Image, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { vh, vw } from 'react-native-expo-viewport-units';
import { useIsFocused } from "@react-navigation/native";

import manageIcon from '../Files/manageicon.png'
import createSetBtn from '../Files/createbtn.png'
import manageSubejctIcon from '../Files/manageSubjectIcon.png'

import {save, load, clearAll} from '../JS/Functions'

export default function Flashcards({navigation})
{
    const isFocused = useIsFocused();

    const scrollViewRef = useRef(null);

    const [subject, setSubject] = useState(0)
    const [subjectList, updateSubjectList] = useState([ // just a template. Every time set clicks it updates
        {
            name:'Physics', color: 'red', key: 0, sets:
            [
                {name: 'P1 - Matter', score: 0, cards: [ {question: 'Density Formula', answer: 'Mass/Volume'}, {question: 'Density Formula 2', answer: 'Mass/Volume 2'}, {question: 'Density Formula 3', answer: 'Mass/Volume 3'}  ] }
            ]
        },
        {
            name:'Chemistry', color: 'orange', key: 1, sets:
            [
                {name: 'C1 - Topic Name', score: 0, cards: [ {question: 'Density Formula', answer: 'Mass/Volume'} ] }
            ]
        },
        {
            name:'Biology', color: 'green', key: 2, sets:
            [
                {name: 'B1 - Topic Name', score: 0, cards: [ {question: 'Density Formula', answer: 'Mass/Volume'} ] }
            ]
        },
        {
            name:'Maths', color: 'blue', key: 3, sets:
            [
                {name: 'Algebra', score: 0, cards: [ {question: 'Density Formula', answer: 'Mass/Volume'} ] }
            ]
        },
    ])
    const [yOffsetSubject, setYOffsetSubject] = useState(0)

    const [setsCount, setSetsCount] = useState(0)
    const [cardsCount, setCardsCount] = useState(0)

    const [dotDisplay, setDotDisplay] = useState('flex')
    useEffect(() => {
        
        load('subjectList')
            .then((sl) => {
                
                // console.log(JSON.parse(sl).length)
                if(JSON.parse(sl).length <= 1)
                {
                    setDotDisplay('none')
                }else{
                    setDotDisplay('flex')
                }
                updateSubjectList(JSON.parse(sl))
            
                    // console.log('useffect home page')
                    // console.log(sl)

                    var setCount = 0
                    var cardsCount = 0

                    sl = JSON.parse(sl)
                    for (var x = 0; x < sl.length; x++)
                    {
                        setCount += sl[x].sets.length
                        for(var y = 0; y < sl[x].sets.length; y++)
                        {
                            cardsCount += sl[x].sets[y].cards.length
                        }
                    }

                    // console.log(setCount)
                    setSetsCount(setCount)
                    setCardsCount(cardsCount)

                })
    }, [isFocused])

    function attemtpSet(ind)
    {
        if (subjectList[subject].sets[ind].cards.length > 0)
        {
            save('current', JSON.stringify([subject, ind]))
            navigation.navigate('Attempt')
        }else{
            console.log('No cards in set')
            save('current', JSON.stringify([subjectList[subject].sets[ind].name, subjectList[subject].color, subjectList[subject].sets[ind].cards, subject, ind]))
            navigation.navigate('Manage')
        }
    }
    
    const SetCard = ({subjectInfo, ind}) => {
        return (
            <View style={{width: vw(100), height: 150, display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 30}} >
                <View style={{width: vw(80), height: 150, borderRadius: 10, backgroundColor: '#22252D', marginTop: 10, shadowColor: /*subjectList[subject].color*/ 'black' , shadowOffset: {width: 0,height: -100,},shadowOpacity: 0.43,shadowRadius: 9.51,elevation: 15,}}>
                    <Text style={{color: 'white', fontSize: 20, marginTop: 15, marginLeft: 20, fontWeight: 'bold'}} >{subjectInfo.name}</Text>
                    <Text style={{color: 'white', fontSize: 12, marginTop: 0, marginLeft: 20, fontWeight: 'bold', opacity: 0.5}} >{subjectInfo.score}/{subjectInfo.cards.length} Done</Text>

                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => { attemtpSet(ind) }} style={{width: vw(48), height: 30, backgroundColor: '#2C303A', marginTop: 40, marginRight: 2}}>
                                <Text style={{color: 'white', fontSize: 13, marginTop: 5, textAlign: 'center', fontWeight: 'bold'}} >Attempt</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {save('current', JSON.stringify([subjectList[subject].sets[ind].name, subjectList[subject].color, subjectList[subject].sets[ind].cards, subject, ind])); navigation.navigate('Manage')}} style={{width: vw(8), height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#2C303A', marginTop: 40, marginLeft: 2}}>
                                <Image style={{width: 15, height: 15}} source={manageIcon} ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        )
    }

    useEffect(() => {
        // console.log(yOffsetSubject)
        if(yOffsetSubject < 90)
        {
            scrollViewRef.current.scrollTo({x: 90, y: 0, animated: false})
        }
        if(yOffsetSubject < 200) // first subject
        {
            if(subjectList.length > 1)
            {
                if(subjectList[0].name == 'UnkownIgnore')
                {
                    setSubject(1)
                }else{
                    setSubject(0)
                }
            }

        }
        if(yOffsetSubject > 200 & yOffsetSubject < 400) // second subject
        {
            setSubject(2)
        }
        if(yOffsetSubject > 400 & yOffsetSubject < 600) // third subject
        {
            setSubject(3)
        }
        if(yOffsetSubject > 600 & yOffsetSubject < 800) // forth subject
        {
            setSubject(4)
        }
        if(yOffsetSubject > 800 & yOffsetSubject < 1000) // forth subject
        {
            setSubject(5)
        }

        // console.log(subjectList[subject].name)

    }, [yOffsetSubject])
    

    return(
        <View style={{position: 'absolute', backgroundColor: '#22252D', height: vh(100), width: vw(100), display: 'flex', alignItems: 'center'}}>

            <Text style={{color: '#46FFAF', fontSize: 30, fontWeight: 'bold', position: 'absolute', left: 30, top: 50}}>
                Flashcards
            </Text>
            <Text style={{color: '#46FFAF', fontSize: 15, fontWeight: 'bold', position: 'absolute', left: 30, top: 90}}>
                {setsCount - 1} Sets, {cardsCount} Cards
            </Text>

            <TouchableOpacity onPress={() => {navigation.navigate('ManageSubjects')}} style={{position: 'absolute', right: 30, top: 60}}>
                <Image style={{width: 40, height: 40}} source={manageSubejctIcon} />
            </TouchableOpacity>

            <ScrollView
                horizontal // Change the direction to horizontal
                pagingEnabled // Enable paging
                decelerationRate={0} // Disable deceleration
                snapToInterval={180} // Calculate the size for a card including marginLeft and marginRight
                snapToAlignment='center' // Snap to the center
                showsHorizontalScrollIndicator={false}
                contentInset={{ // iOS ONLY
                top: 0,
                left: 180 * 0.1 -10, // Left spacing for the very first card
                bottom: 0,
                right: 180 * 0.1 -10 // Right spacing for the very last card
                }}
                contentContainerStyle={{ // contentInset alternative for Android
                paddingHorizontal: Platform.OS === 'android' ? 180 * 0.1 - 10 : 0 // Horizontal spacing before and after the ScrollView
                
                }}
                style={{position: 'relative', top: 130, height: 100}}
                onScroll={(event) => {
                    // console.log('scroll ', event.nativeEvent.contentOffset.x)
                    setYOffsetSubject(event.nativeEvent.contentOffset.x)
                }}
                ref={scrollViewRef}
                >
                <View style={{width: 160, height: 50, marginRight: 10, marginLeft: 10, backgroundColor: 'transparent'}}>
                    <Text style={{textAlign: 'center', color: 'transparent', fontSize: 25, marginTop: 5}}>Physics</Text>
                </View>

                {subjectList.map( s => {
                    if(s.name != 'UnkownIgnore')
                    {
                        var opac = 0.3
                        // console.log(subjectList[subject].name)
                        if(s.name == subjectList[subject].name) {opac = 1}
                        return (
                            <View style={{width: 160, height: 40, marginTop: 20, opacity: opac, marginRight: 10, marginLeft: 10, backgroundColor: '#2B2E37', borderWidth: 0, borderRadius: 10,  borderColor: 'red', flex: 1, flexDirection: 'row', display: 'flex', justifyContent: 'center', shadowColor: subjectList[subject].color, shadowOffset: {width: 0,height: -100,},shadowOpacity: 0.43,shadowRadius: 9.51,elevation: 15,}}>
                                <Text style={{textAlign: 'center', color: 'white', fontSize: 25, marginTop: 2, backgroundColor: 'transparent'}}>{s.name}</Text>
                            </View>
                        )
                    }
                } )}


                <View style={{width: 110, height: 50, backgroundColor: 'transparent'}}>
                    <Text style={{textAlign: 'center', color: 'transparent', fontSize: 25, marginRight: 20, marginTop: 5}}>Physics</Text>
                </View>
            </ScrollView>

            <ScrollView style={{position: 'relative', top: 160}} contentContainerStyle={{flexGrow: 1}}>
                
                {
                    subjectList[subject].sets.map((set, ind) => {
                        // console.log(set)
                        if(subjectList.length > 1)
                        {
                            return(
                                <SetCard subjectInfo={set} ind={ind} />
                                
                            )
                        }
                    })
                }
                {/* <SetCard name={'P2 - Whatevr'} /> 
                <SetCard name={'P3 - Ding Dong'} />
                <SetCard name={'P4 - ANother one'} /> */}

                <View style={{width: vw(100), height: 250, display: 'flex', alignItems: 'center', position: 'relative', marginTop: 30}} >
                    <View style={{width: vw(80), height: 150, borderRadius: 10, backgroundColor: '#22252D', marginTop: 10, shadowColor: "transparent", shadowOffset: {width: 0,height: -100,},shadowOpacity: 0.43,shadowRadius: 9.51,elevation: 15,}}>

                    </View>
                </View>
                    
            </ScrollView>

            <View style={{position: 'relative', display: dotDisplay, justifyContent: 'center', position: 'absolute'}}> 
                <View style={{width: 7, height: 7, backgroundColor: 'white', position: 'relative', top: 210, borderRadius: 50, marginLeft: 15}}></View>
            </View>

            <TouchableOpacity onPress={() => {navigation.navigate('Create')}} style={{position: 'absolute', bottom: 70, right: 20}}>
                <Image source={createSetBtn} style={{width: 65, height: 65, borderWidth: 3, borderColor: '#2C303A', borderRadius: 90}} />
            </TouchableOpacity>

        </View>
    )
}