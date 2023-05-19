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
    // this.router.navigate([
    //   data['redirectUrl'].replace('https://dev.admin.botshot.ai', ''),
    // ]);
    switch (this.data.notificationType.toUpperCase()) {
      case 'WHATSAPP':
        this.notificationService.$whatsappNotification.next(data['phoneNumber']);
        this.router.navigate(['pages/freddie/request']);
        break;
        
      // case 'IN-HOUSE REQUEST':
      //   this.router.navigate(['pages/freddie/request']);
      //   break;

      case 'FEEDBACK':
        this.notificationService.$feedbackNotification.next(data['feedbackId']);
        this.router.navigate(['pages/heda/analytics']);
        break;
      case 'CHECK -IN':
        this.notificationService.$reservationNotification.next(data['reservationId']);
        this.router.navigate(['pages/efrontdesk/dashboard']);
        break;
      default:
        // Handle other notification types or add a default route
        break;
    }
    this.onNotificationClose.emit({ close: true, notificationClose: true });
  }
}
