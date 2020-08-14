import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import { environment } from '@hospitality-bot/web-user/environment';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  constructor(protected apiService: ApiService) {}

  getTemplateData(templateId, journey?): Observable<any> {
    return journey
      ? this.apiService.get(
          `/api/v1/cms/template/${templateId}?journey=${journey}`
        )
      : this.apiService.get(`/api/v1/cms/template/${templateId}`);
  }
}
