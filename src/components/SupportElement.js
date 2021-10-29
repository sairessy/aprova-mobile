import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function SupportElement({ name, icon, phone }) {

  const copyPhoneNumber = async () => {
    Clipboard.setString(phone);
  }

  return (
    <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={icon} style={{width: 20, height: 20, borderRadius: 3}} />
        <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Inkfree', marginLeft: 10 }}>{name}</Text>
      </View>
      <MaterialIcons name='content-copy' size={30} color='#999' onPress={() => copyPhoneNumber()} />
    </View>
  );
}