import * as React from 'react';
import {Text} from 'react-native';
import Alarm from '../utils/alarm';

const AlarmView: React.FC<{
  mini?: boolean;
  alarm: Alarm;
}> = ({mini, alarm}) => {
  return (
    <Text>
      {mini ? 'true' : 'false'} -- {alarm.recurrence} -- {alarm.date.getDate()}{' '}
      {alarm.date.getHours()}:{alarm.date.getMinutes()}:
      {alarm.date.getSeconds()}
    </Text>
  );
};

export default AlarmView;
