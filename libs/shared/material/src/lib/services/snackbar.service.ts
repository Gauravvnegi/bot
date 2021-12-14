import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  SimpleSnackBar
} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

type SnackBarWithTranslateData = {
  translateKey: string;
  priorityMessage: string;
};

@Injectable()
export class SnackBarService {
  constructor(
    private _snackBar: MatSnackBar,
    private _translate: TranslateService
  ) {}

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

  openSnackBarAsComponent(
    component: ComponentType<any>,
    config?: MatSnackBarConfig
  ): MatSnackBarRef<any> {
    return this._snackBar.openFromComponent(component, {
      duration: config.duration || 2000,
    });
  }

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
