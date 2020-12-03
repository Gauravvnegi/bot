import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AirportConfigI } from 'libs/web-user/shared/src/lib/data-models/airportConfig.model';
import { AirportService } from 'libs/web-user/shared/src/lib/services/airport.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { customPatternValid } from 'libs/web-user/shared/src/lib/services/validator.service';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-airport-pickup',
  templateUrl: './airport-facilities.component.html',
  styleUrls: ['./airport-facilities.component.scss'],
})
export class AirportFacilitiesComponent implements OnInit {
  @Input() uniqueData;
  @Input() amenityData;
  @Input() subPackageForm;

  airportForm: FormGroup;
  airportConfig: AirportConfigI;
  minDate;
  private $subscription: Subscription = new Subscription();

  constructor(
    private _fb: FormBuilder,
    private _airportService: AirportService,
    private _paidService: PaidService,
    private _dateService: DateService
  ) {
    this.initAirportForm();
  }

  ngOnInit(): void {
    this.minDate = new Date(this._dateService.getCurrentDateString());
    this.airportConfig = this.setFieldConfiguration();
    this.addForm();
    this.populateFormData();
  }

  initAirportForm() {
    this.airportForm = this._fb.group({
      airportName: ['', [Validators.required]],
      terminal: ['', [Validators.required]],
      flightNumber: [
        '',
        [
          Validators.required,
          customPatternValid({
            pattern: Regex.ALPHANUMERIC_REGEX,
            msg: 'Please enter valid Flight number',
          }),
        ],
      ],
      pickupDate: ['', [Validators.required]],
      pickupTime: ['', [Validators.required]],
      quantity: [
        '',
        [
          Validators.required,
          customPatternValid({
            pattern: Regex.NUMBER_REGEX,
            msg: 'Please enter valid Person count',
          }),
        ],
      ],
    });
  }

  addForm() {
    this._paidService.uniqueData = this.uniqueData;
    this._paidService.amenityForm = this.airportForm;
    this._paidService.isComponentRendered$.next(true);
  }

  populateFormData() {
    this._airportService.initAirportDetailDS(this.amenityData);
    this.airportForm.patchValue(
      this._airportService.airportDetails.airportDetail
    );
  }

  setFieldConfiguration() {
    return this._airportService.setFieldConfigForAirportDetails();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
