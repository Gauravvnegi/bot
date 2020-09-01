import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { StayDetailsConfigI } from './../../../../../../shared/src/lib/data-models/stayDetailsConfig.model';
import { StayDetailsService } from './../../../../../../shared/src/lib/services/stay-details.service';

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
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class StayDetailsComponent implements OnInit, OnChanges {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  @Input() parentForm: FormGroup;
  @Input() reservationData;

  @Output()
  addFGEvent = new EventEmitter();

  stayDetailsForm: FormGroup;
  stayDetailsConfig: StayDetailsConfigI;

  constructor(
    private _fb: FormBuilder,
    private _stayDetailService: StayDetailsService
  ) {
    this.initStayDetailForm();
  }

  ngOnChanges() {
    this.setStayDetails();
  }

  ngOnInit(): void {
    this.setFieldConfiguration();
    this.registerListeners();
  }

  initStayDetailForm() {
    this.stayDetailsForm = this._fb.group({
      arrivalTime: ['', [Validators.required]],
      departureTime: ['', [Validators.required]],
      expectedTime: [''],
      roomType: ['', [Validators.required]],
      adultsCount: ['', [Validators.required]],
      kidsCount: [''],
    });
  }

  setFieldConfiguration() {
    this.stayDetailsConfig = this._stayDetailService.setFieldConfigForStayDetails();
  }

  setStayDetails() {
    if (this.reservationData) {
      this.addFGEvent.next({ name: 'stayDetail', value: this.stayDetailsForm });

      this.stayDetailsForm.patchValue(this._stayDetailService.stayDetail);
    }
  }

  registerListeners() {
    this.listenForStayDetailDSchange();
  }

  listenForStayDetailDSchange() {
    this._stayDetailService.stayDetailDS$.subscribe((value) => {
      this.stayDetailsForm.patchValue(this._stayDetailService.stayDetail);
    });
  }
}
