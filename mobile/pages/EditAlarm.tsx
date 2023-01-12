import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, TextInput, Button} from 'react-native';
import {AppContext} from '../App';
import Alarm, {AlarmRecurrence} from '../utils/alarm';
import {RootStackParamList, styles} from '../_app';

const EditAlarm: React.FC<
  NativeStackScreenProps<RootStackParamList, 'EditAlarm'>
> = ({route, navigation}) => {
  // maybe if route.params.alarmIndex is null, then it is a create page, otherwise it is an edit page
  const {alarms, setAlarms} = React.useContext(AppContext);

  // initalized to null if on create mode, otherwise set to original alarm
  const [dateText, setDateText] = React.useState<string>(
    route.params.alarmIndex == -1
      ? ''
      : alarms[route.params.alarmIndex].date.toString(),
  );

  const [recur, setRecur] = React.useState<AlarmRecurrence>(
    route.params.alarmIndex == -1
      ? AlarmRecurrence.NONE
      : alarms[route.params.alarmIndex].recurrence,
  );

  return (
    <View style={styles.container}>
      <TextInput onChangeText={setDateText}>{dateText}</TextInput>
      {/* todo: alarm recurrence input */}
      <Button
        title="Submit"
        onPress={() => {
          // verify input first
          if (isNaN(Date.parse(dateText))) {
            // todo: set helper text

            console.log("can't parse date");
            return;
          }

          let newAlarm = new Alarm(new Date(Date.parse(dateText)), recur);

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
