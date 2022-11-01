import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/index';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends ApiService {
  getNotificationHistory(userId: string, config) {
    return this.get(
      `/api/v1/user/${userId}/push-notification-history/${config.queryObj}`
    );
  }

  getNotificationSettings(userId: string) {
    return this.get(`/api/v1/user/${userId}/push-notification-setting`);
  }

  updateNotificationSetting(userId: string, settingId: string) {
    return this.patch(
      `/api/v1/user/${userId}/push-notification-setting/${settingId}?status=false`,
      {}
    );
  }

  deleteNotification(userId: string, config) {
    return this.delete(
      `/api/v1/user/${userId}/push-notification-history/${config.queryObj}`
    );
  }
}
