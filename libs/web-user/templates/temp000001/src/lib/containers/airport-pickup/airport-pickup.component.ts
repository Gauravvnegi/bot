import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AirportConfigI } from 'libs/web-user/shared/src/lib/data-models/airportConfig.model';
import { AirportService } from 'libs/web-user/shared/src/lib/services/airport.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { customPatternValid } from 'libs/web-user/shared/src/lib/services/validator.service';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';

@Component({
  selector: 'hospitality-bot-airport-pickup',
  templateUrl: './airport-pickup.component.html',
  styleUrls: ['./airport-pickup.component.scss']
})
export class AirportPickupComponent implements OnInit {

  @Input() uniqueData;
  @Input() amenityData;
  @Input() paidAmenitiesForm;
  @Output() removeEvent : EventEmitter<any> = new EventEmitter<any>();
  @Output() addEvent : EventEmitter<any> = new EventEmitter<any>(); 

  @ViewChild('saveButton') saveButton;
  @ViewChild('removeButton') removeButton;
  
  airportForm: FormGroup;
  airportConfig: AirportConfigI;

  constructor(
    private _fb: FormBuilder,
    private _airportService: AirportService,
    private _snackBarService: SnackBarService,
    private _paidService: PaidService,
    private _buttonService: ButtonService
  ) {
    this.initAirportForm();
   }

  ngOnInit(): void {
    this.airportConfig = this.setFieldConfiguration();
     this.addForm();
     this.populateFormData();
  }

  initAirportForm() {
    this.airportForm = this._fb.group({
      airportName: ['', [Validators.required]],
      terminal: ['', [Validators.required]],
      flightNumber: ['', [Validators.required,
        customPatternValid({
          pattern: Regex.ALPHANUMERIC_REGEX,
          msg: 'Please enter valid Flight number',
        })]],
      pickupTime: [''],
      quantity: ['', [Validators.required,
        customPatternValid({
          pattern: Regex.NUMBER_REGEX,
          msg: 'Please enter valid Person count',
        }),]]
    });
  }

  addForm(){
    this._paidService.uniqueData = this.uniqueData;
    this._paidService.amenityForm = this.airportForm;
    this._paidService.isComponentRendered$.next(true);
  }

  populateFormData(){
    if(this.amenityData === ""){
      this.airportConfig.removeButton.disable = true;
    }
    this.airportForm.patchValue(this.amenityData);
  }

  setFieldConfiguration() {
    return this._airportService.setFieldConfigForAirportDetails();
  }

  submit(){
    const status = this._airportService.validateAirportForm(
      this.airportForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      this._buttonService.buttonLoading$.next(this.saveButton);
      return;
    }

    this.paidAmenitiesForm.get('isSelected').patchValue(true);
    this._paidService.amenityData = this.airportForm.getRawValue();
    this.addEvent.emit(this.uniqueData.code);
  }

  private performActionIfNotValid(status: any[]) {
    this._snackBarService.openSnackBarAsText(status[0]['msg']);
    return;
  }

  removeAirportData(event){
     event.preventDefault();
     if(this.airportForm.valid){
      this.removeEvent.emit({amenityId:this.uniqueData.id , packageCode: this.uniqueData.code});
     }
  }
}
