import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from '../../../data-models/notifications.model';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'admin-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss'],
})
export class NotificationDetailComponent {
  @Input() data: Notification;
  @Output() onNotificationClose = new EventEmitter();
  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  closeNotes() {
    this.onNotificationClose.emit({ close: true });
  }

  redirectToPage() {
    const { data } = this.data;
    this.router.navigate([
      data['redirectUrl'].replace('https://n-devadmin.botshot.in', ''),
    ]);
    switch (this.data.notificationType.toUpperCase()) {
      case 'WHATSAPP':
        this.notificationService.$whatsappNotification.next(
          data['phoneNumber']
        );
        break;
      case 'FEEDBACK':
        this.notificationService.$feedbackNotification.next(data['feedbackId']);
        break;
      case 'RESERVATION':
        this.notificationService.$reservationNotification.next(
          data['reservationId']
        );
        break;
    }
    this.onNotificationClose.emit({ close: true, notificationClose: true });
  }
}
