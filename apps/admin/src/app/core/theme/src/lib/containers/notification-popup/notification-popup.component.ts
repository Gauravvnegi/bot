import { Component, EventEmitter, Output } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss'],
})
export class NotificationPopupComponent {
  allowNotification: boolean;
  @Output() onNotificationClose = new EventEmitter();
  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {
    this.allowNotification = false;
    /**
     * @remark extracting data from dialog config
     */
    if (this.dialogConfig?.data) {
      Object.entries(this.dialogConfig.data).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  }

  closeNotes() {
    this.dialogRef.close({ close: true });
    this.onNotificationClose.emit({ close: true });
  }

  acceptNotification() {
    this.allowNotification = true;
  }

  allowNotificationValue() {
    return !!this.allowNotification;
  }

  openSettings() {
    const link = document.createElement('a');
    link.href = 'chrome://settings/';
    link.target = '_blank';
    link.click();
    link.remove();
  }
}
