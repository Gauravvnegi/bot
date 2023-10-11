import * as moment from 'moment';

export function dateTimeWithFormat(
  value: any,
  formate: 'DD-MM-YYYY' | string = 'DD-MM-YYYY'
) {
  return moment(value).format(formate);
}
