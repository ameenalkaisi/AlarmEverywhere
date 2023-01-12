export default class Alarm {
  date: Date;
  recurrence: AlarmRecurrence;

  constructor(date: Date, recurrence?: AlarmRecurrence) {
    this.date = date;
    this.recurrence = recurrence ?? AlarmRecurrence.NONE;
  }
}

export enum AlarmRecurrence {
  HOURLY,
  DAILY,
  WEEKLY,
  BIWEEKLY,
  MONTHLY,
  YEARLY,
  NONE,
}
