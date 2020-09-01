import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpEventType,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
//import { NGXLogger, NGXLogInterface } from 'ngx-logger';

@Injectable()
export class SharedLogResponseInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const started = Date.now();

    return next.handle(req).pipe(
      tap((event) => {
        const elapsed = Date.now() - started;

        console.log(`${req.method} "${req.urlWithParams}" took ${elapsed} ms.`);

        if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      }),
      catchError((err: HttpErrorResponse) => {
        //this._logger.error(err.message);
        return throwError(err);
      })
    );
  }
}
