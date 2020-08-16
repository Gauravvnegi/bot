import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FaqConfigI, FaqDetailDS } from '../data-models/faqConfig.model';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { ReservationService } from './booking.service';

@Injectable()
export class FaqService extends ReservationService {
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

  getFaqs(hotelId: any): Observable<any> {
    return this.apiService.get(`/api/v1/hotel/${hotelId}/covid-faqs`);
  }

  get faqDetails() {
    return this._faqDetailDS;
  }
}
