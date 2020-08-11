import * as dateUtils from './date-utils';
import * as stringUtils from './string-utlis';

const FUNCTION_MAP = {
  date: {
    dateTimeWithFormat: dateUtils.dateTimeWithFormat,
  },
  string: {
    concat: stringUtils.concat,
  },
};

export const FUNCTION_NAMES = {
  date: {
    dateTimeWithFormat: 'dateTimeWithFormat',
  },
  string: {
    concat: 'concat',
  },
};

export function mapper(valueType: string, functionName: string) {
  return FUNCTION_MAP[valueType][functionName];
}
