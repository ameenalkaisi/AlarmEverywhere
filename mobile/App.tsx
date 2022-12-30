/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import * as React from 'react';

import Login from './pages/Login';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ForgotPassword from './pages/ForgotPassword';
import {AppContextProps, RootStackParamList} from './_app';
import {QueryClient, QueryClientProvider} from 'react-query';
import Register from './pages/Register';
import VerifyAccount from './pages/VerifyAccount';
import Home from './pages/Home';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export const AppContext = React.createContext<AppContextProps | null>(null);

const App = () => {
  // new-login screen
  //
  // display email and password boxes
  // forgot password option
  // -- displays page where you enter email and it sends stuff
  // MAYBE there's a no-login option for just regular alarms, this would be in another tab
  //
  // logged-in screen
  //
  // display list oadb shell ip addr show wlan0f current alarms
  // -- each of which have edit option and
  // then display alarm creation in another "tab"
  // another tab for account settings
  const [email, setEmail] = React.useState<String | null>(null);
  const [cookie, setCookie] = React.useState<String | null>(null);
  const contextValue = React.useMemo(
    () => ({email, setEmail, cookie, setCookie}),
    [email, cookie],
  );

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={contextValue}>
          <Stack.Navigator initialRouteName="Login">
            {contextValue.email == null ? (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
              </>
            ) : (
              <Stack.Screen name="Home" component={Home} />
            )}
            {/*
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="EditAlarm" component={EditAlarm}/>
            <Stack.Screen name="ChangePassword" component={ChangePassword}/>
            <Stack.Screen name="Account" component={Account}/>
            */}
          </Stack.Navigator>
        </AppContext.Provider>
      </QueryClientProvider>
    </NavigationContainer>
  );
};

export default App;
