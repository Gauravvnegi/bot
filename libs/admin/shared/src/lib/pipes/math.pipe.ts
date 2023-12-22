import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'math',
})
export class MathPipe implements PipeTransform {
  transform(value: number, operation: string): number {
    switch (operation) {
      case 'abs':
        return Math.abs(value);
      case 'round':
        return Math.round(value);
      // Add more cases for other operations as needed
      default:
        return value;
    }
  }
}
