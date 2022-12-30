import {Dispatch, SetStateAction} from 'react';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011627',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    backgroundColor: '#FF3366',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center',
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    textAlign: 'center',
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  enterButton: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#2EC4B6',
  },
  btn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#2EC4B6',
  },
});

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Register: undefined;
  VerifyAccount: {email: string; password: string};
  Home: {email: string};
};

export interface AppContextProps {
  email: String | null;
  setEmail: Dispatch<SetStateAction<String | null>>;

  cookie: String | null;
  setCookie: Dispatch<SetStateAction<String | null>>;
}
