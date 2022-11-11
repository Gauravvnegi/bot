import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/index';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends ApiService {
  $reservationNotification = new BehaviorSubject(null);
  $feedbackNotification = new BehaviorSubject(null);
  $whatsappNotification = new BehaviorSubject(null);
  getNotificationHistory(userId: string, config): Observable<any> {
    return this.get(
      `/api/v1/user/${userId}/push-notification-history/${config.queryObj}`
    );
  }

  getNotificationSettings(userId: string) {
    return this.get(`/api/v1/user/${userId}/push-notification-setting`);
  }

  updateNotificationSetting(
    userId: string,
    settingId: string,
    status: boolean
  ) {
    return this.patch(
      `/api/v1/user/${userId}/push-notification-setting/${settingId}?status=${status}`,
      {}
    );
  }

  deleteNotification(userId: string, config) {
    return this.delete(
      `/api/v1/user/${userId}/push-notification-history/${config.queryObj}`
    );
  }

  updateNotificationStatus(userId: string, notificationId: string) {
    return this.patch(
      `/api/v1/user/${userId}/push-notification-history/${notificationId}?status=true`,
      {}
    );
  }

  getUnreadCount(userId: string) {
    return this.get(
      `/api/v1/user/${userId}/push-notification-history/unread-count`
    );
  }
}
