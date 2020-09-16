import { Injectable } from '@angular/core';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { AirportConfigI } from '../data-models/airportConfig.model';
import { FormGroup } from '@angular/forms';

@Injectable()
export class AirportService extends ApiService{

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
      placeholder: 'Enter Terminal'
    });
    airportFormFieldSchema['pickupTime'] = new FieldSchema().deserialize({
      label: 'Pickup Time',
      disable: false
    });
    airportFormFieldSchema['flightNumber'] = new FieldSchema().deserialize({
      label: 'Flight No',
      disable: false,
      placeholder: 'Enter Flight No.'
    });
    airportFormFieldSchema['personCount'] = new FieldSchema().deserialize({
      label: 'Person Count',
      disable: false,
      placeholder: 'No. of Persons'
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
        msg: 'Invalid form. Please fill required fields.'
      });
    }
    return status;
  }

}
