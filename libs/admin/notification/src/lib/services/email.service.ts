import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class EmailService extends ApiService {
  getFromEmail(entityId: string): Observable<any> {
    return this.get(`/api/v1/configurations/smtp`, { 'entity-id': entityId });
  }

  getTopicList(id: string): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics`);
  }

  getTemplateByTopic(entityId: string, topicId: string) {
    return this.get(`/api/v1/entity/${entityId}/templates/topic/${topicId}`);
  }

  sendEmail(entityId: string, data) {
    return this.post(`/api/v1/entity/${entityId}/notifications/send`, data);
  }
}
