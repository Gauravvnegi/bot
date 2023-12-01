import { Injectable } from '@angular/core';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { type } from 'os';
import { Observable } from 'rxjs';

@Injectable()
export class EmailService extends ApiService {
  getTemplateDetails(
    entityId: string,
    config: QueryConfig
  ): Observable<TemplateDetailsResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/template${config.params ?? ''}`
    );
  }

  getAllTemplates(
    entityId: string,
    config: QueryConfig
  ): Observable<TemplateListResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/template/configuration${config.params ?? ''}`
    );
  }
  getFromEmail(entityId: string): Observable<any> {
    return this.get(`/api/v1/configurations/smtp?entity-id=${entityId}`, {
      'entity-id': entityId,
    });
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

  getAttachment(queryConfig: QueryConfig): Observable<any> {
    return this.get(`/api/v1/download${queryConfig.params ?? ''}`);
  }
}

type TemplateListResponse = {
  templates: TransactionType[];
};

type TransactionType = {
  name: string;
  label: string;
};

type TemplateDetailsResponse = {
  template: string;
  subject: string;
  attachments: {
    attachmentName: string;
    attachmentDownloadUrl: string;
    contentType: string;
  };
};
