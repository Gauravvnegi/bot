import { Injectable } from '@angular/core';
import { TokenRetievalInterceptor as BaseRetrievalInterceptor } from 'libs/web-user/templates/temp000001/src/lib/interceptors/token-retrieval.interceptor';

@Injectable()
export class TokenRetrievalInterceptor extends BaseRetrievalInterceptor {}
