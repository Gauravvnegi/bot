import { Pipe, PipeTransform } from '@angular/core';
import { Regex } from '../constants/regex';
@Pipe({
  name: 'linkDetector',
})
export class LinkDetector implements PipeTransform {
  transform(value: string) {
    return value.replace(Regex.URL_REGEX, function (url) {
      var hyperlink = url;
      if (!(hyperlink.match('^https?://') || hyperlink.match('^http?://'))) {
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
