import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import {Text} from 'react-native-paper';
import SupportElement from './SupportElement';

const mpesa = require('../../assets/img/mpesa.png');
const emola = require('../../assets/img/emola.png');

export default function Support() {
  return (
    <View>
      <Text style={{textAlign: 'center', margin: 5}}>Apoie</Text>
      <View style={{ padding: 5, borderBottomWidth: 1, borderBottomColor: '#999' }}>
        <SupportElement name='M-Pesa' icon={mpesa} phone='847460853' />
        <SupportElement name='e-Mola' icon={emola} phone='872081978' />
      </View>
    </View>
  );
}