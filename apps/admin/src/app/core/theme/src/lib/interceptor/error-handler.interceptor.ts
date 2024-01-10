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
          const translateKey1 = `messages.error.${err.error?.type}`;
          const translateKey2 = `messages.error.${
            statusCode == 403 ? 'forbiddenErr' : 'unknownErr'
          }`;
          const priorityMessage = err.error?.message;

          forkJoin([
            translateService.get(translateKey1),
            translateService.get(translateKey2),
          ]).subscribe(([msg1, msg2]) => {
            [
              [msg1, translateKey1],
              [msg2, translateKey2],
            ].forEach((data) => {
              const translationToBeShown = priorityMessage || data[0];
              if (data[0] !== data[1]) {
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
