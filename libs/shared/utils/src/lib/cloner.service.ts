import { Injectable } from '@angular/core';
import * as clone from 'clone';

@Injectable()
export class ClonerService {
  deepClone<T>(value): T {
    return clone<T>(value);
  }
}
