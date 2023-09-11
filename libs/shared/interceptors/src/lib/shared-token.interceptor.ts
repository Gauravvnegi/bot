import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';
import { TokensConfig } from 'apps/web-user/src/app/core/types/common.types';

@Injectable()
export class SharedTokenInterceptor implements HttpInterceptor {
  private tokenHeaderName: string;
  private tokenValue: string;
  private entityId: string;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!isEmpty(this.tokenHeaderName) && !isEmpty(this.tokenValue)) {
      const modifiedRequest = req.clone({
        setHeaders: {
          [`${this.tokenHeaderName}`]: this.tokenValue,
          ...(this.entityId ? { 'entity-id': this.entityId } : {}),
        },
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(req);
  }

  setHeaderName(headerName: string) {
    this.tokenHeaderName = headerName;
  }

  setTokenValue(tokenValue: TokensConfig) {
    this.tokenValue = tokenValue.accessToken;
    this.entityId = tokenValue.entityId;
  }

  setEntityId(value: string) {
    this.entityId = value;
  }
}
