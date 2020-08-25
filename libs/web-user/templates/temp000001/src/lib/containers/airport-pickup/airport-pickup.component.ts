import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AirportService } from 'libs/web-user/shared/src/lib/services/airport.service';
import { AirportConfigI } from 'libs/web-user/shared/src/lib/data-models/airportConfig.model';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';

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
  
  airportForm: FormGroup;
  airportConfig: AirportConfigI;

  constructor(
    private _fb: FormBuilder,
    private _airportService: AirportService,
    private _paidService: PaidService
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
      flightNumber: ['', [Validators.required]],
      pickupTime: [''],
      personCount: ['', [Validators.required]]
    });
  }

  addForm(){
    this._paidService.uniqueData = this.uniqueData;
    this._paidService.amenityForm = this.airportForm;
    this._paidService.isComponentRendered$.next(true);
  }

  populateFormData(){
    this.airportForm.patchValue(this.amenityData);
  }

  setFieldConfiguration() {
    return this._airportService.setFieldConfigForAirportDetails();
  }

  submit(){
    this.paidAmenitiesForm.get('isSelected').patchValue(true);
    this._paidService.amenityData = this.paidAmenitiesForm.getRawValue();
    this.addEvent.emit(this.uniqueData.code);
  }

  resetAirportData(event){
    // event.preventDefault();
    // this.airportForm.reset();
    // this.removeEvent.emit(this.amenityName);
  }

  // get amenityForm(){
  //   return this.paidAmenitiesForm.get(this.amenityName);
  // }
}
