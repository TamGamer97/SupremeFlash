import React, {useEffect, useState, useRef} from 'react';
import { Text, View, Image, Platform, ScrollView, AppState } from 'react-native';
import { vh, vw } from 'react-native-expo-viewport-units';
import { useIsFocused } from "@react-navigation/native";

import { Picker } from "@react-native-picker/picker"

import {save, load, clearAll} from './Functions'

import timeBadge from '../Files/badgeIconTime.png'
import attemptBadge from '../Files/badgeIconAttempts.png'

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

export default function Home()
{
    const isFocused = useIsFocused();

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
    const [subject, setSubject] = useState(0)

    const [thisSubject, setThisSubject] = useState(0)

    const [timeBadgeOpac, setTimeBadgeOpac] = useState(0.5)

    const [attemptBadgeOpac, setaAttemptedBadgeOpac] = useState(0.5)
    
    const [weekDayList, setWeekDayList] = useState([])

    const [dayTimeList, setDTimeList] = useState([0,0,0,0,0,0,0])

    const [progressChallenges, setProgressChallenges] = useState([])

    // clearAll()

    useEffect(() => {
        load('subjectList')
            .then((sl) => {
                sl = JSON.parse(sl)
                if(!sl)
                {
                    // console.log('First time user')
                    sl = [
                        {
                            name:'UnkownIgnore', color: 'red', key: 0, sets:[ {name: '...', score: 0, cards: [   ] } ]
                        }
                    ]

                    save('subjectList', JSON.stringify(sl))
                    // console.log(subjectList)
                }

                sl.unshift({"color": "#46FFAF", "key": 0, "name": "Total"})
                updateSubjectList(sl)
                


                // console.log(sl)
            })
       load('stats')
            .then((stats) => {
                if(!stats)
                {
                    // console.log('Stats doesnt exist, First Time user')

                    var DayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

                    var d = new Date()

                    var todayNum = d.getDay()-1

                    stats = [ {dlist: [], dTimeCounter: {'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0}}, {Challenges: [{'Daily Progress': 0}, {'Complete 1000 Attempts': 0}, {'Reach 100hrs': 0}],  }  ]

                    var dTime = []

                    for (var x = 0; x < DayList.length; x++)
                    {
                        var ind = (todayNum + (x + 1))
                        if (ind < 0 || ind >= DayList.length)
                        {
                            ind = ind - DayList.length
                        }
                        stats[0].dlist.push(DayList[ind])

                        dTime.push(stats[0].dTimeCounter[DayList[ind]])
                    }

                    // console.log(stats)

                    setWeekDayList(stats[0].dlist)
                    setDTimeList(dTime)
                    setProgressChallenges(stats[1].Challenges)

                    save('stats', JSON.stringify(stats))
                }else{
                    // console.log('Stats exist!')

                    stats = JSON.parse(stats)

                    var DayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

                    var d = new Date()

                    var todayNum = d.getDay()-1

                    // stats = [ {dlist: [], dTimeCounter: {'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0}}, {Challenges: [{'Daily Progress': 10}, {'Complete 100 Attempts': 10}, {'Reach 100hrs': 10}],  }  ]

                    var dTime = []

                    stats[0].dlist = []

                    for (var x = 0; x < DayList.length; x++)
                    {
                        var ind = (todayNum + (x + 1))
                        if (ind < 0 || ind >= DayList.length)
                        {
                            ind = ind - DayList.length
                        }
                        stats[0].dlist.push(DayList[ind])

                        dTime.push(stats[0].dTimeCounter[DayList[ind]])
                    }

                    // console.log(stats)

                    setWeekDayList(stats[0].dlist)
                    setDTimeList(dTime)
                    setProgressChallenges(stats[1].Challenges)
                }
            } )
    },[isFocused])

    function humanDiff (t1, t2) {
        const diff = Math.max(t1,t2) - Math.min(t1,t2) 
        const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN
        
        const hrs = Math.floor(diff/HRS)
        const min = Math.floor((diff%HRS)/MIN).toLocaleString('en-US', {minimumIntegerDigits: 2})
        const sec = Math.floor((diff%MIN)/SEC).toLocaleString('en-US', {minimumIntegerDigits: 2})
        const ms = Math.floor(diff % SEC).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping: false})
        
        const total = JSON.parse(hrs * 60) + JSON.parse(min)

        // return `${hrs}:${min}:${sec}.${ms}`
        return total
    }
    
    function timeTrackStart()
    {
        load('startTime')
            .then((st) => {
                st = JSON.parse(st)
                if(st != '0') // end timer and add time to stats
                {
                    console.log('initial time already exists')
                    load('endTime')
                        .then(et => {
                            if(et != '0')
                            {
                                et = JSON.parse(et)
                                const t1 = new Date(st)
                                const t2 = new Date(et)
                                console.log('calc')
                                const timeSpent = humanDiff(t1, t2)
                                console.log(timeSpent)
    
                                const dayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                                const currentDay = dayList[(new Date().getDay()-1)]
                                
                                load('stats')
                                    .then(stats => {
                                        stats = JSON.parse(stats)
                                        stats[0].dTimeCounter[currentDay] += JSON.parse(timeSpent)

                                        if(stats[0].dTimeCounter[currentDay] >= 600)
                                        {
                                            stats[0].dTimeCounter[currentDay] = 0
                                        }
                                        
                                        // save('startTime', '0')
                                        save('endTime', '0')
                                        
                                        console.log(stats)

                                        save('stats', JSON.stringify(stats))
                                        console.log('saved Statisticly')
                                    
                                })
                            }else{
                                console.log('end time not recorded ')
                            }
                        })
                }else{console.log('start time not recorded')}
                const now = new Date().getTime()
                save('startTime', JSON.stringify(now))
                console.log('timer started')
            })
    }
    useEffect(() => {
        timeTrackStart()
    }, []) // first time open app

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    useEffect(() => {
        const subscription = AppState.addEventListener("change", _handleAppStateChange);
        return () => {
          subscription.remove();
        };
      }, [])

    const _handleAppStateChange = nextAppState => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          console.log('App has come BACK to the foreground from background');
          timeTrackStart()
        }else{
            console.log('App is in background')
            const newEnd = new Date().getTime()
            save('endTime', JSON.stringify(newEnd))
            console.log('saved end time')
        }
    
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        // console.log('AppState', appState.current);
      };

    return(
        <View style={{backgroundColor: '#22252D', height: vh(100), width: vw(100)}}>
            <Text style={{color: '#46FFAF', fontSize: 30, fontWeight: 'bold', position: 'absolute', left: 30, top: 50}}>
                HI TamGamer97
            </Text>
            <Text style={{color: '#46FFAF', fontSize: 15, fontWeight: 'bold', position: 'absolute', left: 30, top: 90}}>
                Keep track of your progress!
            </Text>

            <View style={{display: 'flex', alignItems: 'center'}}>
                {/* <Text style={{color: 'white', fontSize: 23, fontWeight: 'bold', position: 'relative', left: 30, top: 140}}>Physics</Text> */}
                <Picker
                    selectedValue={thisSubject}
                    onValueChange={(value, index) => setThisSubject(value)}
                    mode="dropdown" // Android only
                    style={{height:30, width: vw(90), position: 'relative', top: 130, color: 'white', opacity: 1}}
                >
                    <Picker.Item label="Choose a Subject" value="Unknown" />
                    {
                        subjectList.map((s, ind) => {
                            if(s.name != 'UnkownIgnore')
                            {
                                return(
                                    <Picker.Item label={s.name} value={ind} />
                                )
                            }
                        })
                    }
                </Picker>

            </View>

            <View style={{position: 'relative', top: 110, display: 'flex', alignItems: 'center'}}>
                <View style={{position: 'relative', top: 30, display: 'flex', alignItems: 'center'}}>    
                    <LineChart
                        data={{
                            // labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", 'Now'],
                            labels: weekDayList,
                            datasets: [
                                // {data: ['30','60','30','45','0','120','0']}
                                {data: [...dayTimeList]}
                            ]
                        }}
                        width={vw(90)} // from react-native
                        height={180}
                        yAxisSuffix="min"
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                        backgroundColor: "#2C303A",
                        backgroundGradientFrom: "#2C303A",
                        backgroundGradientTo: "#2C303A",
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 0,
                            
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: subjectList[thisSubject].color
                        },
                        propsForBackgroundLines:{
                            stroke:"transparent"
                        },
                        }}
                        bezier
                        style={{
                        marginVertical: 8,
                        borderRadius: 10
                        }}
                    />
                </View>
                
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold', position: 'relative', left: 30, top: 150}}>
                    Badges
                </Text>
                <Text style={{color: 'white', fontSize: 13, opacity: 0.5, fontWeight: 'bold', position: 'relative', left: 40, top: 163}}>
                    Tap to Flip
                </Text>
            </View>

            <View style={{position: 'relative', left: 30, top: 160}}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    
                    <View style={{width: 180, height: 70, borderRadius: 10, backgroundColor: '#353A47', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 30}}>
                        <Image source={timeBadge} style={{width: 45, height: 45, opacity: timeBadgeOpac}} />
                    </View>

                    <View style={{width: 180, height: 70, borderRadius: 10, backgroundColor: '#353A47', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 30}}>
                        <Image source={attemptBadge} style={{width: 45, height: 45, opacity: attemptBadgeOpac}} />
                    </View>

                    <View style={{width: 30, height: 70, borderRadius: 10, backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 30}}>
                        <Image style={{width: 45, height: 45, opacity: attemptBadgeOpac}} />
                    </View>
                </ScrollView>
            </View>
            
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold', position: 'relative', left: 30, top: 170}}>
                    Challenges
                </Text>
                <Text style={{color: 'white', fontSize: 13, opacity: 0.5, fontWeight: 'bold', position: 'relative', left: 40, top: 183}}>
                    Earn Badges
                </Text>
            </View>
            
            <View style={{position: 'relative', left: 30, top: 180}}>
                <ScrollView style={{height: 200}} >

                    {progressChallenges.map(c => {
                        // console.log(c[Object.keys(c)[0]])
                        return(
                            <View style={{width: vw(85), height: 75, borderRadius: 10, backgroundColor: '#353A47', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                                <Text style={{position: 'absolute', left: 20, top: 10, color: 'white', fontWeight: 'bold'}}>{Object.keys(c)[0]}</Text>
                                <Text style={{position: 'absolute', right: 20, top: 10, color: 'white', fontWeight: 'bold'}}>{Math.round(c[Object.keys(c)[0]])}%</Text>
                                <View style={{position: 'absolute', width: vw(75), height: 30, top: 35, backgroundColor:'#48B184', borderRadius: 10}}></View>
                                <View style={{position: 'absolute', left: 20, width: vw(75), height: 10}}>
                                    <View style={{position: 'absolute', width: vw( c[Object.keys(c)[0]] * (75 / 100) ),maxWidth: vw(75), height: 30, top: 35, backgroundColor:'#46FFAF', borderRadius: 10, marginTop: -33, marginLeft: -1}}></View>
                                </View>
                            </View>
                        )
                    })}


                    {/* <View style={{width: vw(85), height: 75, borderRadius: 10, backgroundColor: '#353A47', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                        <Text style={{position: 'absolute', left: 20, top: 10, color: 'white', fontWeight: 'bold'}}>Complete 100 Attempts</Text>
                        <Text style={{position: 'absolute', right: 20, top: 10, color: 'white', fontWeight: 'bold'}}>84/100</Text>
                        <View style={{position: 'absolute', width: vw(75), height: 30, top: 35, backgroundColor:'#48B184', borderRadius: 10}}></View>
                        <View style={{position: 'absolute', left: 20, width: vw(75), height: 10}}>
                            <View style={{position: 'absolute', width: vw( 84 * (75 / 100) ),maxWidth: vw(75), height: 30, top: 35, backgroundColor:'#46FFAF', borderRadius: 10, marginTop: -33, marginLeft: -1}}></View>
                        </View>
                    </View>

                    <View style={{width: vw(85), height: 75, borderRadius: 10, backgroundColor: '#353A47', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                        <Text style={{position: 'absolute', left: 20, top: 10, color: 'white', fontWeight: 'bold'}}>Reach 100hrs</Text>
                        <Text style={{position: 'absolute', right: 20, top: 10, color: 'white', fontWeight: 'bold'}}>12/100</Text>
                        <View style={{position: 'absolute', width: vw(75), height: 30, top: 35, backgroundColor:'#48B184', borderRadius: 10}}></View>
                        <View style={{position: 'absolute', left: 20, width: vw(75), height: 10}}>
                            <View style={{position: 'absolute', width: vw( 12 * (75 / 100) ),maxWidth: vw(75), height: 30, top: 35, backgroundColor:'#46FFAF', borderRadius: 10, marginTop: -33, marginLeft: -1}}></View>
                        </View>
                    </View> */}

                    <View style={{width: 30, height: 70, borderRadius: 10, backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                    </View>
                </ScrollView>
            </View>

        </View>
    )
}