import { Injectable } from '@angular/core';
import { SummaryDetailsConfigI } from '../data-models/billSummaryConfig.model';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { SummaryDetails } from '../data-models/summaryConfig.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SummaryService extends ApiService {
  private summaryDetails;
  $summaryDetailRefreshed = new BehaviorSubject(false);
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

  initSummaryDS(summary) {
    this.summaryDetails = new SummaryDetails().deserialize(summary);
  }

  getSummaryStatus(reservationId) {
    return this.get(`/api/v1/reservation/${reservationId}/summary`);
  }

  summaryDownload(reservationId) {
    return this.get(`/api/v1/reservation/${reservationId}/checkin/summary`, {
      responseType: 'blob',
    });
  }

  get SummaryDetails() {
    return this.summaryDetails;
  }
}
