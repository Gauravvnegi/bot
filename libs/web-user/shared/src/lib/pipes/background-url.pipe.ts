import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asBgUrl',
})
export class BackgroundUrlPipe implements PipeTransform {
  transform(value: string): any {
    return `url('${value}')`;
  }
}

//  `url('${value}') center center cover no-repeat fixed`;