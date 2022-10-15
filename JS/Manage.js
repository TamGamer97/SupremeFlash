import React, {useEffect, useState, useRef} from 'react';
import { Text, View, Image, Platform, ScrollView, Animated, TouchableOpacity, TextInput } from 'react-native';
import { vh, vw } from 'react-native-expo-viewport-units';
import { useIsFocused } from "@react-navigation/native";

import FlipIcon from '../Files/flipIcon.png'
import removeIcon from '../Files/removebtn.png'
import { load, save } from './Functions';

export default function Manage({navigation})
{
    const isFocused = useIsFocused();

    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)
    const animate = useRef(new Animated.Value(0));
    const [isFlipped, setisFlipped] = useState(false)
    const [DisplayNoneStyle, setDisplayNoneStyle] = useState(true)

    const handleFlip = () => {
        // console.log(subjectList[subject].sets[setInd].cards[currentCard])
        Animated.timing(animate.current, {
            duration: 300,
            toValue: isFlipped ? 0 : 180,
            useNativeDriver: true,
        }).start(() => { // on animation is done
            setisFlipped(!isFlipped)
            setDisplayNoneStyle(!DisplayNoneStyle)
        });
    }
    
    useEffect(() => {
        console.log(DisplayNoneStyle)
    }, [DisplayNoneStyle])

    const interpolateFront = animate.current.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg']
    })

    const interpolateBack = animate.current.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg']
    })


    const [cardList, setCardsList] = useState(
        JSON.stringify(
        [
            {question: 'Density Formula', answer: 'Mass/Volume'},
            {question: 'Density Formula 2', answer: 'Mass/Volume 2'},
        ],
        )
    )
    const [name, updateName] = useState('Set')
    const [colorBorder, setColorBorders] = useState([0,0,0,0,0,0])
    const eachColor = ['red', '#304DBF', '#BFAC30', '#52C44E', 'orange', '#D544C6']

    useEffect(() => {
        console.log('Starting Managing')

        load('current')
            .then((data) => {
                data = JSON.parse(data)
                updateName(data[0])
                setColorBorders([0,0,0,0,0,0])

                console.log(data)

                let clrInd = 0
                eachColor.map((c, ind) => {
                    if(c == data[1])
                    {
                        clrInd = ind
                    }
                })

                var bc = colorBorder
                bc[clrInd] = 1
                console.log(clrInd)
                console.log(bc)
                setColorBorders(bc)

                setCardsList(JSON.stringify(data[2]))

            })

    }, [isFocused])

    async function continueFunc()
    {
        console.log('Done')
        
        let sl = await load('subjectList')
        let current = await load('current')
        
        sl = JSON.parse(sl)
        current = JSON.parse(current)
        
        var subject = current[3]
        var setInd = current[4]

        console.log(sl)
        sl[subject].sets[setInd].cards = JSON.parse(cardList)
        sl[subject].sets[setInd].score = 0
        sl[subject].sets[setInd].name = name
        
        var colorVar = ''
        colorBorder.map((c, ind) => {if (c == 1) {colorVar = eachColor[ind]} })
        sl[subject].color = colorVar

        save('subjectList', JSON.stringify(sl))

        navigation.navigate('Flashcards')
    }

    function removeCard(ind)
    {
        var cl = JSON.parse(cardList)

        console.log('removing ' + cl[ind].question)

        cl.splice(ind, 1)

        setCardsList(JSON.stringify(cl))

    }

    function createCard()
    {
        console.log('Creating Card')
        var cl = JSON.parse(cardList)
        cl.push({question: '', answer: ''})

        setCardsList(JSON.stringify(cl))
    }

    async function deleteSet()
    {
        let sl = await load('subjectList')
        let current = await load('current')
        
        sl = JSON.parse(sl)
        current = JSON.parse(current)
        
        var subject = current[3]
        var setInd = current[4]

        sl[subject].sets.splice(setInd, 1)

        save('subjectList', JSON.stringify(sl))

        navigation.navigate('Flashcards')
    }

    return(
        <View style={{backgroundColor: '#22252D', height: vh(100), width: vw(100)}}>
            <Text style={{color: '#46FFAF', fontSize: 30, fontWeight: 'bold', position: 'absolute', left: 30, top: 50}}>
                Manage
            </Text>
            <Text style={{color: '#46FFAF', fontSize: 15, fontWeight: 'bold', position: 'absolute', left: 30, top: 90}}>
                Remove, Edit or Create Cards for your set!
            </Text>

            <View style={{height: vh(80), position: 'relative', top: 120, display: 'flex'}}>

                <ScrollView contentContainerStyle={{position: 'relative', top: 10, display: 'flex', alignItems: 'center', flexGrow: 1}}>
                
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{width: vw(70), height: 50, backgroundColor: '#2C303A', marginTop: 20, borderRadius: 5, left: 0, flexDirection: 'row'}}>
                        <TextInput value={name} onChangeText={(value) => { updateName(value) }} placeholderTextColor={'white'} style={{padding: 10, backgroundColor: '#2C303A', width: vw(65), height: 50, fontSize: 20, color: 'white', fontWeight: 'bold'}} placeholder={'Set Name'} ></TextInput>
                    </View>
                    <TouchableOpacity onPress={() => {deleteSet()}} style={{backgroundColor: 'transparent', width: 40, height: 40, position: 'relative', right: -5, top: 25, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{width: 25, height: 25, backgroundColor: 'transparent'}} source={removeIcon} />
                    </TouchableOpacity>
                </View>

                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => { {setColorBorders([1,0,0,0,0,0])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: '#C44E4E', borderWidth: colorBorder[0], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { {setColorBorders([0,1,0,0,0,0])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: '#304DBF', borderWidth: colorBorder[1], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { {setColorBorders([0,0,1,0,0,0])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: '#BFAC30', borderWidth: colorBorder[2], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { {setColorBorders([0,0,0,1,0,0])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: '#52C44E', borderWidth: colorBorder[3], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { {setColorBorders([0,0,0,0,1,0])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: 'orange', borderWidth: colorBorder[4], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                    <TouchableOpacity onPress={() => { {setColorBorders([0,0,0,0,0,1])}}} style={{opacity: 1, width: 30, height: 30, backgroundColor: '#D544C6', borderWidth: colorBorder[5], borderColor: 'white', marginTop: 30, marginLeft: 10, marginRight: 10, borderRadius: 50}}></TouchableOpacity>
                </View>

                    {JSON.parse(cardList).map((c, ind) => {
                        var cl = JSON.parse(cardList)[ind]
                        return(
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                    <Animated.View style={{transform: [{ rotateY: interpolateFront}], backfaceVisibility: 'hidden', width: vw(70), height: 50, backgroundColor: '#323744', marginTop: 20, borderRadius: 5}}>
                                        <TextInput value={cl.question} onChangeText={(value) => { let temp = JSON.parse(cardList); temp[ind].question = value; setCardsList(JSON.stringify(temp)) }} placeholderTextColor={'white'} style={{padding: 10, backgroundColor: '#2C303A', width: vw(55), height: 50, fontSize: 20, color: 'white', fontWeight: 'bold'}} placeholder={'Enter a Question'} ></TextInput>
                                        <TouchableOpacity onPress={handleFlip} style={{backgroundColor: 'transparent', width: 50, height: 50, position: 'absolute', right: 0, top: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <Image style={{width: 30, height: 30, backgroundColor: 'transparent'}} source={FlipIcon} />
                                        </TouchableOpacity>
                                    </Animated.View>
                                    <TouchableOpacity onPress={() => {removeCard(ind)}} style={{backgroundColor: 'transparent', width: 40, height: 40, position: 'relative', right: -5, top: 25, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <Image style={{width: 25, height: 25, backgroundColor: 'transparent'}} source={removeIcon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <Animated.View style={{ display: DisplayNoneStyle ? 'none' : 'flex', transform: [{ rotateY: interpolateBack}], backfaceVisibility: 'hidden', width: vw(70), height: 50, backgroundColor: '#323744', borderRadius: 5, marginTop: -50}}>
                                        <TextInput value={cl.answer} onChangeText={(value) => { let temp = JSON.parse(cardList); temp[ind].answer = value; setCardsList(JSON.stringify(temp)) }} placeholderTextColor={'white'} style={{padding: 10, backgroundColor: '#2C303A', width: vw(55), height: 50, fontSize: 20, color: 'white', fontWeight: 'bold'}} placeholder={'Enter an Answer'} ></TextInput>
                                        <TouchableOpacity onPress={handleFlip} style={{backgroundColor: 'transparent', width: 50, height: 50, position: 'absolute', right: 0, top: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <Image style={{width: 30, height: 30, backgroundColor: 'transparent'}} source={FlipIcon} />
                                        </TouchableOpacity>
                                    </Animated.View>
                                </View>
                            </View>
                        )
                    })}
                    <View style={{flexDirection: 'row'}}>
                        <Animated.View style={{transform: [{ rotateY: interpolateFront}], backfaceVisibility: 'hidden', width: vw(70), height: 20, backgroundColor: 'transparent', marginTop: 20, borderRadius: 5}}>
                            
                        </Animated.View>
                    </View>
                </ScrollView>

                <View style={{display: 'flex', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {createCard()}} style={{width: 140, height: 50, borderWidth: 1, borderColor: '#46FFAF', backgroundColor: '#2C303A', borderRadius: 10, position: 'relative', top: 30}}>
                        <Text style={{color: '#46FFAF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>Create Card</Text>
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