import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { DefaultAmenityConfigI } from 'libs/web-user/shared/src/lib/data-models/defaultAmenityConfig.model';
import { DefaultAmenityService } from 'libs/web-user/shared/src/lib/services/default-amenity.service';

@Component({
  selector: 'hospitality-bot-default-amenity',
  templateUrl: './default-amenity.component.html',
  styleUrls: ['./default-amenity.component.scss']
})
export class DefaultAmenityComponent implements OnInit {

  @Input() uniqueData;
  @Input() amenityData;
  @Input() paidAmenitiesForm;
  @Output() removeEvent : EventEmitter<any> = new EventEmitter<any>();
  @Output() addEvent : EventEmitter<any> = new EventEmitter<any>(); 

  @ViewChild('saveButton') saveButton;
  @ViewChild('removeButton') removeButton;

  defaultForm: FormGroup;
  defaultAmenityConfig: DefaultAmenityConfigI;

  constructor(
    private _fb: FormBuilder,
    private _paidService: PaidService,
    private _defaultService: DefaultAmenityService
  ) {
    this.initDefaultForm();
   }

  ngOnInit(): void {
    this.defaultAmenityConfig = this.setFieldConfiguration();
    this.addForm();
    this.populateFormData();
  }

  initDefaultForm() {
    this.defaultForm = this._fb.group({});
  }

  addForm(){
    this._paidService.uniqueData = this.uniqueData;
    this._paidService.amenityForm = this.defaultForm;
    this._paidService.isComponentRendered$.next(true);
  }

  populateFormData(){
    if(this.paidAmenitiesForm.get('isSelected').value !== true){
      this.defaultAmenityConfig.removeButton.disable = true;
    }
  }

  setFieldConfiguration() {
    return this._defaultService.setFieldConfigForDefaultAmenityDetails();
  }

  submit(){
    this._paidService.amenityData = {};
    this.paidAmenitiesForm.get('isSelected').patchValue(true);
    this.addEvent.emit(this.uniqueData.code);
  }

  removeDefaultAmenityData(event){
    event.preventDefault();
    if(this.paidAmenitiesForm.get('isSelected').value == true){
      this.paidAmenitiesForm.get('isSelected').patchValue(false);
      this.removeEvent.emit({amenityId:this.uniqueData.id , packageCode: this.uniqueData.code});
    }
 }
}
