import { ProgressSpinnerService } from './../services/progress-spinner.service';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarHandlerService } from 'libs/admin/global-shared/src/lib/services/snackbar-handler.service';
import { ToastKeys } from 'libs/shared/material/src/lib/types/snackbar.type';
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private readonly injector: Injector,
    public snackbarHandler: SnackbarHandlerService,
    private _progressSpinnerService: ProgressSpinnerService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        try {
          const statusCode = err.error?.status;
          const translateService = this.injector.get(TranslateService);
          const priorityMessage = err.error?.message;

          // Define translation keys and corresponding error types
          /**
           * @var forbiddenStatusCode list of status code which you want to show forbidden error
           * @var unAuthStatusCode status code which you want to show in unauthorized
           * @var translationKeys all keys which you want to apply,
           * key will selected based on their translation or priority
           */
          const baseKey = `messages.error`;
          const forbiddenStatusCode = [403];
          const unAuthStatusCode = [401];
          const translationKeys: Record<number, string> = {
            1: `${baseKey}.${err.error?.type}`,
            2: `${baseKey}.${
              forbiddenStatusCode.includes(statusCode)
                ? 'forbiddenErr'
                : 'unknownErr'
            }`,
            3: `${baseKey}.${
              unAuthStatusCode.includes(statusCode) ? 'unAuthErr' : 'unknownErr'
            }`,
            // Add more keys as needed..........
          };

          /**
           * @var translationObservables is Map translation keys to an array of Observables
           */
          const translationObservables: Observable<string>[] = Object.values(
            translationKeys
          ).map((key) => translateService.get(key));

          /**
           * @function forkJoin(translationObservables) translate the
           * list of translationObservables
           */
          forkJoin(translationObservables)
            .pipe(
              catchError(() => translateService.get(`${baseKey}.unknownErr`))
            )
            .subscribe((messages: string[]) => {
              messages.forEach((message, index) => {
                const translationToBeShown =
                  statusCode == 500 ? message : priorityMessage || message;
                const translationKey = Object.values(translationKeys)[index];

                // Showing only that message, which is translated successfully
                if (message !== translationKey) {
                  this._progressSpinnerService.$snackbarChange.next({
                    detail: translationToBeShown,
                    severity: 'error',
                    key: ToastKeys.default,
                    position: 'top-right',
                    life: 3000,
                    closable: false,
                  });
                }
              });
            });
        } catch {
          console.error('Error: Translation Text is not available');
        }

        return throwError(err);
      })
    );
  }
}
