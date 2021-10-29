import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import SupportElement from './SupportElement';

const mpesa = require('../assets/img/mpesa.png');
const emola = require('../assets/img/emola.png');

export default function Support() {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#999' }}>
      <SupportElement name='M-Pesa' icon={mpesa} phone='847460853' />
      <SupportElement name='e-Mola' icon={emola} phone='872081978' />
    </View>
  );
}