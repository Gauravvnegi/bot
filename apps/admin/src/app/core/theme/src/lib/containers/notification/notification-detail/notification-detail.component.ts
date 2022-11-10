import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from '../../../data-models/notifications.model';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss'],
})
export class NotificationDetailComponent {
  @Input() data: Notification;
  @Output() onNotificationClose = new EventEmitter();
  constructor(private router: Router) {}

  constructor(private router: Router) {}

  closeNotes() {
    this.onNotificationClose.emit({ close: true });
  }

  redirectToPage() {
    let state;
    const { data } = this.data;
    switch (this.data.notificationType.toUpperCase()) {
      case 'WHATSAPP':
        state = { phoneNumber: data['phoneNumber'] };
        break;
      case 'FEEDBACK':
        state = { feedbackId: data['feedbackId'] };
        break;
      case 'RESERVATION':
        state = { reservationId: data['reservationId'] };
        break;
    }
    this.router.navigate(
      [data['redirectUrl'].replace('https://n-devadmin.botshot.in', '')],
      { state }
    );
    this.onNotificationClose.emit({ close: true, notificationClose: true });
  }
}
