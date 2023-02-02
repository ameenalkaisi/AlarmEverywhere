import {BACKEND_URL} from '@env';
import axios, {AxiosError, AxiosResponse} from 'axios';
import Alarm, {AlarmRecurrence} from './alarm';

export interface AlarmsResponse {
  alarms: AlarmResponse[];
}

export interface AlarmResponse {
  date: string;
  recurrence: string;
}

export const getAlarmsFromServer = async (
  cookie: String,
  onError: (error: any) => void = _ => {},
) => {
  let newAlarms: Alarm[] = [];
  await axios
    .get(BACKEND_URL + '/alarms', {
      headers: {
        Cookie: cookie?.toString(),
      },
    })
    .then(({data: {alarms}}: AxiosResponse<AlarmsResponse, any>) => {
      newAlarms = alarms.map(alarm => {
        let recurrence =
          AlarmRecurrence[alarm.recurrence as keyof typeof AlarmRecurrence];
        let dateNumber = Date.parse(alarm.date);

        if (isNaN(dateNumber)) {
          console.log("couldn't parse date");
        }
        let date = new Date(dateNumber);
        return new Alarm(date, recurrence);
      });
    })
    .catch((error: AxiosError<String, any>) => {
      console.log(error.toJSON());
      onError(error);
    });

  return newAlarms;
};

export const saveAlarmsToServer = async (
  alarms: Alarm[],
  cookie: String,
  onError: (error: any) => void = _ => {},
) => {
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
      onError(error);
    });
};
