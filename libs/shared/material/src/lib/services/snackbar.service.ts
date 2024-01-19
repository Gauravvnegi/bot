import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import {
  MessageSnackbarConfig,
  SnackBarConfig,
  SnackBarWithTranslateData,
  ToastKeys,
} from '../types/snackbar.type';
import { SnackbarHandlerService } from '../../../../../admin/global-shared/src/lib/services/snackbar-handler.service';
import { MessageService } from 'primeng/api';

/**
 * @class To manage all the operations related to snackbar.
 */
@Injectable()
export class SnackBarService {
  constructor(
    public messageService: MessageService,
    private _translateService: TranslateService,
    public snackbarHandler: SnackbarHandlerService
  ) {}

  /**
   * @function openSnackBarAsText To open snackbar.
   * @param message The message to show in the snackbar.
   * @param action  The label for the snackbar action.
   * @param config  Additional configuration options for the snackbar.
   * @returns Reference to a snack bar dispatched from the snack bar service.
   */
  openSnackBarAsText(
    message: string,
    action?: string,
    config?: SnackBarConfig & MessageSnackbarConfig
  ) {
    const panelClass = config?.panelClass ?? 'error';
    const duration = config?.panelClass === 'danger' ? 3000 : 2000;

    this.messageService.clear();
    this.messageService.add({
      ...config,
      detail: message,
      life: duration,
      closable: !!action?.length,
      severity: panelClass,
      position: 'top-right',
      key: config?.key ?? ToastKeys.default,
    } as MessageSnackbarConfig);
  }

  /**
   * @function openSnackBarWithTranslate To open snackbar.
   * @param data The message to show in the snackbar.
   * @param action  The label for the snackbar action.
   * @param config Additional configuration options for the snackbar.
   * @returns Observable with translated message.
   */
  openSnackBarWithTranslate(
    data: SnackBarWithTranslateData,
    action?: string,
    config?: SnackBarConfig
  ) {
    const { translateKey, priorityMessage } = data;

    const handleTranslation = (translatedText) => {
      const translationToBeShown = priorityMessage || translatedText;
      this.openSnackBarAsText(translationToBeShown, action, config);
      return translationToBeShown;
    };
    console.log(this._translateService, ' this._translateService');
    return this._translateService
      .get(translateKey)
      .pipe(map((msg) => handleTranslation(msg)));
  }
}
