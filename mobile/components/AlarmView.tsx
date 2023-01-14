import * as React from 'react';
import {Text} from 'react-native';
import Alarm, {AlarmRecurrence} from '../utils/alarm';

const AlarmView: React.FC<{
  mini?: boolean;
  alarm: Alarm;
}> = ({mini, alarm}) => {
  let curDate = new Date(alarm.date);
  return (
    <Text>
      {mini ? 'true' : 'false'} -- {AlarmRecurrence[alarm.recurrence]} --{' '}
      {curDate.getDate()} {curDate.getHours()}:{curDate.getMinutes()}:
      {curDate.getSeconds()}
    </Text>
  );
};

export default AlarmView;
