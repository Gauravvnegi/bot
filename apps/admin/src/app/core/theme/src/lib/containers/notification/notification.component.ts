import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hospitality-bot-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  allowNotification: boolean;
  @Output() onNotificationClose = new EventEmitter();
  constructor() {
    this.allowNotification = false;
  }

  ngOnInit() {}

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
    debugger;
    const link = document.createElement('a');
    link.href = 'chrome://settings/';
    link.target = '_blank';
    link.click();
    link.remove();
  }
}
