import PushNotification, {
  PushNotificationScheduleObject,
} from 'react-native-push-notification';
import Alarm from './alarm';

// deletes all alarms
// todo: add the file into ios through xcode
//  I don't have a mac and can't find resources
//  on how to add a resource without xcode
export function saveAlarmsToPhone(alarms: Alarm[]): void {
  PushNotification.cancelAllLocalNotifications();
  alarms.forEach((alarm: Alarm) => {
    // todo: set an alarming sound to play, use soundName property
    // make sure to add to proper location set in the docs
    const newNotification: PushNotificationScheduleObject = {
      channelId: 'alarm_everywhere_channel',
      date: alarm.date,

      // vibration: 1500,
      title: 'Alarm!',
      message: 'Your alarm is up!',

      soundName: 'clocksounds.mp3',
      playSound: true,
      vibrate: true,
      repeatType: 'minute',
      allowWhileIdle: true,
    };

    PushNotification.localNotificationSchedule(newNotification);
  });

  // for testing
  // PushNotification.getScheduledLocalNotifications(notifs => {
  //   console.log(notifs);
  // });
}
