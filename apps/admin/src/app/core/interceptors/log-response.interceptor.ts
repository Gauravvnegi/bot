import { SharedLogResponseInterceptor } from 'libs/shared/interceptors/src';
import { Injectable } from '@angular/core';
import { NGXLogger, NGXLogInterface } from 'ngx-logger';

@Injectable()
export class LogResponseInterceptor extends SharedLogResponseInterceptor {
  constructor(private logger: NGXLogger) {
    super(logger);
  }
}
