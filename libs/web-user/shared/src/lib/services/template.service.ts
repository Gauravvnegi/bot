import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import {
  ITemplateConfig,
  ITemplatesData,
  TemplateCodes,
} from 'libs/web-user/shared/src/lib/types/template';
import { Observable } from 'rxjs';

export interface ITemplate {
  [key: string]: any;
}

/**
 * @service_usage This service is to be registred in root and not override to any module
 */
@Injectable({ providedIn: 'root' })
export class TemplateService extends ApiService {
  private _templateConfig: ITemplateConfig;
  private _templateData: ITemplatesData;

  getTemplateData(
    templateId: TemplateCodes,
    journey?: string
  ): Observable<ITemplate> {
    return journey
      ? this.get(`/api/v1/cms/template/${templateId}?journey=${journey}`)
      : this.get(`/api/v1/cms/template/${templateId}`);
  }

  setTemplateData<K extends keyof ITemplatesData>(
    templateId: K,
    templateData: ITemplatesData[K]
  ): ITemplatesData[K] {
    this._templateData = { [templateId]: templateData };
    return templateData;
  }

  set templateConfig(config: ITemplateConfig) {
    this._templateConfig = config;
  }

  get templateConfig(): ITemplateConfig {
    return this._templateConfig;
  }

  get templateData(): ITemplatesData {
    return this._templateData;
  }

  get templateId() {
    return this.templateConfig.templateId;
  }
}
