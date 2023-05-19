import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { DefaultAmenityConfigI } from 'libs/web-user/shared/src/lib/data-models/defaultAmenityConfig.model';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';
import { DefaultAmenityService } from 'libs/web-user/shared/src/lib/services/default-amenity.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { customPatternValid } from 'libs/web-user/shared/src/lib/services/validator.service';

@Component({
  selector: 'hospitality-bot-room-upgrade',
  templateUrl: './room-upgrade.component.html',
  styleUrls: ['./room-upgrade.component.scss'],
})
export class RoomUpgradeComponent implements OnInit {
  @Input() uniqueData;
  @Input() amenityData;
  @Input() subPackageForm;
  minDate;

  defaultForm: FormGroup;
  defaultAmenityConfig: DefaultAmenityConfigI;
  @Output() onSave = new EventEmitter<string>();
  @Output() onClose = new EventEmitter();

  constructor(
    protected _fb: FormBuilder,
    protected _paidService: PaidService,
    protected _defaultService: DefaultAmenityService,
    protected _snackBarService: SnackBarService
  ) {
    this.initDefaultForm();
  }

  ngOnInit(): void {
    this.minDate = new Date(DateService.getCurrentDateString());
    this.defaultAmenityConfig = this.setFieldConfiguration();
    this.assignUniqueData();
    this.populateFormData();
  }

  initDefaultForm() {
    this.defaultForm = this._fb.group({
      quantity: [
        '',
        [
          Validators.required,
          customPatternValid({
            pattern: Regex.NUMBER_REGEX,
            msg: 'Please enter valid Quantity',
          }),
        ],
      ],
      // pickupDate: ['', [Validators.required]],
      // pickupTime: ['', [Validators.required]],
      remarks: [''],
    });
  }

  assignUniqueData() {
    this._paidService.uniqueData = this.uniqueData;
  }

  populateFormData() {
    this._defaultService.initDefaultDetailDS(this.amenityData);
    this.defaultForm.patchValue(
      this._defaultService.defaultDetails.defaultDetail
    );
    this._paidService.amenityForm = this.defaultForm;
    this._paidService.isComponentRendered$.next(true);
  }

  setFieldConfiguration() {
    return this._defaultService.setFieldConfigForDefaultAmenityDetails();
  }

  get metaDataForm() {
    return (
      this.subPackageForm && (this.subPackageForm.get('metaData') as FormGroup)
    );
  }

  handleSave() {
    if (this.subPackageForm.invalid) {
      this.subPackageForm.markAllAsTouched();
      this._snackBarService.openSnackBarAsText(
        'Please fill the required values'
      );
      return;
    }
    this.onSave.emit(this.uniqueData.id);
  }

  handleClose() {
    this.onClose.emit();
  }
}
