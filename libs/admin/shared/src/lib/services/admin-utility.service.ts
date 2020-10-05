import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminUtilityService {
  constructor() {}

  makeQueryParams(queries = []) {
    if (!queries.length) {
      return;
    }

    const queryObj = queries.reduce((acc, curr) => {
      for (let key in curr) {
        if (acc[key]) {
          acc[key] = [acc[key], curr[key]].join(',');
        } else if (curr[key] !== null && curr[key] !== undefined) {
          acc[key] = curr[key];
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
}
