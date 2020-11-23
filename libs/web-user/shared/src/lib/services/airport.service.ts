import { Injectable } from '@angular/core';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { AirportConfigI, AirportAmenity, AirportDetailDS } from '../data-models/airportConfig.model';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Injectable()
export class AirportService extends ApiService{

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
      placeholder: 'Enter Terminal'
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
      placeholder: 'Enter Flight No.'
    });
    airportFormFieldSchema['quantity'] = new FieldSchema().deserialize({
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

  mapAirportData(airportFormValue){
    const pickUpDateTimestamp =  new DateService().convertDateToTimestamp(airportFormValue.pickupDate);
    const pickupDate = new Date(pickUpDateTimestamp*1000).toISOString();
    const pickupTime =  this.modifyPickUpData(airportFormValue,pickupDate);
    let airportData = new AirportAmenity();
    airportData.airportName = airportFormValue.airportName;
    airportData.flightNumber = airportFormValue.flightNumber;
    airportData.pickupTime = pickupTime;
    airportData.quantity = airportFormValue.quantity;
    airportData.terminal = airportFormValue.terminal;
    return airportData;
  }

  modifyPickUpData(amenityData, arrivalTime){
    if(amenityData.pickupTime){
      let arrivalDate = arrivalTime.split('T')[0];
      let time = moment(amenityData.pickupTime, 'hh:mm').format('hh:mm');
      return new DateService().convertDateToTimestamp(arrivalDate +'T'+ time);
    }
  }

  validateAirportForm(airportForm: FormGroup) {
    let status = [];

    if (airportForm.invalid) {
      status.push({
        validity: false,
        code: "INVALID_FORM"
      });
    }
    return status;
  }

  get airportDetails(){
    return this._airportDetailDS;
  }
}
