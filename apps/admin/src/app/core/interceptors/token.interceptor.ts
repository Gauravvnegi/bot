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
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService, private _router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this._authService.isAuthenticated() &&
      !req.url.includes('refresh') &&
      req.url.includes(this._authService.getBaseUrl())
    ) {
      console.log('authenticated user so adding token');
      const modifiedRequest = req.clone({
        setHeaders: {
          'x-authorization': this._authService.getTokenByName(
            'x-authorization'
          ),
          'x-access-token': this._authService.getTokenByName('x-access-token'),
          'x-userId': this._authService.getTokenByName('x-userId'),
        },
      });
      return next.handle(modifiedRequest);
    } else {
      console.log('not authenticated user so no token or a route for refresh');
      return next.handle(req);
    }
  }
}
