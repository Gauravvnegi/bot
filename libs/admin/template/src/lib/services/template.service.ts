import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

@Injectable()
export class TemplateService extends ApiService {
    getTopicList(id: string, config): Observable<any> {
        return this.get(`/api/v1/entity/${id}/topics/${config.queryObj}`);
      }
}
