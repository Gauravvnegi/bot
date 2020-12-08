import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Injectable()
export class TimezoneInterceptor implements HttpInterceptor {
  constructor(private _dateService: DateService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedRequest = req.clone({
      setHeaders: {
        'x-timezone': this._dateService.getCurrentTimeZone(),
      },
    });
    return next.handle(modifiedRequest);
  }
}
