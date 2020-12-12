import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

export interface ITemplate {
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class TemplateService extends ApiService {
  templateData: ITemplate;

  getTemplateData(templateId: string, journey?: string): Observable<ITemplate> {
    return journey
      ? this.get(`/api/v1/cms/template/${templateId}?journey=${journey}`)
      : this.get(`/api/v1/cms/template/${templateId}`);
  }
}
