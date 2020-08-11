import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Inject, Injector } from '@angular/core';

@Injectable()
export class SharedTokenInterceptor implements HttpInterceptor {
  private tokenHeaderName: string;
  private tokenValue: string;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedRequest = req.clone({
      setHeaders: {
        [`${this.tokenHeaderName}`]: this.tokenValue
      }
    });

    return next.handle(modifiedRequest);
  }

  setHeaderName(headerName: string) {
    this.tokenHeaderName = headerName;
  }

  setTokenValue(tokenValue: string) {
    this.tokenValue = tokenValue;
  }
}
