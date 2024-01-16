import { ProgressSpinnerService } from './../services/progress-spinner.service';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarHandlerService } from 'libs/admin/global-shared/src/lib/services/snackbar-handler.service';
import { ToastKeys } from 'libs/shared/material/src/lib/types/snackbar.type';

/**
 * A utility function to create a readonly string literal type from a string key.
 * @param key - The input key.
 * @returns A readonly string literal type.
 */
const asConst = <TKey extends string>(key: TKey) => key;

/**
 * An object that maps HTTP error status codes to corresponding error keys.
 */
const errorCodeKeys = {
  403: asConst('forbiddenErr'), // Key for 403 status code
  401: asConst('unAuthErr'), // Key for 401 status code
  default: asConst('unknownErr'), // Default key for other status codes
};

/**
 * Get the base translation key based on the provided error key.
 * @param key - The error key for which the base translation key is needed.
 * @returns The base translation key.
 */
const getTranslationKeyOf = (key: keyof typeof errorCodeKeys) =>
  `messages.error.${errorCodeKeys[key] ?? 'unknownErr'}`; // Default to 'unknownErr' if key is not found

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
          let translationKey = getTranslationKeyOf(statusCode);

          translateService
            .get(translationKey)
            .pipe(
              switchMap((message) => {
                const translationToBeShown = priorityMessage || message;
                // Check if the translation is the same as the requested translation key
                if (translationToBeShown === translationKey) {
                  // If it's the same, fetch the default 'unknownErr' message
                  return translateService.get(getTranslationKeyOf('default'));
                } else {
                  // If not the same, return the original translated message
                  return of(translationToBeShown);
                }
              })
            )
            .subscribe((message) => {
              this._progressSpinnerService.$snackbarChange.next({
                detail: priorityMessage || message,
                severity: 'error',
                key: ToastKeys.default,
                position: 'top-right',
                life: 3000,
                closable: false,
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
