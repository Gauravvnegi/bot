import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import {
  DefaultAmenityConfigI,
  DefaultDetailDS,
} from '../data-models/defaultAmenityConfig.model';

@Injectable()
export class DefaultAmenityService extends ApiService {
  private _defaultDetailDS: DefaultDetailDS;

  initDefaultDetailDS(airportDetails) {
    this._defaultDetailDS = new DefaultDetailDS().deserialize(airportDetails);
  }

  setFieldConfigForDefaultAmenityDetails() {
    let defaultFormFieldSchema = {};

    defaultFormFieldSchema['quantity'] = new FieldSchema().deserialize({
      label: 'Quantity',
      disable: false,
      required: true,
    });
    defaultFormFieldSchema['remark'] = new FieldSchema().deserialize({
      label: 'Remark',
      disable: false,
    });

    defaultFormFieldSchema['pickupDate'] = new FieldSchema().deserialize({
      label: 'Pickup Date',
      disable: true,
      required: true,
    });

    defaultFormFieldSchema['pickupTime'] = new FieldSchema().deserialize({
      label: 'Pickup Time',
      disable: false,
      required: true,
      style: {
        childLabelStyles: {
          'font-weight': 700,
          color: '#888888',
          'font-size': '13px',
        },
      },
    });

    return defaultFormFieldSchema as DefaultAmenityConfigI;
  }

  get defaultDetails() {
    return this._defaultDetailDS;
  }
}
