import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AirportConfigI } from 'libs/web-user/shared/src/lib/data-models/airportConfig.model';
import { AirportService } from 'libs/web-user/shared/src/lib/services/airport.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { customPatternValid } from 'libs/web-user/shared/src/lib/services/validator.service';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-airport-pickup',
  templateUrl: './airport-facilities.component.html',
  styleUrls: ['./airport-facilities.component.scss'],
})
export class AirportFacilitiesComponent implements OnInit, OnDestroy {
  @Input() uniqueData;
  @Input() amenityData;
  @Input() subPackageForm;

  airportForm: FormGroup;
  airportConfig: AirportConfigI;
  minDate;

  protected $subscription: Subscription = new Subscription();

  @Output() onSave = new EventEmitter<string>();
  @Output() onClose = new EventEmitter();

  constructor(
    protected _fb: FormBuilder,
    protected _airportService: AirportService,
    protected _paidService: PaidService,
    protected _dateService: DateService,
    protected _snackBarService: SnackBarService
  ) {
    this.initAirportForm();
  }

  ngOnInit(): void {
    this.minDate = new Date(DateService.getCurrentDateString());
    this.airportConfig = this.setFieldConfiguration();
    this.assignUniqueData();
    this.populateFormData();
  }

  initAirportForm() {
    this.airportForm = this._fb.group({
      flightNumber: ['', [Validators.required]],
      pickupDate: ['', [Validators.required]],
      pickupTime: ['', [Validators.required]],
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
    });
  }

  assignUniqueData() {
    this._paidService.uniqueData = this.uniqueData;
  }

  populateFormData() {
    this._airportService.initAirportDetailDS(this.amenityData);
    this.airportForm.patchValue(
      this._airportService.airportDetails.airportDetail
    );
    this._paidService.amenityForm = this.airportForm;
    this._paidService.isComponentRendered$.next(true);
  }

  setFieldConfiguration() {
    return this._airportService.setFieldConfigForAirportDetails();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
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
