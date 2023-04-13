import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '@hospitality-bot/admin/environment';
import { RefreshTokenInterceptor } from '../interceptors/refresh-token.interceptor';
import { TimezoneInterceptor } from '../interceptors/timezone.interceptor';
import { TokenRetievalInterceptor } from '../interceptors/token-retrieval.interceptor';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { ErrorHandlerInterceptor } from '../theme/src/lib/interceptor/message-handler.interceptor';
import { ProgressSpinnerInterceptor } from '../theme/src/lib/interceptor/progress-spinner.interceptor';

export default [
  {
    provide: 'BASE_URL',
    useValue: environment.base_url,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TimezoneInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenRetievalInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RefreshTokenInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ProgressSpinnerInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorHandlerInterceptor,
    multi: true,
  },
];
