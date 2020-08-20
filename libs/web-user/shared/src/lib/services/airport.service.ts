import { Injectable } from '@angular/core';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { AirportConfigI } from '../data-models/airportConfig.model';

@Injectable()
export class AirportService extends ApiService{

  setFieldConfigForAirportDetails() {
    let airportFormFieldSchema = {};

    airportFormFieldSchema['airportName'] = new FieldSchema().deserialize({
      label: 'Select nearby Airport',
      disable: false,
      placeholder: 'Select nearby Airport',
      options: [
        { key: 'IGI Airport', value: 'IGI Airport' },
      ],
    });
    airportFormFieldSchema['terminal'] = new FieldSchema().deserialize({
      label: ' ',
      disable: false,
      placeholder: 'Enter Terminal'
    });
    airportFormFieldSchema['pickupTime'] = new FieldSchema().deserialize({
      label: ' ',
      disable: false
    });
    airportFormFieldSchema['flightNumber'] = new FieldSchema().deserialize({
      label: ' ',
      disable: false,
      placeholder: 'Enter Flight No.'
    });

    return airportFormFieldSchema as AirportConfigI;
  }

}
