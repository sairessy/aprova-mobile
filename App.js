import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import * as Font from 'expo-font';
import * as Network from 'expo-network';

import CONFIG from './src/config';

// Components
import Support from './src/components/Support';
import CheckVersion from './src/components/CheckVersion';
import CheckNetwork from './src/components/CheckNetwork';


export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  const [rightAns, setRightAns] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [category, setCategory] = useState({ id: 0, label: 'Geral' });
  const [points, setPoints] = useState(0);
  const [past, setPast] = useState([]);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [connected, setConnected] = useState(true);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Title-Font": require('./assets/fonts/Montserrat-Medium.ttf'),
      "Main-Font": require('./assets/fonts/Roboto-Regular.ttf'),
      // "Inkfree": require('./assets/fonts/Inkfree.ttf'),
      "Inkfree": require('./assets/fonts/Roboto-Regular.ttf'),
      // "Inkfree": require('./assets/fonts/Montserrat-Medium.ttf')
    });

    setFontLoaded(true);
  }

  const checkConnection = async () => {
    const con = await Network.getNetworkStateAsync();
    setConnected(con.isConnected);
  }

  const getQuestions = async () => {
    const response = await fetch(CONFIG.backendServer + '/questions');
    const json = await response.json();
    const allQuestions = json.data;
    setQuestions(allQuestions);
    setQuestion(allQuestions[0]);
    setPast([allQuestions[0].id]);
  }

  const getQuestionsFrom = async (subject) => {
    const response = await fetch(CONFIG.backendServer + '/questions/' + subject.id);
    const json = await response.json();
    const qs = json.data;
    if (subject.id === 0) {
      const response = await fetch(CONFIG.backendServer + '/questions');
      const json = await response.json();
      const allQuestions = json.data;
      setCategory(subject);
      setShowCategories(false);
      setQuestions(allQuestions);
      setQuestion(allQuestions[0]);
      setPast([allQuestions[0].id]);
      setPoints(0);
      return;
    }

    if (qs.length > 0) {
      setCategory(subject);
      setShowCategories(false);
      setQuestions(qs);
      setQuestion(qs[0]);
      setPast([qs[0].id]);
      setPoints(0);
    } else {
      Alert.alert('Brevemente!', 'Ainda não há questões de ' + subject.label + '.', [
        {
          text: '',
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'OK', onPress: () => { } },
      ]);
    }

  }

  const checkValidation = async (answer) => {
    setButtonsDisabled(true);
    if (answer === question.answers[question.correct]) {
      setRightAns(question.answers[question.correct]);
      setTimeout(() => {
        setRightAns('');
        if (questions.length > past.length) {
          let q = Math.round(Math.random() * (questions.length - 1));
          while (past.includes(q)) {
            q = Math.round(Math.random() * (questions.length - 1));
          }
          setQuestion(questions[q])
          setPast([...past, q]);
          setPoints(points + 1);
        } else {
          Alert.alert('Parabens', 'Parabens, respondeu correctamente à todas as questões!', [
            {
              text: '',
              onPress: () => { },
              style: 'cancel',
            },
            { text: 'OK', onPress: () => { } },
          ]);
          setPoints(0);
          setPast([questions[0].id]);
          setQuestion(questions[0])
        }
      }, 500);
    } else {
      setTimeout(() => {
        Alert.alert('Incorrecto :(', 'A resposta certa é ' + question.answers[question.correct] + '.', [
          {
            text: '',
            onPress: () => { },
            style: 'cancel',
          },
          { text: 'OK', onPress: () => { } },
        ]);

        setPoints(0);
        setPast([questions[0].id]);
        setQuestion(questions[0])
      }, 500);
    }
    setButtonsDisabled(false);
  }

  useEffect(() => {
    loadFonts();
    getQuestions();
    checkConnection();
  }, []);

  if (fontLoaded && questions.length > 0 && Object.keys(question).length > 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{
          height: 50, padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#fff'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('./assets/icon.png')} style={{ width: 20, height: 20 }} />
            <Text style={{ fontSize: 22, marginLeft: 10, fontFamily: 'Title-Font', color: '#4b0082' }}>Aprova</Text>
          </View>
          <MaterialIcons name={!showCategories ? 'menu' : 'close'} size={35} onPress={() => setShowCategories(!showCategories)} />
        </View>
        <View style={{
          height: 150, justifyContent: 'center', alignItems: 'center', padding: 10
        }}>
          <Text style={{ fontFamily: 'Inkfree', textAlign: 'center' }}>
            {
              CONFIG.institutions.filter(i => i.id === question.institution)[0].label + ' - ' +
              question.year
            }
          </Text>
          <Text style={{ fontFamily: 'Inkfree', textAlign: 'center', fontSize: 16 }}>
            {question.text}
          </Text>
        </View>
        <View style={{ height: 20, alignItems: 'center' }}>
          <Text style={{ textAlign: 'center', fontFamily: 'Inkfree' }}>{points + '/' + questions.length}</Text>
        </View>
        <ScrollView style={{ flex: 1, backgroundColor: '#ccc' }}>
          {question.answers.map(a => (
            <TouchableOpacity
              activeOpacity={.9}
              disabled={buttonsDisabled}
              style={{
                display: 'flex', flexWrap: 'wrap', borderRadius: 5,
                margin: 5, padding: 5, backgroundColor: rightAns === a ? '#2bccb1' : '#4b0082',
                height: 100, justifyContent: 'center', alignItems: 'center'
              }}
              key={a} mode='contained'
              onPress={() => checkValidation(a)}
            >
              <Text style={{ textAlign: 'center', color: '#fff', width: '100%' }}>{a}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Categories */}
        {showCategories ?
          <ScrollView style={{
            position: 'absolute', flex: 1, backgroundColor: '#fff',
            width: '85%', height: '100%', zIndex: 3, borderRightColor: '#ccc', borderRightWidth: 1
          }}>
            <View style={{ backgroundColor: '#f9f9f9', borderBottomColor: '#999', borderBottomWidth: 1, padding: 10 }}>
              {CONFIG.subjects.map(subject => (
                <Button key={subject.id}
                  onPress={() => getQuestionsFrom(subject)}
                  labelStyle={{
                    fontFamily: 'Inkfree',
                    color: category.id === subject.id ? '#4b0082' : '#000',
                    fontWeight: category.id === subject.id ? 'bold' : 'normal',
                    textTransform: 'capitalize', fontSize: 16
                  }}
                >
                  {subject.label}
                </Button>))
              }
            </View>
            <View>
              <Support />
              <CheckVersion />
            </View>
          </ScrollView> : null
        }
      </View >
    );
  } else {
    return <View></View>;
  }
}