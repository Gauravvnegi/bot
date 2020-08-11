import { Injectable } from '@angular/core';
import { ReservationService } from './booking.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { FaqConfigI, FaqDetailDS } from '../data-models/faqConfig.model';
import * as _ from 'lodash';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class FaqService extends ReservationService{

  private _faqDetailDS: FaqDetailDS;

  initFaqDetailDS( faqDetails ) {
    this._faqDetailDS = new FaqDetailDS().deserialize(faqDetails);
  }

  setFieldConfigForFaq(label:string) {
    let feedbackDetailsFieldSchema = {};

    feedbackDetailsFieldSchema[
      'button'
    ] = new FieldSchema().deserialize({
      label: label,
    });

    return feedbackDetailsFieldSchema as FaqConfigI;
  }

  getFaqs(hotelId): Observable<any> {
    return this.apiService.get(`/api/v1/hotel/${hotelId}/covid-faqs`);
  }

  get faqDetails() {
    return this._faqDetailDS;
  }
}
