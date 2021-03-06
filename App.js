import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import { Button, Text, Checkbox, Switch, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import * as Font from 'expo-font';
import * as Network from 'expo-network';
import { Audio } from 'expo-av';

import Constants from 'expo-constants';

import CONFIG from './src/config';

// Components
import Support from './src/components/Support';
import CheckVersion from './src/components/CheckVersion';
import Feedback from './src/components/Feedback';

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
  const [showSettings, setShowSettings] = useState(false);
  const [soundActivated, setSoundActivated] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sound, setSound] = useState(null);

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

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/sound/correct.mp3')
    );
    setSound(sound);
  }

  const playSound = async () => {
    await sound.playAsync();
  }

  const checkConnection = async () => {
    const con = await Network.getNetworkStateAsync();
    setConnected(con.isConnected);
  }

  const getQuestions = async () => {
    const response = await fetch(CONFIG.backendServer + '/questions');
    const json = await response.json();
    const allQuestions = json.data;
    const aux = Math.round(Math.random() * (allQuestions.length - 1));
    setQuestions(allQuestions);
    setQuestion(allQuestions[aux]);
    setPast([allQuestions[aux].id]);
  }

  const getQuestionsFrom = async (subject) => {
    const response = await fetch(CONFIG.backendServer + '/questions/' + subject.id);
    const json = await response.json();
    const qs = json.data;
    if (subject.id === 0) {
      const response = await fetch(CONFIG.backendServer + '/questions');
      const json = await response.json();
      const allQuestions = json.data;
      const aux = Math.round(Math.random() * (allQuestions.length - 1));
      setCategory(subject);
      setShowCategories(false);
      setQuestions(allQuestions);
      setQuestion(allQuestions[aux]);
      setPast([allQuestions[aux].id]);
      setPoints(0);
      return;
    }

    if (qs.length > 0) {
      const aux = Math.round(Math.random() * (qs.length - 1));
      setCategory(subject);
      setShowCategories(false);
      setQuestions(qs);
      setQuestion(qs[aux]);
      setPast([qs[aux].id]);
      setPoints(0);
    } else {
      Alert.alert('Brevemente!', 'Ainda n??o h?? quest??es de ' + subject.label + '.', [
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
          Alert.alert('Parabens :)', 'Respondeu correctamente ?? todas as quest??es!', [
            {
              text: '',
              onPress: () => { },
              style: 'cancel',
            },
            {
              text: 'OK', onPress: () => {
                const aux = Math.round(Math.random() * (questions.length - 1));
                setPoints(0);
                setPast([questions[aux].id]);
                setQuestion(questions[aux])
              }
            },
          ]);
        }
      }, 500);
    } else {
      setTimeout(() => {
        Alert.alert('Incorrecto :(', 'A resposta certa ??: ' + question.answers[question.correct] + '.', [
          {
            text: '',
            onPress: () => { },
            style: 'cancel',
          },
          {
            text: 'OK', onPress: () => {
              const aux = Math.round(Math.random() * (questions.length - 1));
              setPoints(0);
              setPast([questions[aux].id]);
              setQuestion(questions[aux]);
            }
          },
        ]);
      }, 500);
    }
    setButtonsDisabled(false);
  }

  useEffect(() => {
    loadFonts();
    getQuestions();
    loadSound();
    checkConnection();
  }, []);

  if (fontLoaded && questions.length > 0 && Object.keys(question).length > 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: Constants.statusBarHeight }}>
        <View style={{
          height: 60, padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: CONFIG.colors.primary
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('./assets/aprova-logo-alt.png')} style={{ width: 20, height: 20 }} />
            <Text style={{ fontSize: 20, marginLeft: 10, fontFamily: 'Title-Font', color: '#fff' }}>Aprova</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton icon='whatsapp' size={20} color='#fff' onPress={() => {
              Linking.openURL('https://wa.me/+258847460853');
            }} style={{ marginRight: 10 }} />
            <IconButton icon='message' size={20} color='#fff' onPress={() => setShowFeedback(true)} style={{ marginRight: 10 }} />
            <IconButton icon='tools' size={20} color='#fff' onPress={() => setShowSettings(true)} style={{ marginRight: 10 }} />
            <IconButton icon={!showCategories ? 'menu' : 'close'} color='#fff' size={25} onPress={() => setShowCategories(!showCategories)} />
          </View>
        </View>
        <View style={{
          height: 170, justifyContent: 'center', alignItems: 'center', padding: 10,
          borderBottomWidth: 1, borderBottomColor: '#bbb'
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

          <View style={{ height: 20, alignItems: 'center', position: 'absolute', bottom: 5 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Inkfree' }}>{points + '/' + questions.length}</Text>
          </View>
        </View>
        <ScrollView style={{ flex: 1, backgroundColor: '#ccc' }}>
          {question.answers.map(a => (
            <TouchableOpacity
              activeOpacity={.9}
              disabled={buttonsDisabled}
              style={{
                display: 'flex', flexWrap: 'wrap', borderRadius: 10,
                margin: 5, padding: 5, backgroundColor: rightAns === a ? '#2bccb1' : '#fff',
                height: 100, justifyContent: 'center', alignItems: 'center',
                shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 0, elevation: 3
              }}
              key={a} mode='contained'
              onPress={() => checkValidation(a)}
            >
              <Text style={{ textAlign: 'center', width: '100%', color: rightAns === a ? '#fff' : CONFIG.colors.primary }}>{a}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Categories */}
        {showCategories ?
          <ScrollView style={{
            position: 'absolute', flex: 1, backgroundColor: '#fff',
            width: '85%', height: '100%', zIndex: 3, borderRightColor: '#ccc', borderRightWidth: 1,
            marginTop: Constants.statusBarHeight
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
        {showSettings ?
          <View style={{
            position: 'absolute', flex: 1, backgroundColor: '#fff',
            width: '100%', height: '100%', zIndex: 3,
            marginTop: Constants.statusBarHeight
          }}>
            <View style={{
              height: 60, padding: 5, flexDirection: 'row', alignItems: 'center',
              backgroundColor: CONFIG.colors.primary
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <IconButton icon='arrow-left' color='#fff' size={25} onPress={() => setShowSettings(false)} style={{ marginRight: 5 }} />
                <Text style={{ fontSize: 18, color: '#fff' }}>Configura????es</Text>
              </View>
            </View>
            <Checkbox.Item label="Som" color={CONFIG.colors.primary} status={soundActivated ? "checked" : "unchecked"}
              onPress={() => setSoundActivated(!soundActivated)}
            />
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Som</Text>
              <Switch color={CONFIG.colors.primary} value={soundActivated} onValueChange={() => setSoundActivated(!soundActivated)} />
            </View> */}
          </View> : null
        }

        {showFeedback ?
          <Feedback
            btnBack={
              <IconButton icon='arrow-left' size={25} color='#fff'
                onPress={() => setShowFeedback(false)} style={{ marginRight: 5, color: '#fff' }}
              />
            }
          /> : null
        }
      </View >
    );
  } else {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: Constants.statusBarHeight }}>
      <ActivityIndicator size='large' color={CONFIG.colors.primary} />
    </View>;
  }
}