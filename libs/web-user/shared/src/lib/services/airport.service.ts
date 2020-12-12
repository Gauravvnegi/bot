import { Injectable } from '@angular/core';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import {
  AirportConfigI,
  AirportAmenity,
  AirportDetailDS,
} from '../data-models/airportConfig.model';
import { FormGroup } from '@angular/forms';

@Injectable()
export class AirportService extends ApiService {
  private _airportDetailDS: AirportDetailDS;

  initAirportDetailDS(airportDetails) {
    this._airportDetailDS = new AirportDetailDS().deserialize(airportDetails);
  }

  setFieldConfigForAirportDetails() {
    let airportFormFieldSchema = {};

    airportFormFieldSchema['airportName'] = new FieldSchema().deserialize({
      label: 'Airport',
      disable: false,
      placeholder: 'Enter Airport ',
    });
    airportFormFieldSchema['terminal'] = new FieldSchema().deserialize({
      label: 'Terminal',
      disable: false,
      placeholder: 'Enter Terminal',
    });
    airportFormFieldSchema['pickupDate'] = new FieldSchema().deserialize({
      label: 'Pickup Date',
      disable: false,
    });

    airportFormFieldSchema['pickupTime'] = new FieldSchema().deserialize({
      label: 'Pickup Time',
      disable: false,
      style: {
        childLabelStyles: {
          'font-weight': 700,
          color: '#888888',
          'font-size': '13px',
        },
      },
    });
    airportFormFieldSchema['flightNumber'] = new FieldSchema().deserialize({
      label: 'Flight No',
      disable: false,
      placeholder: 'Enter Flight No.',
    });
    airportFormFieldSchema['quantity'] = new FieldSchema().deserialize({
      label: 'No. of passengers',
      disable: false,
      placeholder: 'No. of passengers',
    });
    airportFormFieldSchema['removeButton'] = new FieldSchema().deserialize({
      label: 'Remove',
      disable: false,
    });

    return airportFormFieldSchema as AirportConfigI;
  }

  validateAirportForm(airportForm: FormGroup) {
    let status = [];

    if (airportForm.invalid) {
      status.push({
        validity: false,
        code: 'INVALID_FORM',
        msg: 'Invalid form. Please fill all the fields.',
      });
    }
    return status;
  }

  get airportDetails() {
    return this._airportDetailDS;
  }
}
