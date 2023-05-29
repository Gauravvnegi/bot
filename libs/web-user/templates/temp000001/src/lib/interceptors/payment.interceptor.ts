import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@hospitality-bot/web-user/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('payment-configuration')) {
      const modifiedRequest = req.clone({
        setHeaders: {
          key: environment.paymentApiKey,
        },
      });
      return next.handle(modifiedRequest);
    }

    return next.handle(req);
  }
}
