import * as moment from 'moment';

export function dateTimeWithFormat(
  value: any,
  formate: 'DD-MM-YYYY' | string = 'DD-MM-YYYY'
) {
  return moment(value).format(formate);
}

export function formatDateToCustomString(dateMS: number) {
  const date = new Date(dateMS);
  const months = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });

  return `${months} ${day}, ${year} ${dayOfWeek}`;
}

export function getDateTimeInEpoch(data: {
  time: number;
  isHourseReset?: boolean;
}) {
  const time = new Date(data.time);
  if (data.isHourseReset) {
    time.setHours(0, 0, 0, 0);
  }

  return {
    time: time.getTime(),
  };
}

export function getCurrentYearStartDate() {
  // Get the current date
  const currentDate = new Date();

  // Set the month and day to January 1st of the current year
  const currentYearStartDate = new Date(currentDate.getFullYear(), 0, 1);
  return currentYearStartDate.getTime();
}
