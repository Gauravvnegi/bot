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
export class TokenRetrievalInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('login') || req.url.includes('verify-token')) {
      console.log('running token receiver interceptor inside login req only');
      return next.handle(req).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this._authService.setTokens(event.headers);
          }
          return event;
        })
      );
    } else {
      console.log('running token receiver interceptor for other requests');
      return next.handle(req);
    }
  }
}
