import {BACKEND_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import * as React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {AppContext} from '../App';
import AlarmView from '../components/AlarmView';
import {RootStackParamList, styles} from '../_app';

const Home: React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({
  navigation,
}) => {
  const contextValue = React.useContext(AppContext);

  // eventually fetch it from the database
  // i dont think theres a need to place it in async storage, just keep it in memory
  // but we'll see depending on performance
  //    might have to be just for front-end stuff
  const {alarms} = React.useContext(AppContext);

  function handleLogout() {
    axios
      .get(BACKEND_URL + '/logout')
      .then(_ => {
        if (contextValue != null) {
          contextValue.setEmail(null);
          contextValue.setCookie(null);
          AsyncStorage.multiRemove(['cookie', 'email']);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  return (
    <View style={styles.container}>
      <Text>Alarms</Text>
      {/* TODO: alarms here -- use the alarms thing */}
      {alarms.map((alarm, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            navigation.push('EditAlarm', {
              alarmIndex: index,
            });
          }}>
          <AlarmView alarm={alarm} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.btn}>
        <Text onPress={handleLogout}>BruH</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
