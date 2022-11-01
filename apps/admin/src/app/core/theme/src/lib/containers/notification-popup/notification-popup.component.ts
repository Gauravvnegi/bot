import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss'],
})
export class NotificationPopupComponent {
  allowNotification: boolean;
  @Output() onNotificationClose = new EventEmitter();
  constructor() {
    this.allowNotification = false;
  }

  closeNotes() {
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
