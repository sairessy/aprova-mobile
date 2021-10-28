import React, { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import CONFIG from '../config';

import Constants from 'expo-constants';

export default function CheckVersion() {
  const [lastVersion, setLastVersion] = useState(false);
  const [appInfo, setAppInfo] = useState({});


  const checkVersion = async () => {
    try {
      const response = await fetch(CONFIG.backendServer + '/appinfo');
      const json = await response.json();
      setAppInfo(json);
      setLastVersion(Constants.manifest.version === json.version);
    } catch (err) {
      console.log('Failed to fetch!');
    }

  }

  const downloadLastVersion = async () => {
    Linking.openURL(appInfo.url);
  }

  useEffect(() => {
    checkVersion();
  }, []);

  if (lastVersion) {
    return (
      <View style={{ padding: 10 }}>
        <Text style={{ textAlign: 'center', color: '#444', fontFamily: 'Inkfree' }}>Está usar a última versão do App!</Text>
      </View>
    )
  } else {
    return (
      <View style={{ padding: 10 }}>
        <Button
          mode='contained'
          style={{ backgroundColor: '#4b0082' }}
          labelStyle={{ fontFamily: 'Inkfree', textTransform: 'capitalize' }}
          onPress={() => downloadLastVersion()}
        >
          Baixar actualização
        </Button>
      </View>
    )
  }
}