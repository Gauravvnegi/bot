import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarHandlerService } from '../../../../../../../../../libs/admin/global-shared/src/lib/services/snackbar-handler.service';
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private _snackBar: MatSnackBar,
    private readonly injector: Injector,
    public snackbarHandler: SnackbarHandlerService
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
          const cdkOverlayContainer = document.querySelector(
            '.cdk-overlay-container'
          ) as HTMLElement;

          if (cdkOverlayContainer) {
            // Increase the z-index before showing the snackbar
            cdkOverlayContainer.style.zIndex = '1500';
            if (this.snackbarHandler.isDecreaseSnackbarZIndex) {
              setTimeout(() => {
                cdkOverlayContainer.style.zIndex = '1000';
              }, 3000);
            }
          }

          const handleTranslation = (translatedText) => {
            const translationToBeShown = priorityMessage || translatedText;
            this._snackBar.open(translationToBeShown, '', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'danger',
            });
            return translationToBeShown;
          };

          forkJoin([
            translateService.get(translateKey1),
            translateService.get(translateKey2),
          ]).subscribe(([msg1, msg2]) => {
            handleTranslation(msg1);
            handleTranslation(msg2);
          });
        } catch {
          console.error('Error: Translation Text is not available');
        }

        return throwError(err);
      })
    );
  }
}
