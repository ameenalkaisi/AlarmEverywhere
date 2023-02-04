/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotifications from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

PushNotifications.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    // when the user clicks on the notification, then, delete the alarm
    if (notification.userInteraction === true) {
      // cancel the alarm
      PushNotifications.cancelLocalNotification(notification.id);
    }

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: Platform.OS === 'ios',
});

// for testing
//PushNotifications.deleteChannel('alarm_everywhere_channel');
PushNotifications.createChannel(
  {
    channelId: 'alarm_everywhere_channel',
    channelName: 'AlarmEverywhere Channel',
    channelDescription:
      'Channel for sending alarms form the AlarmEverywhere application',
    soundName: 'alarm_digital_clock.mp3',
    playSound: true,
    vibrate: true,
  },
  created => console.log(`create channel returned ${created}`),
);

PushNotifications.channelBlocked('alarm_everywhere_channel', blocked => {
  if (blocked) console.log('channel is blocked');
});

//PushNotifications.requestPermissions();

AppRegistry.registerComponent(appName, () => App);
