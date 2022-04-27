import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class EmailService extends ApiService {
  getFromEmail(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/email`);
  }

  getTopicList(id: string): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics`);
  }

  getTemplateByTopic(hotelId: string, topicId: string) {
    return this.get(
      `/api/v1/entity/${hotelId}/templates/template-topic/${topicId}`
    );
  }

  sendEmail(hotelId: string, data) {
    return this.post(`/api/v1/entity/${hotelId}/notifications/send`, data);
  }
}
