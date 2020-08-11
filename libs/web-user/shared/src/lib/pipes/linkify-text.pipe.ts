import { PipeTransform, Pipe, Renderer2 } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'linkifyText',
})
export class LinkifyTextPipe implements PipeTransform {
  constructor(private _renderer: Renderer2) {}

  transform(values: any): string {
    const value = ''
      .concat(_.get(values, 'prefixString'))
      .concat(
        `<span style="color:blue; text-decoration: underline; cursor: pointer;">${_.get(
          values,
          'linkedString'
        )}</span>`
      )
      .concat(_.get(values, 'suffixString'));

    return value || '';
  }
}
