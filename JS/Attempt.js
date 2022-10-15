import React, {useEffect, useState, useRef} from 'react';
import { Text, View, Image, TouchableOpacity, Platform, Animated, Button, TextInput } from 'react-native';
import { vh, vw } from 'react-native-expo-viewport-units';
import { useIsFocused } from "@react-navigation/native";

import rightBtn from '../Files/rightBtn.png'
import wrongBtn from '../Files/wrongBtn.png' 
import editIcon from '../Files/editicon.png'

import {save, load, clearAll} from '../JS/Functions'

export default function Attempt({navigation})
{
    const isFocused = useIsFocused();

    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)
    const animate = useRef(new Animated.Value(0));
    const [isFlipped, setisFlipped] = useState(false)

    const [tiEnabled, setTIenabled] = useState(false)

    const handleFlip = () => {
        console.log(newAnswer)
        if(newAnswer != '')
        {
            try{
                subjectList[subject].sets[setInd].cards[currentCard].answer = newAnswer
                setAnswer(newAnswer)
            }catch{

            }
        }
        if(newQuestion != '')
        {
            try{
                subjectList[subject].sets[setInd].cards[currentCard].question = newQuestion
                setQuestion(newQuestion)
            }catch{

            }
        }
        setSubjectList(subjectList)
        // setQuestion(subjectList[subject].sets[setInd].cards[currentCard].question)
        // setAnswer(subjectList[subject].sets[setInd].cards[currentCard].answer)
    
        // console.log(subjectList[subject].sets[setInd].cards[currentCard])
        Animated.timing(animate.current, {
            duration: 300,
            toValue: isFlipped ? 0 : 180,
            useNativeDriver: true,
        }).start(() => { // on animation is done
            setisFlipped(!isFlipped)
            
        });
    }

    const interpolateFront = animate.current.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg']
    })

    const interpolateBack = animate.current.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg']
    })

    const [currentCard, setCurrentCard] = useState(0)
    const [correctCount, incrCorrectCount] = useState(0)
    const [subject, setSubject] = useState(0)
    const [setInd, setSETInd] = useState(0)
    const [subjectList, setSubjectList] = useState([ // just a template. Every time set clicks it updates
        {
            name:'Physics', color: 'red', key: 0, sets:
            [
                {name: 'P1 - Matter', score: 0, cards: [ {question: '...', answer: 'Mass/Volume'}, {question: 'Fake Density Formula 2', answer: 'Mass/Volume 2'}, {question: 'Density Formula 3', answer: 'Mass/Volume 3'}  ] }
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

    var basicColors = {red: '#C44E4E', blue: '#304DBF', yellow: '#BFAC30', green: '#52C44E', orange: 'orange', purple: '#D544C6', cyan: '#44D5C6'}

    const [question, setQuestion] = useState('...')
    const [answer, setAnswer] = useState('...')
    const [cardColors, setCardColors] = useState([basicColors['red'], basicColors['blue'], basicColors['yellow']])
    const [FinishedSet, SetFinishedSet] = useState(false)

    const questionInp = useRef(null)
    const answerInp = useRef(null)

    let newQuestion = ''
    let newAnswer = ''

    useEffect(() => {
        newQuestion = question
        newAnswer = answer
    }, [question, answer])

    function nextCard(isright)
    {
        // console.log('helllo ' + subject)
        // console.log(questionInp)

        setTIenabled(false)

        if(question != newQuestion & newQuestion != '')
        {
            console.log('Question must be updated')
            subjectList[subject].sets[setInd].cards[currentCard].question = newQuestion
        }

        if(answer != newAnswer & newAnswer != '')
        {
            console.log('Answer must be updated')
            subjectList[subject].sets[setInd].cards[currentCard].answer = newAnswer
        }

        setCurrentCard(prev => prev + 1)
        if(isright == true)
        {
            incrCorrectCount(correctCount + 1)
        }
        
        if(currentCard == subjectList[subject].sets[setInd].cards.length - 1)
        {
            SetFinishedSet(true)
            return
        }

        if(isFlipped)
        {
            handleFlip()
        }

        const qna = subjectList[subject].sets[setInd].cards[currentCard + 1]
        
        try{
            setQuestion(qna.question)
            if(isFlipped)
            {
                setTimeout(() => {
                    console.log('answer set')
                    setAnswer(qna.answer)
                }, 300);
            }else{
                console.log('what about this')
                setAnswer(qna.answer)
            }
        }catch{
        }
        
        // setAnswer(qna.answer)

        var newColor = ''

        for (var x = 0; newColor == ''; x++)
        {
            var randNum = Math.floor(Math.random() * (Object.values(basicColors).length - 1))
            var c = Object.values(basicColors)[randNum] 
            // console.log(randNum)
            if (c != cardColors[1] && c != cardColors[2])
            {
                newColor = c
            }
        }

        setCardColors([cardColors[1], cardColors[2], c])
    }
    const [topicName, setTopicName] = useState('')
    useEffect(() => {
        
        setTopicName('...')
        setQuestion('...')

        load('current')
            .then(current => {
                
                current = JSON.parse(current)

                console.log('current: ')
                console.log(current)
                
                setTIenabled(false)
            
                load('subjectList')
                    .then(sl => {
                        // console.log(sl)
                        sl = JSON.parse(sl)
                        setSubjectList(sl)

                        setTopicName(sl[current[0]].sets[current[1]].name)

                        if(isFlipped)
                        {
                            handleFlip()
                        }
                
                        const qna = sl[current[0]].sets[current[1]].cards[currentCard]
                        
                        try{
                            console.log('this one')
                            setQuestion(qna.question)
                            setAnswer(qna.answer)
                        }catch{
                        }
                        
                        SetFinishedSet(false)
                        setCurrentCard(0)
                        incrCorrectCount(0)
                        
                        setSubject(current[0])
                        setSETInd(current[1])
                    })
            })
    

    }, [isFocused])

    function continueFunc()
    {
        // console.log('finished ' + correctCount)
        subjectList[subject].sets[setInd].score = correctCount

        // console.log('from Attempt:')
        // console.log(subjectList[subject])

        load('stats')
            .then(stats => {
                stats = JSON.parse(stats)

                // console.log(stats[1].Challenges[0]['Daily Progress'])

                stats[1].Challenges[1]['Complete 1000 Attempts'] = ((((stats[1].Challenges[1]['Complete 1000 Attempts'] / 100) * 1000) + 1) / 1000) * 100
                stats[1].Challenges[0]['Daily Progress'] = (( ((stats[1].Challenges[0]['Daily Progress'] / 100) * subjectList[subject].sets.length) + 1) / subjectList[subject].sets.length) * 100
                
                if(stats[1].Challenges[0]['Daily Progress'] > 100)
                {
                    stats[1].Challenges[0]['Daily Progress'] = 100
                }

                console.log(JSON.stringify(stats[1]))

                save('stats', JSON.stringify(stats))
                
            })

        setQuestion('...')

        save('subjectList', JSON.stringify(subjectList))
    }

    const Display = () => {
        if(!FinishedSet)
        {
            return(
                <View style={{backgroundColor: '#22252D', height: vh(100), width: vw(100), display: 'flex', alignItems: 'center'}}>
    
                <View style={{width: vw(85), height: 50, borderRadius: 10, backgroundColor: '#22252D', display: 'flex', alignItems: 'center', flexDirection: 'row', marginTop: 40, shadowColor: subjectList[subject].color, shadowOffset: {width: 0,height: -100,},shadowOpacity: 0.43,shadowRadius: 9.51,elevation: 15,}}>
                    <Text onPress={() => {navigation.navigate('Flashcards') }} style={{color: 'white', fontSize: 20, marginTop: -3, marginLeft: 20, fontWeight: 'bold'}}>←  {topicName}</Text>
                    <Text style={{color: 'white', fontSize: 12, marginTop: 1, position: 'absolute', right: 20, fontWeight: 'bold', opacity: 0.5}} >{currentCard}/{subjectList[subject].sets[setInd].cards.length} Done</Text>
                </View>
    
                <View style={{position: 'absolute', top: 0, left: 60,  width: vw(78), height: 460, top: 140, borderRadius: 10, backgroundColor: cardColors[2], display: 'flex', alignItems: 'center'}}>
                    
                    <Text style={{fontSize: 15, color: 'white', position: 'absolute', marginTop: 10, textAlign: 'center', opacity: 0.5}}>Question</Text>
    
                        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500}}>
                            <Text style={{fontSize: 25, color: 'white', fontWeight: 'bold'}}>Next Card!</Text>
                        </View>
                
                    <Text style={{fontSize: 15, color: 'white', position: 'absolute', bottom: 10, textAlign: 'center', opacity: 0.5}}>Tap to Flip</Text>
                
                </View>
                <View style={{position: 'absolute', top: 0, left: 50,  width: vw(78), height: 480, top: 130, borderRadius: 10, backgroundColor: cardColors[1], display: 'flex', alignItems: 'center'}}>
                    
                    <Text style={{fontSize: 15, color: 'white', position: 'absolute', marginTop: 10, textAlign: 'center', opacity: 0.5}}>Question</Text>
    
                        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500}}>
                            <Text style={{fontSize: 25, color: 'white', fontWeight: 'bold'}}></Text>
                        </View>
                
                    <Text style={{fontSize: 15, color: 'white', position: 'absolute', bottom: 10, textAlign: 'center', opacity: 0.5}}>Tap to Flip</Text>
                
                </View>
    
                <AnimatedTouchable style={{transform: [{ rotateY: interpolateFront}], backfaceVisibility: 'hidden', margin: 30, width: vw(78), height: 500, borderRadius: 10, backgroundColor: cardColors[0], display: 'flex', alignItems: 'center'}}>
                    
                    <Text style={{fontSize: 15, color: 'white', position: 'absolute', marginTop: 10, textAlign: 'center', opacity: 0.5}}>Question</Text>
    
                        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500, width: vw(100)}}>
                            <TextInput ref={questionInp} onChangeText={(value) => {newQuestion = value}} multiline={true} style={{display: tiEnabled ? 'flex' : 'none', fontSize: 25, color: 'white', fontWeight: 'bold', width: vw(70), maxHeight: vh(60), textAlign: 'center'}}>{question}</TextInput>
                            <Text style={{display: tiEnabled ? 'none' : 'flex', fontSize: 25, color: 'white', fontWeight: 'bold', width: vw(70), textAlign: 'center', maxHeight: vh(60)}}>{question}</Text>
                        </View>
                
                    <Text style={{fontSize: 15, color: 'white', position: 'absolute', bottom: 10, textAlign: 'center', opacity: 0.5}}>Tap to Flip</Text>
                
                </AnimatedTouchable>
    
                <AnimatedTouchable onPress={handleFlip} style={{transform: [{ rotateY: interpolateBack}],backfaceVisibility: 'hidden', position: 'absolute', top: 0,  width: vw(78), height: 500, top: 120, borderRadius: 10, backgroundColor: cardColors[0], display: 'flex', alignItems: 'center'}}>
                    
                    <Text style={{fontSize: 15, color: 'white', position: 'absolute', marginTop: 10, textAlign: 'center', opacity: 0.5}}>Answer</Text>
    
                        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500}}>
                            <TextInput ref={answerInp} onChangeText={(value) => {newAnswer = value;}} multiline={true} style={{display: tiEnabled ? 'flex' : 'none', fontSize: 25, color: 'white', fontWeight: 'bold', width: vw(70), maxHeight: vh(60), textAlign: 'center'}}>{answer}</TextInput>
                            <Text style={{display: tiEnabled ? 'none' : 'flex', fontSize: 25, color: 'white', fontWeight: 'bold', width: vw(70), maxHeight: vh(60), textAlign: 'center'}}>{answer}</Text>
                        </View>
                
                    <Text style={{fontSize: 15, color: 'white', position: 'absolute', bottom: 10, textAlign: 'center', opacity: 0.5}}>Tap to Flip</Text>
                
                </AnimatedTouchable>
    
                <View style={{display: 'flex', flexDirection: 'row-reverse'}}>
                    <TouchableOpacity onPress={() => {nextCard(true)}}>
                        <Image source={rightBtn} style={{width: 50, height: 50, marginLeft: 40, marginRight: 40}} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setTIenabled(true); setTimeout(() => {isFlipped ? answerInp.current.focus() : questionInp.current.focus();}, 100); }}>
                        <Image source={editIcon} style={{width: 50, height: 50}} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {nextCard(false)}} >
                        <Image source={wrongBtn} style={{width: 50, height: 50, marginLeft: 40, marginRight: 40}} />
                    </TouchableOpacity>
                </View>
                
            </View>
            )
        }else{
            return(
                <View style={{backgroundColor: '#22252D', height: vh(100), width: vw(100), display: 'flex', alignItems: 'center'}}>
                    
                    <View style={{width: vw(85), height: 50, borderRadius: 10, backgroundColor: '#22252D', display: 'flex', alignItems: 'center', flexDirection: 'row', marginTop: 40, shadowColor: subjectList[subject].color, shadowOffset: {width: 0,height: -100,},shadowOpacity: 0.43,shadowRadius: 9.51,elevation: 15,}}>
                        <Text onPress={() => {navigation.navigate('Flashcards') }} style={{color: 'white', fontSize: 20, marginTop: -3, marginLeft: 20, fontWeight: 'bold'}}>←  {topicName}</Text>
                        <Text style={{color: 'white', fontSize: 12, marginTop: 1, position: 'absolute', right: 20, fontWeight: 'bold', opacity: 0.5}} >{correctCount}/{subjectList[subject].sets[setInd].cards.length} Done</Text>
                    </View>
                    
                    <Text style={{color: 'white', fontSize: 20, marginTop: 30, fontWeight: 'bold', textAlign: 'center'}}>You rememberd {correctCount}/{subjectList[subject].sets[setInd].cards.length}</Text>

                    <TouchableOpacity onPress={() => {navigation.navigate('Flashcards'); continueFunc()}} style={{width: 200, height: 50, borderWidth: 1, borderColor: '#46FFAF', backgroundColor: '#2C303A', borderRadius: 10, position: 'absolute', bottom: 30}}>
                        <Text style={{color: '#46FFAF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>Continue</Text>
                    </TouchableOpacity>

                </View>
            )
        }
    }

    return(
        <Display />
    )
    
}