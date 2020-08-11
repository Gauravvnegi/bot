import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { SummaryDetailsConfigI, BillSummaryDetailDS } from '../data-models/billSummaryConfig.model';
import { ReservationService } from './booking.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class BillSummaryService extends ReservationService {

  private _billSummaryDetailDS: BillSummaryDetailDS;

  initBillSummaryDetailDS( summaryDetails, paymentData ) {
    this._billSummaryDetailDS = new BillSummaryDetailDS().deserialize(
      summaryDetails, paymentData
    );
  }

  setFieldConfigForGuestDetails() {
    let summaryDetailsFieldSchema = {};

    summaryDetailsFieldSchema['request'] = new FieldSchema().deserialize({
      master_label: 'Any special Request ?',
      disable: false,
      appearance: 'outline',
      type: 'textarea',
      placeholder: 'Request us for anything like Airport Dropoff, Pickup at Airport, Go for sightseeing, etc.'
    });

    return summaryDetailsFieldSchema as SummaryDetailsConfigI;
  }

  getBillingSummary(reservationId): Observable<any>{
    return this.apiService.get(`/api/v1/reservation/${reservationId}/bill-summary`);
  }

  get billSummaryDetails() {
    return this._billSummaryDetailDS;
  }
}
