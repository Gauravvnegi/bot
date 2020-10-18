import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BreakfastConfigI } from 'libs/web-user/shared/src/lib/data-models/breakfastConfig.model';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { BreakfastService } from 'libs/web-user/shared/src/lib/services/breakfast.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { customPatternValid } from 'libs/web-user/shared/src/lib/services/validator.service';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';

@Component({
  selector: 'hospitality-bot-breakfast',
  templateUrl: './breakfast.component.html',
  styleUrls: ['./breakfast.component.scss']
})
export class BreakfastComponent implements OnInit {

  @Input() uniqueData;
  @Input() amenityData;
  @Input() quantity;
  @Input() paidAmenitiesForm;
  @Output() removeEvent : EventEmitter<any> = new EventEmitter<any>();
  @Output() addEvent : EventEmitter<any> = new EventEmitter<any>(); 

  @ViewChild('saveButton') saveButton;
  @ViewChild('removeButton') removeButton;

  breakfastForm: FormGroup;
  breakfastConfig: BreakfastConfigI;

  constructor(
    private _fb: FormBuilder,
    private _breakfastService: BreakfastService,
    private _snackBarService: SnackBarService,
    private _paidService: PaidService,
    private _buttonService: ButtonService
  ) { 
    this.initBreakfastForm();
  }

  ngOnInit(): void {
    this.breakfastConfig = this.setFieldConfiguration();
    this.addForm();
    this.populateFormData();
  }

  initBreakfastForm() {
    this.breakfastForm = this._fb.group({
      quantity: ['', [Validators.required,
        customPatternValid({
          pattern: Regex.NUMBER_REGEX,
          msg: 'Please enter valid count',
        })]]
    });
  }

  addForm(){
    this._paidService.uniqueData = this.uniqueData;
    this._paidService.amenityForm = this.breakfastForm;
    this._paidService.isComponentRendered$.next(true);
  }

  populateFormData(){
    if(this.amenityData === ""){
      this.breakfastConfig.removeButton.disable = true;
    }
    if(this.amenityData){
      this.breakfastForm.patchValue(this.amenityData);
    }
    this.breakfastForm.get('quantity').patchValue(this.quantity);
  }

  setFieldConfiguration() {
    return this._breakfastService.setFieldConfigForBreakfastDetails();
  }

  submit(){
    const status = this._breakfastService.validateBreakFastForm(
      this.breakfastForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      this._buttonService.buttonLoading$.next(this.saveButton);
      return;
    }

    this.paidAmenitiesForm.get('isSelected').patchValue(true);
    this._paidService.amenityData = this.breakfastForm.getRawValue();
    this.addEvent.emit(this.uniqueData.code);
  }

  private performActionIfNotValid(status: any[]) {
    this._snackBarService.openSnackBarAsText(status[0]['msg']);
    return;
  }

  removeBreakfastData(event){
    event.preventDefault();
    if(this.breakfastForm.valid && this.paidAmenitiesForm.get('isSelected').value == true){
     this.removeEvent.emit({amenityId:this.uniqueData.id , packageCode: this.uniqueData.code});
    }
 }

}
