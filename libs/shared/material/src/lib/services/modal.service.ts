import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QrCodeModalContent } from 'libs/admin/shared/src/lib/components/qr-code-modal/qr-code-modal.component';

@Injectable()
export class ModalService {
  constructor(private _dialog: MatDialog) {}

  __config: QrCodeModalContent;
  openDialog(component, config?): MatDialogRef<any> {
    return this._dialog.open(component, {
      width: config.width,
      data: config.data,
      disableClose: config.disableClose,
    });
  }

  openDialogWithRef(templateRef, config?): MatDialogRef<any> {
    return this._dialog.open(templateRef, config);
  }

  close() {
    this._dialog.closeAll();
  }
}
