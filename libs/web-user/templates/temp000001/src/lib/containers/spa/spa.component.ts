import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpaConfigI } from 'libs/web-user/shared/src/lib/data-models/spaConfig.model';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { SpaService } from 'libs/web-user/shared/src/lib/services/spa.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { customPatternValid } from 'libs/web-user/shared/src/lib/services/validator.service';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-spa',
  templateUrl: './spa.component.html',
  styleUrls: ['./spa.component.scss']
})
export class SpaComponent implements OnInit {

  @Input() uniqueData;
  @Input() amenityData;
  @Input() paidAmenitiesForm;
  @Output() removeEvent : EventEmitter<any> = new EventEmitter<any>();
  @Output() addEvent : EventEmitter<any> = new EventEmitter<any>(); 

  @ViewChild('saveButton') saveButton;
  @ViewChild('removeButton') removeButton;
  
  spaForm: FormGroup;
  spaConfig: SpaConfigI;
  minDate;
  private $subscription: Subscription = new Subscription();

  constructor(
    private _fb: FormBuilder,
    private _spaService: SpaService,
    private _snackBarService: SnackBarService,
    private _buttonService: ButtonService,
    private _paidService: PaidService,
    private _dateService: DateService,
    private _translateService: TranslateService
  ) {
    this.initSpaForm();
   }

  ngOnInit(): void {
    this.minDate = new Date(this._dateService.getCurrentDateString());
    this.spaConfig = this.setFieldConfiguration();
    this.addForm();
    this.populateFormData();
  }

  initSpaForm() {
    this.spaForm = this._fb.group({
      quantity: ['', [Validators.required,
        customPatternValid({
          pattern: Regex.NUMBER_REGEX,
          msg: 'Please enter valid count',
        })]],
      startTime: ['', [Validators.required]],
      endTime: [''],
      spaDate:['', [Validators.required]]
    });
  }

  addForm(){
    this._paidService.uniqueData = this.uniqueData;
    this._paidService.amenityForm = this.spaForm;
    this._paidService.isComponentRendered$.next(true);
  }

  populateFormData(){
    if(this.amenityData === ""){
      this.spaConfig.removeButton.disable = true;
    }
    this._spaService.initSpaDetailDS(this.amenityData);
    this.spaForm.patchValue(this._spaService.spaDetails.spaDetail);
  }

  setFieldConfiguration() {
    return this._spaService.setFieldConfigForSpaDetails();
  }

  submit(){
    const status = this._spaService.validateSpaForm(
      this.spaForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      this._buttonService.buttonLoading$.next(this.saveButton);
      return;
    }
    
    this.paidAmenitiesForm.get('isSelected').patchValue(true);
    const formValue = this.spaForm.getRawValue();
    const data = this._spaService.mapSpaData(formValue);
    this._paidService.amenityData = data;
    this.addEvent.emit(this.uniqueData.code);
  }

  private performActionIfNotValid(status: any[]) {
    this.$subscription.add(
      this._translateService
        .get(`VALIDATION.${status[0].code}`)
        .subscribe((translatedMsg) => {
          this._snackBarService.openSnackBarAsText(translatedMsg);
        })
    );
    return;
  }

  removeSpaData(event){
    event.preventDefault();
    if(this.spaForm.valid && this.paidAmenitiesForm.get('isSelected').value == true){
     this.removeEvent.emit({amenityId:this.uniqueData.id , packageCode: this.uniqueData.code});
    }
 }
}
