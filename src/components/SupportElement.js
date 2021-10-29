import React, { useEffect, useState } from 'react';
import { View, Image, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import Clipboard from 'expo-clipboard';

export default function SupportElement({ name, icon, phone }) {
  const phoneNumber = phone;

  const copyPhoneNumber = async () => {
    try {
      Clipboard.setString(phoneNumber);
      Alert.alert('', 'Número copiado para área de colagem!', [
        {
          text: '',
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'OK', onPress: () => { } },
      ]);
    } catch (error) {
      Alert.alert('Número:', phoneNumber, [
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
    <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={icon} style={{ width: 20, height: 20, borderRadius: 3 }} />
        <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Inkfree', marginLeft: 10 }}>{name}</Text>
      </View>
      <MaterialIcons name='content-copy' size={30} color='#999' onPress={() => copyPhoneNumber()} />
    </View>
  );
}