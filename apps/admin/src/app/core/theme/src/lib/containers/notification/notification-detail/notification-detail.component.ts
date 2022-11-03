import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from '../../../data-models/notifications.model';

@Component({
  selector: 'admin-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss'],
})
export class NotificationDetailComponent {
  @Input() data: Notification;
  @Output() onNotificationClose = new EventEmitter();

  closeNotes() {
    this.onNotificationClose.emit({ close: true });
  }
}
