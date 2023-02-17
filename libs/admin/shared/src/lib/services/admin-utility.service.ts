import { Injectable } from '@angular/core';
import { has, isBoolean } from 'lodash';
@Injectable({ providedIn: 'root' })
export class AdminUtilityService {
  constructor() {}

  makeQueryParams(queries = [], callingMethod?) {
    if (!queries.length) {
      return;
    }
    const queryObj = queries.reduce((acc, curr) => {
      for (let key in curr) {
        // TO_DO: Readme
        let currValue = curr[key];
        if (currValue || isBoolean(currValue)) {
          if (has(acc, key)) {
            acc[key] = [acc[key], currValue].join(',');
          } else if (currValue !== null && currValue !== undefined) {
            acc[key] = currValue;
          }
        }
      }

      return { ...acc };
    }, {});

    let queryStr = '';

    queryStr = Object.keys(queryObj)
      .map((key) => `${key}=${queryObj[key]}`)
      .join('&');

    return `?${queryStr}`;
  }

  getToDate(globalQueries) {
    return globalQueries
      .map((data) => {
        if (data.toDate) {
          return data.toDate;
        }
      })
      .join('');
  }

  static valueFormatter = (num, digits) => {
    const si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'MM' },
      { value: 1e9, symbol: 'B' },
      { value: 1e12, symbol: 'T' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return `${(num / si[i].value).toFixed(digits).replace(rx, '$1')} ${
      si[i].symbol
    }`;
  };

  compareArray(array1, array2) {
    const array2Sorted = array2.slice().sort();
    return (
      array1.length === array2.length &&
      array1
        .slice()
        .sort()
        .every(function (value, index) {
          return value === array2Sorted[index];
        })
    );
  }

  getDateFormatFromInterval(interval) {
    return interval === 'date'
      ? 'DD MMM'
      : interval === 'month'
      ? 'MMM YYYY'
      : '';
  }
}
