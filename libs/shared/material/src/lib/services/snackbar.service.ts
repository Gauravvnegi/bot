import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { SnackBarWithTranslateData } from '../types/snackbar.type';

/**
 * @class To manage all the operations related to snackbar.
 */
@Injectable()
export class SnackBarService {
  constructor(
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService
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
    config?: MatSnackBarConfig
  ): MatSnackBarRef<SimpleSnackBar> {
    return this._snackBar.open(message, action, {
      duration: _.get(config, ['duration'], 2000),
      horizontalPosition: _.get(config, ['horizontalPosition'], 'right'),
      verticalPosition: _.get(config, ['verticalPosition'], 'top'),
      panelClass: _.get(config, ['panelClass'], 'danger'),
    });
  }

  /**
   * @function openSnackBarAsComponent To open snackbar.
   * @param component Component to be instantiated.
   * @param config  Extra configuration for the snack bar.
   * @returns Reference to a snack bar dispatched from the snack bar service.
   */
  openSnackBarAsComponent(
    component: ComponentType<any>,
    config?: MatSnackBarConfig
  ): MatSnackBarRef<any> {
    return this._snackBar.openFromComponent(component, {
      duration: config.duration || 2000,
    });
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
    config?: MatSnackBarConfig
  ) {
    const { translateKey, priorityMessage } = data;

    const handleTranslation = (translatedText) => {
      const translationToBeShown = priorityMessage || translatedText;
      this.openSnackBarAsText(translationToBeShown, action, config);
      return translationToBeShown;
    };

    return this._translateService
      .get(translateKey)
      .pipe(map((msg) => handleTranslation(msg)));
  }
}
