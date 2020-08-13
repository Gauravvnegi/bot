import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  constructor(protected apiService: ApiService) {
    this.apiService.baseUrl = 'https://stageapi.botshot.in:8443';
  }

  getTemplateData(templateId, journey?): Observable<any> {
    return journey
      ? this.apiService.get(
          `/api/v1/cms/template/${templateId}?journey=${journey}`
        )
      : this.apiService.get(`/api/v1/cms/template/${templateId}`);
  }
}
