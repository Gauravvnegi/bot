import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Inject, Injector } from '@angular/core';
import { isEmpty } from 'lodash';

@Injectable()
export class SharedTokenInterceptor implements HttpInterceptor {
  private tokenHeaderName: string;
  private tokenValue: string;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!isEmpty(this.tokenHeaderName) && !isEmpty(this.tokenValue)) {
      const modifiedRequest = req.clone({
        setHeaders: {
          [`${this.tokenHeaderName}`]: this.tokenValue,
        },
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(req);
  }

  setHeaderName(headerName: string) {
    this.tokenHeaderName = headerName;
  }

  setTokenValue(tokenValue: string) {
    this.tokenValue = tokenValue;
  }
}
