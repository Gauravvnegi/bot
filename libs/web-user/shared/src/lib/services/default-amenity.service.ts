import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { DefaultAmenityConfigI, DefaultDetailDS } from '../data-models/defaultAmenityConfig.model';

@Injectable()
export class DefaultAmenityService extends ApiService{

  private _defaultDetailDS: DefaultDetailDS;

  initDefaultDetailDS(airportDetails) {
    this._defaultDetailDS = new DefaultDetailDS().deserialize(airportDetails);
  }

  setFieldConfigForDefaultAmenityDetails() {
    let defaultFormFieldSchema = {};

    defaultFormFieldSchema['quantity'] = new FieldSchema().deserialize({
      label: 'Quantity',
      disable: false,
    });
    defaultFormFieldSchema['remark'] = new FieldSchema().deserialize({
      label: 'remark',
      disable: false,
    });

    return defaultFormFieldSchema as DefaultAmenityConfigI;
  }

  get defaultDetails(){
    return this._defaultDetailDS;
  }
}
