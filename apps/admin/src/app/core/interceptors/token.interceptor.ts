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
export class TokenInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this._authService.isAuthenticated() && !req.url.includes('refresh')) {
      console.log('authenticated user so adding token');
      const modifiedRequest = req.clone({
        setHeaders: {
          'x-authorization': this._authService.getTokenByName(
            'x-authorization'
          ),
          'x-access-token': this._authService.getTokenByName('x-access-token'),
        },
      });
      return next.handle(modifiedRequest);
    } else {
      console.log('not authenticated user so no token or a route for refresh');

      return next.handle(req);
    }
  }
}
