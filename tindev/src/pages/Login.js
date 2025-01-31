import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import logo from '../assets/logo.png';

import api from '../services/api';

export default function Login({ navigation }){

  const [user , setUser] = useState('');

  useEffect(() => {
      AsyncStorage.getItem('user').then(user => {
          if( user ){
            navigation.navigate('Main', { user });
          }
      })
  }, []);

  async function handleLogin() {
      const response = await api.post('/devs', {username: user});

      const { _id } = response.data;
      
      await AsyncStorage.setItem('user', _id); 

      navigation.navigate('Main', { user: _id });
  }

  return(
    <View style={styles.container}>
        <Image source={logo}/>
        <TextInput 
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Digite seu usuário do Github" 
            style={styles.input}
            placeholderTextColor='#999'
            value={user}
            onChangeText={setUser}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 30,
  },
  input: {
      height: 46,
      alignSelf: 'stretch',
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#ddd',
      marginTop: 20,
      borderRadius: 4,
      paddingHorizontal: 15,
  },
  button: {
      height: 46,
      alignSelf: 'stretch',
      backgroundColor: '#DF4723',
      borderRadius: 4,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center'
  },
  buttonText: {
      fontSize: 16,
      color: '#FFF',
      fontWeight: 'bold',
  }
});
