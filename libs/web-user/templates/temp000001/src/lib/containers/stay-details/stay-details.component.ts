import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { StayDetailsConfigI } from 'libs/web-user/shared/src/lib/data-models/stayDetailsConfig.model';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { Subscription } from 'rxjs';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM-DD-YYYY',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM-DD-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'hospitality-bot-stay-details',
  templateUrl: './stay-details.component.html',
  styleUrls: ['./stay-details.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class StayDetailsComponent implements OnInit, OnChanges {
  private $subscription: Subscription = new Subscription();
  @ViewChild(MatAccordion) accordion: MatAccordion;

  @Input() parentForm: FormGroup;
  @Input() reservationData;
  @Output()
  addFGEvent = new EventEmitter();

  stayDetailsForm: FormGroup;
  stayDetailsConfig: StayDetailsConfigI;

  constructor(
    protected _fb: FormBuilder,
    protected _stayDetailService: StayDetailsService
  ) {
    this.initStayDetailForm();
  }

  ngOnChanges(): void {
    this.setStayDetails();
  }

  ngOnInit(): void {
    this.setFieldConfiguration();
    this.registerListeners();
  }

  initStayDetailForm(): void {
    this.stayDetailsForm = this._fb.group({
      arrivalTime: ['', [Validators.required]],
      departureTime: ['', [Validators.required]],
      expectedArrivalTime: [''],
      expectedDepartureTime: [''],
      roomType: ['', [Validators.required]],
      adultsCount: ['', [Validators.required]],
      kidsCount: [''],
    });
  }

  setFieldConfiguration(): void {
    this.stayDetailsConfig = this._stayDetailService.setFieldConfigForStayDetails();
  }

  setStayDetails(): void {
    if (this.reservationData) {
      this.addFGEvent.next({ name: 'stayDetail', value: this.stayDetailsForm });

      this.stayDetailsForm.patchValue(this._stayDetailService.stayDetail);
    }
  }

  registerListeners(): void {
    this.listenForStayDetailDSchange();
  }

  listenForStayDetailDSchange(): void {
    this.$subscription.add(
      this._stayDetailService.stayDetailDS$.subscribe((value) => {
        this.stayDetailsForm.patchValue(this._stayDetailService.stayDetail);
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
