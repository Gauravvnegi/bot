import { Injectable } from '@angular/core';
import { PaymentInterceptor as BasePaymentInterceptor } from 'libs/web-user/templates/temp000001/src/lib/interceptors/payment.interceptor';

@Injectable()
export class PaymentInterceptor extends BasePaymentInterceptor {}
