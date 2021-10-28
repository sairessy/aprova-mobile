import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';


export default function Support() {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#999' }}>
      <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Inkfree', marginBottom: 10 }}>Apoie:</Text>
      <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Inkfree' }}>M-Pesa: 847460853</Text>
      <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Inkfree' }}>e-Mola: 872081978</Text>
    </View>
  );
}