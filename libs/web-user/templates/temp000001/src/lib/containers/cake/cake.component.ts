import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { CakeService } from 'libs/web-user/shared/src/lib/services/cake.service';
import { CakeConfigI } from 'libs/web-user/shared/src/lib/data-models/cakeConfig.model';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-cake',
  templateUrl: './cake.component.html',
  styleUrls: ['./cake.component.scss']
})
export class CakeComponent implements OnInit {

  @Input() uniqueData;
  @Input() amenityData;
  @Input() paidAmenitiesForm;
  @Output() removeEvent : EventEmitter<any> = new EventEmitter<any>();
  @Output() addEvent : EventEmitter<any> = new EventEmitter<any>(); 

  @ViewChild('saveButton') saveButton;
  @ViewChild('removeButton') removeButton;

  cakeForm: FormGroup;
  cakeConfig: CakeConfigI;
  minDate;
  private $subscription: Subscription = new Subscription();
  
  constructor(
    private _fb: FormBuilder,
    private _cakeService: CakeService,
    private _snackBarService: SnackBarService,
    private _paidService: PaidService,
    private _buttonService: ButtonService,
    private _dateService: DateService,
    private _translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.minDate = new Date(this._dateService.getCurrentDateString());
  }

  initBreakfastForm() {
    this.cakeForm = this._fb.group({
      date: ['', [Validators.required]],
      flavour: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      expectedTime: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }

  addForm(){
    this._paidService.uniqueData = this.uniqueData;
    this._paidService.amenityForm = this.cakeForm;
    this._paidService.isComponentRendered$.next(true);
  }

  populateFormData(){
    if(this.amenityData === ""){
      this.cakeConfig.removeButton.disable = true;
    }
    this.cakeForm.patchValue(this.amenityData);
  }

  setFieldConfiguration() {
    return this._cakeService.setFieldConfigForCakeDetails();
  }

  submit(){
    const status = this._cakeService.validateCakeForm(
      this.cakeForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      this._buttonService.buttonLoading$.next(this.saveButton);
      return;
    }

    this.paidAmenitiesForm.get('isSelected').patchValue(true);
    this._paidService.amenityData = this.cakeForm.getRawValue();
    this.addEvent.emit(this.uniqueData.code);
  }

  private performActionIfNotValid(status: any[]) {
    this.$subscription.add(
      this._translateService
        .get(`MESSAGES.VALIDATION.${status[0].code}`)
        .subscribe((res) => {
          this._snackBarService.openSnackBarAsText(res);
        })
    );
    return;
  }

  removeCakeData(event){
    event.preventDefault();
    if(this.cakeForm.valid && this.paidAmenitiesForm.get('isSelected').value == true){
     this.removeEvent.emit({amenityId:this.uniqueData.id , packageCode: this.uniqueData.code});
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
