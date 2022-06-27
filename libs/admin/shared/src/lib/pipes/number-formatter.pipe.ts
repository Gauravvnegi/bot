import { DomSanitizer } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'numberFormat' })
export class NumberFormatterPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value, digits = 2) {
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return value >= item.value;
      });
    return item
      ? (value / item.value).toFixed(digits).replace(rx, '$1') +
          ` ${item.symbol}`
      : '0';
  }
}
