import {BACKEND_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import * as React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useQuery} from 'react-query';
import {AppContext} from '../App';
import AlarmView from '../components/AlarmView';
import {getAlarmsFromServer, saveAlarmsToServer} from '../utils/server';
import {RootStackParamList, styles} from '../_app';
import PushNotification, {
  PushNotificationScheduleObject,
} from 'react-native-push-notification';
import Alarm from '../utils/alarm';

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

  // todo, put this function in a notification.ts under utils
  function syncToLocal() {
    // probably delete all alarms, then recreate them
    PushNotification.cancelAllLocalNotifications();
    alarms.forEach((alarm: Alarm) => {
      const newNotification: PushNotificationScheduleObject = {
        channelId: 'alarm_everywhere_channel',
        date: alarm.date,

        playSound: true,
        // vibration: 1500,
        autoCancel: false,
        visibility: "public",
        onlyAlertOnce: false,
        allowWhileIdle: true,
        title: 'Alarm!',
        message: 'Your alarm is up!',
      };

      console.log('scheduling: ' + newNotification.date);
      PushNotification.localNotificationSchedule(newNotification);
    });

    PushNotification.getScheduledLocalNotifications(notifs => {
      console.log(notifs);
    });
  }

  useQuery('alarms', async () => {
    setAlarms(await getAlarmsFromServer(cookie ?? '', handleLogout));
  });

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
        <Text
          onPress={() => {
            saveAlarmsToServer(alarms, cookie ?? '');
          }}>
          Sync
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn}>
        <Text
          onPress={() => {
            navigation.push('EditAlarm', {
              alarmIndex: -1,
            });
          }}>
          New Alarm
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn}>
        <Text onPress={syncToLocal}> Sync Local Alarms </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn}>
        <Text onPress={handleLogout}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
