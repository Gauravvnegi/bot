import * as moment from 'moment';

export function dateTimeWithFormat(value: any) {
  return moment(value).format('DD-MM-YYYY');
}
