import { PipeTransform, Pipe } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'repeater',
})
export class RepeaterPipe implements PipeTransform {
  transform(settings: any, obj: any) {
    if (!settings.value.length) return;

    let tempValue = '';

    const tempPath: string[] = settings.path
      .replace(/\s*,\s*/gi, ',')
      .trim()
      .split(',');

    for (const path of tempPath) {
      if (path) {
        tempValue = tempValue
          .concat(_.get(obj, path.substr(path.lastIndexOf('.') + 1)))
          .concat(' ');
      }
    }

    return tempValue.trim();
  }
}
