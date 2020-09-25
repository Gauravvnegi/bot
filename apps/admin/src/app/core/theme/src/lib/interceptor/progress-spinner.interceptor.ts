import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProgressSpinnerService } from '../services/progress-spinner.service';

@Injectable()
export class ProgressSpinnerInterceptor implements HttpInterceptor {
  constructor(private _progressSpinnerService: ProgressSpinnerService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this._progressSpinnerService.isProgressSpinnerVisible = true;
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this._progressSpinnerService.isProgressSpinnerVisible = false;
        }
        return event;
      })
    );
  }
}
