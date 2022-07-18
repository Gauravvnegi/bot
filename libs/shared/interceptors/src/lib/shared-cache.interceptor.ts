import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Inject, Injector } from '@angular/core';

@Injectable()
export class SharedCacheInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //
    if (req.method === 'GET') {
      return next.handle(req);
    }
  }
}
