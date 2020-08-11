import { SharedTokenInterceptor } from 'libs/shared/interceptors/src';
import { Injectable } from '@angular/core';

@Injectable()
export class TokenInterceptor extends SharedTokenInterceptor {
  constructor() {
    super();
    this.setHeaderName('Authorization');
    this.setTokenValue('test-token');
  }
}
