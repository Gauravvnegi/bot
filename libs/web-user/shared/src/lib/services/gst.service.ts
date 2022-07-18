import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { GstConfigI } from '../data-models/gstConfig.model';

@Injectable()
export class GSTService extends ApiService {
  addGSTDetail(reservationId: string, data) {
    return this.post(`/api/v1/reservation/${reservationId}/gst`, data);
  }

  setFieldConfigForStayDetails() {
    let gstDetailsFieldSchema = {};

    gstDetailsFieldSchema['customerName'] = new FieldSchema().deserialize({
      label: 'Name',
      disable: false,
      required: true,
    });
    gstDetailsFieldSchema['customerGSTIn'] = new FieldSchema().deserialize({
      label: 'GST Number',
      disable: false,
      required: true,
    });
    gstDetailsFieldSchema['address'] = new FieldSchema().deserialize({
      label: 'Address',
      type: 'textarea',
      placeholder: '',
    });

    return gstDetailsFieldSchema as GstConfigI;
  }
}
