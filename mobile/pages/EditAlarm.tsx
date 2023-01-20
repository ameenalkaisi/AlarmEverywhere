import {Picker} from '@react-native-picker/picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, Button} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {AppContext} from '../App';
import Alarm, {AlarmRecurrence} from '../utils/alarm';
import {RootStackParamList, styles} from '../_app';

// if alarmIndex == -1, then it is create mode
const EditAlarm: React.FC<
  NativeStackScreenProps<RootStackParamList, 'EditAlarm'>
> = ({route, navigation}) => {
  const {alarms, setAlarms} = React.useContext(AppContext);

  // initalized to null if on create mode, otherwise set to original alarm
  const [date, setDate] = React.useState<Date>(
    route.params.alarmIndex == -1
      ? new Date()
      : alarms[route.params.alarmIndex].date,
  );

  // todo, set up input for recurrence mode
  const [recur, setRecur] = React.useState<AlarmRecurrence>(
    route.params.alarmIndex == -1
      ? AlarmRecurrence.NONE
      : alarms[route.params.alarmIndex].recurrence,
  );

  return (
    <View style={styles.container}>
      <DatePicker date={date} onDateChange={setDate} />
      <Picker
        selectedValue={recur}
        onValueChange={(itemValue, _) => {
          setRecur(itemValue);
        }}
        style={{width: '80%'}}>
        <Picker.Item label="HOURLY" value={AlarmRecurrence.HOURLY} />
        <Picker.Item label="DAILY" value={AlarmRecurrence.DAILY} />
        <Picker.Item label="WEEKLY" value={AlarmRecurrence.WEEKLY} />
        <Picker.Item label="BIWEEKLY" value={AlarmRecurrence.BIWEEKLY} />
        <Picker.Item label="MONTHLY" value={AlarmRecurrence.MONTHLY} />
        <Picker.Item label="YEARLY" value={AlarmRecurrence.YEARLY} />
        <Picker.Item label="NONE" value={AlarmRecurrence.NONE} />
      </Picker>
      <Button
        title="Submit"
        onPress={() => {
          let newAlarm = new Alarm(date, recur);

          let newAlarms = alarms.slice();

          if (route.params.alarmIndex != -1)
            newAlarms[route.params.alarmIndex] = newAlarm;
          else newAlarms.push(newAlarm);

          setAlarms(newAlarms);
          navigation.pop();
        }}
      />
      {route.params.alarmIndex != -1 && (
        <Button
          title="Delete"
          onPress={() => {
            setAlarms(
              alarms.slice().filter((_: Alarm, index: number) => {
                return index != route.params.alarmIndex;
              }),
            );

            navigation.pop();
          }}
        />
      )}
    </View>
  );
};

export default EditAlarm;
