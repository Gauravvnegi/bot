import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from '../../../data-models/notifications.model';

@Component({
  selector: 'admin-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss'],
})
export class NotificationDetailComponent {
  @Input() data: Notification;
  @Output() onNotificationClose = new EventEmitter();
  constructor(private router: Router) {}

  closeNotes() {
    this.onNotificationClose.emit({ close: true });
  }

  redirectToPage() {
    let state;
    const { data } = this.data;
    switch (this.data.notificationType.toUpperCase()) {
      case 'WHATSAPP':
        state = { phoneNumber: data['phone_number'] };
        break;
      case 'FEEDBACK':
        state = { feedbackId: data['feedback_id'] };
        break;
      case 'RESERVATION':
        state = { reservationId: data['reservation_id'] };
        break;
    }
    this.router.navigate(
      [data['redirect_url'].replace('https://n-devadmin.botshot.in', '')],
      { state }
    );
    this.onNotificationClose.emit({ close: true });
  }
}
