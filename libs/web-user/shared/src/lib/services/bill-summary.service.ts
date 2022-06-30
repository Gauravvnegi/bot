import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs/internal/Observable';
import {
  BillSummaryDetailDS,
  SummaryDetailsConfigI,
} from '../data-models/billSummaryConfig.model';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { FileDetails } from '../data-models/reservationDetails';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BillSummaryService extends ApiService {
  private _billSummaryDetailDS: BillSummaryDetailDS;
  $signatureUrl = new BehaviorSubject('');

  initBillSummaryDetailDS(summaryDetails, paymentData) {
    this._billSummaryDetailDS = new BillSummaryDetailDS().deserialize(
      summaryDetails,
      paymentData
    );
  }

  setFieldConfigForGuestDetails() {
    let summaryDetailsFieldSchema = {};

    summaryDetailsFieldSchema['request'] = new FieldSchema().deserialize({
      master_label: 'Any special Request ?',
      disable: false,
      appearance: 'outline',
      type: 'textarea',
      placeholder:
        'Request us for anything like Airport Dropoff, Pickup at Airport, Go for sightseeing, etc.',
    });

    return summaryDetailsFieldSchema as SummaryDetailsConfigI;
  }

  getBillingSummary(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}/bill-summary`);
  }

  uploadSignature(
    reservationId,
    hotelId,
    guestId,
    formData
  ): Observable<FileDetails> {
    return this.uploadDocumentPost(
      `/api/v1/uploads?folder_name=hotel/${hotelId}/reservation/${reservationId}/guest/${guestId}/payment`,
      formData
    );
  }

  bindSignatureWithSummary(reservationId, data) {
    return this.patch(`/api/v1/reservation/${reservationId}`, data);
  }

  get billSummaryDetails() {
    return this._billSummaryDetailDS;
  }
}
