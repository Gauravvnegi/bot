import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokensConfig } from 'libs/admin/shared/src/lib/constants/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

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
      const entityId =
        req.headers.get('entity-id') ??
        this._authService.getTokenByName(tokensConfig.entityId);

      const modifiedRequest = req.clone({
        setHeaders: {
          [tokensConfig.accessToken]: this._authService.getTokenByName(
            tokensConfig.accessToken
          ),
          [tokensConfig.userId]: this._authService.getTokenByName(
            tokensConfig.userId
          ),

          ...(entityId
            ? {
                ['entity-id']:
                  req.headers.get('entity-id') ??
                  this._authService.getTokenByName(tokensConfig.entityId),
              }
            : {}),

          // Custom user agent in case device and logout api
          ...(req.url.includes('device') || req.url.includes('logout')
            ? {
                [tokensConfig.userAgent]: this._authService.getUniqueUserAgent(),
              }
            : {}),
        },
      });
      return next.handle(modifiedRequest);
    } else {
      console.log('not authenticated user so no token or a route for refresh');
      return next.handle(req);
    }
  }
}
