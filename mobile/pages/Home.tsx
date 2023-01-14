import {BACKEND_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios, {AxiosError, AxiosResponse} from 'axios';
import * as React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useMutation, useQuery} from 'react-query';
import {AppContext} from '../App';
import AlarmView from '../components/AlarmView';
import Alarm, {AlarmRecurrence} from '../utils/alarm';
import {RootStackParamList, styles} from '../_app';

interface AlarmsResponse {
  alarms: AlarmResponse[];
}

interface AlarmResponse {
  date: string;
  recurrence: string;
}

const Home: React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({
  navigation,
}) => {
  const {setEmail, setCookie} = React.useContext(AppContext);

  // eventually fetch it from the database
  // i dont think theres a need to place it in async storage, just keep it in memory
  // but we'll see depending on performance
  //    might have to be just for front-end stuff
  const {alarms, setAlarms, cookie} = React.useContext(AppContext);

  function handleLogout() {
    axios
      .get(BACKEND_URL + '/logout')
      .then(_ => {
        setEmail(null);
        setCookie(null);
        AsyncStorage.multiRemove(['cookie', 'email']);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function syncAlarmsWithServer() {
    let sentAlarms = alarms.map(alarm => {
      // 2006-01-02T15:04:05-0700
      return {
        date: alarm.date.toISOString(),
        recurrence: AlarmRecurrence[alarm.recurrence],
      };
    });
    console.log(JSON.stringify(sentAlarms));
    axios
      .post(
        BACKEND_URL + '/alarms/create',
        {
          alarms: sentAlarms,
        },
        {
          headers: {
            Cookie: cookie?.toString(),
          },
        },
      )
      .catch(error => {
        console.log(error);
      });
  }

  const getAlarms = async () => {
    axios
      .get(BACKEND_URL + '/alarms', {
        headers: {
          Cookie: cookie?.toString(),
        },
      })
      .then(({data: {alarms}}: AxiosResponse<AlarmsResponse, any>) => {
        setAlarms(
          alarms.map(alarm => {
            let recurrence =
              AlarmRecurrence[alarm.recurrence as keyof typeof AlarmRecurrence];
            let dateNumber = Date.parse(alarm.date);

            if (isNaN(dateNumber)) {
              console.log("coudln't parse date");
            }
            let date = new Date(dateNumber);

            return new Alarm(date, recurrence);
          }),
        );
      })
      .catch((error: AxiosError<String, any>) => {
        console.log(error.toJSON());
        handleLogout();
      });
  };

  useQuery('alarms', getAlarms);

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

      <TouchableOpacity style={styles.btn}>
        <Text onPress={syncAlarmsWithServer}>Sync</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
