
import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import CONFIG from '../config';

import Constants from 'expo-constants';

export default function Feedback({ btnBack }) {

  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');

  const sendFeedback = async () => {
    const data = { email, feedback };

    try {
      const response = await fetch(CONFIG.backendServer + '/feedback', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const json = await response.json();
      if (json.status) {
        Alert.alert('', 'Obrigado, pelo seu feedback!', [
          {
            text: '',
            onPress: () => { },
            style: 'cancel',
          },
          { text: 'OK', onPress: () => { } },
        ]);
      }
    } catch (err) {
      Alert.alert('', 'Ocorreu um erro tente novamente!', [
        {
          text: '',
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'OK', onPress: () => { } },
      ]);
    }

  }
  return (
    <View style={{
      position: 'absolute', flex: 1, backgroundColor: '#fff',
      width: '100%', height: '100%', zIndex: 3, borderRightColor: '#ccc', borderRightWidth: 1,
      marginTop: Constants.statusBarHeight
    }}>
      <View style={{
        height: 60, padding: 5, flexDirection: 'row', alignItems: 'center',
        backgroundColor: CONFIG.colors.primary
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          {btnBack}
          <Text style={{ fontSize: 18, color: '#fff' }}>Feedback</Text>
        </View>
      </View>
      <View style={{ padding: 5 }}>
        <TextInput mode='outlined' style={{ marginBottom: 10, height: 150 }} value={feedback} onChangeText={(text) => setFeedback(text)} multiline={true} numberOflines={4} maxLength={200} placeholder='Dê-nos o seu feedback' />
        <TextInput mode='outlined' style={{ marginBottom: 10 }} value={email} onChangeText={(text) => setEmail(text)} placeholder='Email' />
        <Button
          onPress={() => sendFeedback()}
          mode='contained'
          style={{ backgroundColor: CONFIG.colors.primary }}
          labelStyle={{ textTransform: 'capitalize', color: '#fff' }}
        >
          Enviar
        </Button>
      </View>
    </View>
  );
}