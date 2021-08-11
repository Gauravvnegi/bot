import { Pipe, PipeTransform } from '@angular/core';
import { urlRegex } from '../constants/linkRegex';
@Pipe({
  name: 'linkDetector',
})
export class LinkDetector implements PipeTransform {
  transform(value: string) {
    return value.replace(urlRegex, function (url) {
      var hyperlink = url;
      if (!hyperlink.match('^https?://')) {
        hyperlink = 'http://' + hyperlink;
      }
      return (
        '<a href="' +
        hyperlink +
        '" target="_blank" rel="noopener noreferrer">' +
        url +
        '</a>'
      );
    });
  }
}
