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
