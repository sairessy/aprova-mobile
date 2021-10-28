import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';


export default function CheckNetwork() {

  return (
    <View style={{
      position: 'absolute', zIndex: 10, height: '100%',
      backgroundColor: '#fff', padding: 10, justifyContent:
        'center', alignItems: 'center'
    }}>
      <Text style={{ textAlign: 'center' }}>Não está conectado a internet, conecte-se a internet e reinicie a aplicação!</Text>
    </View>
  );
}
