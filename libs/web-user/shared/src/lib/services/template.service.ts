import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplateService extends ApiService {
  getTemplateData(templateId, journey?): Observable<any> {
    return journey
      ? this.get(`/api/v1/cms/template/${templateId}?journey=${journey}`)
      : this.get(`/api/v1/cms/template/${templateId}`);
  }
}
