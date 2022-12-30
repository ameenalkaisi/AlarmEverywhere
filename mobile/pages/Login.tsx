import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';

import {BACKEND_URL} from '@env';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useQuery} from 'react-query';
import {RootStackParamList, styles} from '../_app';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {AppContext} from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login: React.FC<NativeStackScreenProps<RootStackParamList, 'Login'>> = ({
  navigation,
}) => {
  // new-login screen
  //
  // display email and password boxes
  // forgot password optin
  // -- displays page where you enter email and it sends stuff
  // MAYBE there's a no-login option for just regular alarms, this would be in another tab
  //
  // logged-in screen
  //
  // display list of current alarms
  // -- each of which have edit option and
  // then display alarm creation in another "tab"
  // another tab for account settings

  const passwordRef = React.useRef<String>('A');
  const emailRef = React.useRef<String>('A@a.com');
  const [stuff, setStuff] = React.useState<String>('');
  const contextValue = React.useContext(AppContext);

  const handleSubmit = async () => {
    await axios
      .post(BACKEND_URL + '/login', {
        email: emailRef.current,
        password: passwordRef.current,
      })
      .then((response: AxiosResponse) => {
        let cookieToSet = response.headers['set-cookie'];
        // set a cookie to async storage from here
        if (cookieToSet != undefined) {
          let cookie = cookieToSet[0];
          // error otherwise

          if (contextValue != null) {
            contextValue.setEmail(emailRef.current.toString());
            contextValue.setCookie(cookie);
            AsyncStorage.setItem('cookie', cookie);
            AsyncStorage.setItem('email', emailRef.current.toString());
          } else {
            console.log("context value isn't initialized!");
          }
        }
      })
      .catch((error: Error | AxiosError<String, String>) => {
        if (axios.isAxiosError(error)) {
          // todo
          // set some helper text here
          console.log(error);
          //console.log(error.response?.data);
          if (error.response?.data.contains('not verified')) {
            // go into verify code page
            console.log(error.response);
          }
        }
      });
  };

  const handleRegister = () => {
    navigation.push('Register');
  };

  const getStuff = async () => {
    try {
      const response = await fetch(BACKEND_URL + '/');
      const val = await response.text();
      setStuff(val);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    AsyncStorage.multiGet(['cookie', 'email']).then(vals => {
      // vals[0][1] is val of cookie, and vals[1][1] is val of email
      contextValue?.setCookie(vals[0][1]);
      contextValue?.setEmail(vals[1][1]);
    });
  }, []); // todo, think about making it depend on contextValue
  useQuery([''], () => getStuff());

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#F6F7F8"
          onChangeText={email => (emailRef.current = email)}
          defaultValue={'A@a.com'}
        />
      </View>

      <Text>{stuff == '' ? 'None' : stuff}</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#F6F7F8"
          secureTextEntry={true}
          onChangeText={password => (passwordRef.current = password)}
          defaultValue={'A'}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.push('ForgotPassword')}>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text>REGISTER</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
