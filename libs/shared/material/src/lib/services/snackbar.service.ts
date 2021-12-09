import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ComponentType } from '@angular/cdk/portal';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

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

  translateText(text: string) {
    return this._translate.get(text);
  }
}
