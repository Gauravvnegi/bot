import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class TokenRetievalInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('login') || req.url.includes('verify-token')) {
      console.log('running token reciever interceptor inside login req only');
      return next.handle(req).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this._authService.setTokenByName(
              'x-access-token',
              event.headers.get('x-access-token')
            );

            this._authService.setTokenByName(
              'x-access-refresh-token',
              event.headers.get('x-access-refresh-token')
            );

            this._authService.setTokenByName(
              'x-userId',
              event.headers.get('x-userId')
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
