import { SharedLogResponseInterceptor } from 'libs/shared/interceptors/src';
import { Injectable } from '@angular/core';

@Injectable()
export class LogResponseInterceptor extends SharedLogResponseInterceptor {
  constructor() {
    super();
  }
}
