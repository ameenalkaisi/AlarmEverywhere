import * as React from 'react';
import {Text, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Alarm, {AlarmRecurrence} from '../utils/alarm';

const AlarmView: React.FC<{
  mini?: boolean;
  alarm: Alarm;
}> = ({mini, alarm}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      {/* todo, set a view up that user can't change */}
      <DatePicker date={alarm.date} style={{height: 50}} />
      <Text>
        {mini ? 'true' : 'false'} -- {AlarmRecurrence[alarm.recurrence]}
      </Text>
    </View>
  );
};

export default AlarmView;
