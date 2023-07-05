import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs/internal/Observable';
import { FaqConfigI, FaqDetailDS } from '../data-models/faqConfig.model';
import { FieldSchema } from '../data-models/fieldSchema.model';

@Injectable()
export class FaqService extends ApiService {
  private _faqDetailDS: FaqDetailDS;

  initFaqDetailDS(faqDetails: any) {
    this._faqDetailDS = new FaqDetailDS().deserialize(faqDetails);
  }

  setFieldConfigForFaq(label: string) {
    let feedbackDetailsFieldSchema = {};

    feedbackDetailsFieldSchema['button'] = new FieldSchema().deserialize({
      label: label,
    });

    return feedbackDetailsFieldSchema as FaqConfigI;
  }

  getFaqs(entityId: any): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/covid/faqs`);
  }

  get faqDetails() {
    return this._faqDetailDS;
  }
}
