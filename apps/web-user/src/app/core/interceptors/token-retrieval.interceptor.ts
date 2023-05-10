import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { AccessTokenService } from 'apps/web-user/src/app/core/services/access-token.service';
@Injectable()
export class TokenRetrievalInterceptor implements HttpInterceptor {
  constructor(private _accessTokenService: AccessTokenService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && req.url.includes('decrypt')) {
          const accessToken = event.headers.get('x-access-token');
          if (!isEmpty(accessToken)) {
            this._accessTokenService.setAccessToken(accessToken);
          }
        }
        return event;
      })
    );
  }
}
