import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { SpaConfigI, SpaDetail, SpaDetailDS } from '../data-models/spaConfig.model';
import { FormGroup } from '@angular/forms';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import * as moment from 'moment';

@Injectable()
export class SpaService extends ApiService{

  private _spaDetailDS: SpaDetailDS;

  initSpaDetailDS(spaDetails) {
    this._spaDetailDS = new SpaDetailDS().deserialize(spaDetails);
  }

  setFieldConfigForSpaDetails() {
    let spaFormFieldSchema = {};

    spaFormFieldSchema['quantity'] = new FieldSchema().deserialize({
      label: ' ',
      disable: false,
      placeholder: 'No.of Persons'
    });

    spaFormFieldSchema['spaDate'] = new FieldSchema().deserialize({
      label: 'Select date for Spa',
      disable: false,
    });

    spaFormFieldSchema['usageTime'] = new FieldSchema().deserialize({
      label: 'Enter Usage Time',
      disable: false,
      style: {
        childLabelStyles: {
          'font-weight': 700,
          color: '#888888',
          'font-size': '13px',
        },
      },
    });

    spaFormFieldSchema['removeButton'] = new FieldSchema().deserialize({
      label: 'Remove',
      disable: false,
    });

    return spaFormFieldSchema as SpaConfigI;
  }

  validateSpaForm(spaForm: FormGroup) {
    let status = [];

    if (spaForm.invalid) {
      status.push({
        validity: false,
        msg: 'Invalid form. Please fill required fields.'
      });
    }
    return status;
  }

  mapSpaData(spaFormValue){
    const spaDateTimestamp =  new DateService().convertDateToTimestamp(spaFormValue.spaDate);
    const spaDate = new Date(spaDateTimestamp*1000).toISOString();
    const spaTime =  this.modifyPickUpData(spaFormValue,spaDate);
    let spaData = new SpaDetail()
    spaData.quantity = spaFormValue.quantity;
    spaData.usageTime = spaTime;
    return spaData;
  }

  modifyPickUpData(data, spaTime){
    if(data.usageTime){
      let spaDate = spaTime.split('T')[0];
      let time = moment(data.usageTime, 'hh:mm').format('hh:mm');
      return new DateService().convertDateToTimestamp(spaDate +'T'+ time);
    }
  }

  get spaDetails(){
    return this._spaDetailDS;
  }
}
