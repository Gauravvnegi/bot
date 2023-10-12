import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from '../../../data-models/notifications.model';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { RoutesConfigService } from '../../../services/routes-config.service';
import { ModuleNames } from 'libs/admin/shared/src/index';

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
    private router: Router,
    private routesConfigService: RoutesConfigService
  ) {}

  closeNotes() {
    this.onNotificationClose.emit({ close: true });
  }

  redirectToPage() {
    const { data } = this.data;

    switch (this.data.notificationType.toUpperCase()) {
      case 'WHATSAPP':
        this.notificationService.$whatsappNotification.next(
          data['phoneNumber']
        );
        this.routesConfigService.navigate({
          subModuleName: ModuleNames.LIVE_MESSAGING,
        });
        break;

      case 'IN-HOUSE REQUEST':
        // requestId is not coming from backend
        this.notificationService.$requestNotification.next(data['requestId']);
        this.routesConfigService.navigate({
          subModuleName: ModuleNames.COMPLAINTS,
        });
        break;

      case 'FEEDBACK':
        this.notificationService.$feedbackNotification.next(data['feedbackId']);
        this.routesConfigService.navigate({
          subModuleName: ModuleNames.HEDA_DASHBOARD,
        });
        break;

      case 'CHECK -IN':
        this.notificationService.$reservationNotification.next(
          data['reservationId']
        );
        this.routesConfigService.navigate({
          subModuleName: ModuleNames.FRONT_DESK_DASHBOARD,
        });
        break;

      default:
        // Handle other notification types or add a default route
        break;
    }
    this.onNotificationClose.emit({ close: true, notificationClose: true });
  }
}
