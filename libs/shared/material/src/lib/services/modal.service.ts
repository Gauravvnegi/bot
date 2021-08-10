import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable()
export class ModalService {
  constructor(private _dialog: MatDialog) {}

  openDialog(component, config?): MatDialogRef<any> {
    return this._dialog.open(component, {
      width: config.width,
      data: config.data,
    });
  }

  openDialogWithRef(templateRef, config?): MatDialogRef<any> {
    return this._dialog.open(templateRef, config);
  }

  close() {
    this._dialog.closeAll();
  }
}
