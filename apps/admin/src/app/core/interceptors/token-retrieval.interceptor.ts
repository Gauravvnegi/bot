import { SharedTokenInterceptor } from 'libs/shared/interceptors/src';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isEmpty } from 'lodash';
import { AuthService } from '../auth/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class TokenRetievalInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('login')) {
      console.log('running token reciever interceptor inside login req only');
      return next.handle(req).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this._authService.setTokenByName(
              'x-authorization',
              event.headers.get('x-authorization')
            );

            this._authService.setTokenByName(
              'x-access-token',
              event.headers.get('x-access-token')
            );

            this._authService.setTokenByName(
              'x-refresh-authorization',
              event.headers.get('x-refresh-authorization')
            );

            this._authService.setTokenByName(
              'x-access-refresh-token',
              event.headers.get('x-access-refresh-token')
            );
          }
          return event;
        })
      );
    } else {
      console.log('running token reciver intereceptor for other requests');
      return next.handle(req);
    }
  }
}
