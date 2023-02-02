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

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: Platform.OS === 'ios',
});

PushNotifications.channelExists('alarm_everywhere_channel', exists => {
  if (!exists)
    PushNotifications.createChannel(
      {
        channelId: 'alarm_everywhere_channel',
        channelName: 'AlarmEverywhere Channel',
        channelDescription:
          'Channel for sending alarms form the AlarmEverywhere application',
        playSound: true,
        vibrate: true,
      },
      created => console.log(`create channel returned ${created}`),
    );
  else
    PushNotifications.channelBlocked('alarm_everywhere_channel', blocked =>
      console.log('blocked: ' + blocked),
    );
});

//PushNotifications.requestPermissions();

AppRegistry.registerComponent(appName, () => App);
