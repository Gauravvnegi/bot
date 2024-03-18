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

/**
 * @function formatEpochTime
 * @param epochTime - Epoch time in milliseconds
 * @returns A string representing the time in 12-hour format with AM/PM
 */
export function formatEpochTime(epochTime: number): string {
  return new Date(epochTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * @function getFormattedDateWithTime
 * @param time - Epoch time in milliseconds
 * @returns A string representing the date and time in the format: "YYYY-MM-DD, HH:MM:SS"
 */
export function getFormattedDateWithTime(time: number) {
  if (!time) return; // Return undefined if time is not provided
  const currentDate = new Date(time);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const date = currentDate.getDate().toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${date}, ${hours}:${minutes}:${seconds}`;
}

/**
 * @function getFormattedDate
 * @param time - Epoch time in milliseconds
 * @returns A string representing the date in the format: "MMM DD, YYYY"
 */
export function getFormattedDate(time: number) {
  if (!time) return; // Return undefined if time is not provided
  const currentDate = new Date(time);
  const monthAbbreviated = new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(currentDate);
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();
  return `${monthAbbreviated} ${date}, ${year}`;
}
