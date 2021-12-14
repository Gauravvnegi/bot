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

@Injectable()
export class SnackBarService {
  constructor(
    private _snackBar: MatSnackBar,
    private _translate: TranslateService
  ) {}

  /**
   * @function openSnackBarAsText to display snackbar.
   * @param {string} meesage to have message.
   * @param {string} action  optional param
   * @param {object} config - optional param takes default values from matsnackbar
   * @returns {object} snackbar from matsnackbar
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
   * @function openSnackBarAsComponent to display snackbar.
   * @param {any} component component
   * @param {object} config  optional with default configs from matsnackbar
   * @returns {object} snackbar from matsnackbar
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
   * @function openSnackBarWithTranslate to display snackbar with translated message.
   * @param {object} data to display message.
   * @param {string} action  optional
   * @param {object} config optional takes class with default value
   * @returns {object} snackbar from openSnackBarAsText & observable from translation
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

    return this._translate
      .get(translateKey)
      .pipe(map((msg) => handleTranslation(msg)));
  }
}
