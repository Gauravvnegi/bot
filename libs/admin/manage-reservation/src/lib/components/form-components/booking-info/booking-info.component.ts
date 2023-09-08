import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ConfigService,
  CountryCodeList,
  EntitySubType,
  Option,
} from '@hospitality-bot/admin/shared';
import { BookingConfig } from '../../../models/reservations.model';
import * as moment from 'moment';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FormService } from '../../../services/form.service';
import { ReservationForm } from '../../../constants/form';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.scss', '../../reservation.styles.scss'],
})
export class BookingInfoComponent implements OnInit {
  countries: Option[];
  @Input() expandAccordion: boolean = false;
  @Input() reservationTypes: Option[] = [];
  @Input() statusOptions: Option[] = [];
  @Input() eventTypes: Option[] = [];
  @Input() bookingType: string;

  otaOptions: Option[] = [];
  @Output() getSummary: EventEmitter<any> = new EventEmitter<any>();

  configData: BookingConfig;

  // agentSource = false;

  entityId: string;
  startMinDate = new Date();
  endMinDate = new Date();
  maxDate = new Date();
  minToDate = new Date();

  fromDateValue = new Date();
  toDateValue = new Date();

  $susbcription = new Subscription();
  constructor(
    public controlContainer: ControlContainer,
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.getCountryCode();
    this.initDates();

    // listening changes after the form is created for continue reservation.
    this.$susbcription.add(
      this.formService.setInitialDates.subscribe((res) => {
        if (res !== null) {
          this.initDates();
        }
      })
    );
    this.listenForSourceChanges();
  }

  initDates() {
    // Reset dates for continue reservation flow after form submission.
    this.startMinDate = new Date();
    this.endMinDate = new Date();
    this.maxDate = new Date();
    this.minToDate = new Date();
    this.initDefaultDates();
    this.listenForDateChange();
  }
  /**
   * Set default to and from dates.
   */
  initDefaultDates() {
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.maxDate.setDate(this.endMinDate.getDate() - 1);

    this.fromDateValue = this.startMinDate;
    this.toDateValue = this.endMinDate;
    // Reservation dates should be within 1 year time.
    if (this.bookingType === EntitySubType.ROOM_TYPE)
      this.maxDate.setDate(this.startMinDate.getDate() + 365);

    // Venue only valid till 24 hours later.
    if (this.bookingType === EntitySubType.VENUE)
      this.maxDate = moment().add(24, 'hours').toDate();
    this.endMinDate.setTime(this.endMinDate.getTime() - 5 * 60 * 1000);
  }

  /**
   * Listen for date changes in ROOM_TYPE and outlets.
   */
  listenForDateChange() {
    const startTime = moment(this.startMinDate).unix() * 1000;
    const endTime = moment(this.endMinDate).unix() * 1000;

    const toDateControl = this.reservationInfoControls?.to;
    const fromDateControl = this.reservationInfoControls?.from;
    const dateAndTimeControl = this.reservationInfoControls?.dateAndTime;

    // Listen to from and to date changes in ROOM_TYPE and set
    // min and max dates accordingly
    if (this.bookingType === EntitySubType.ROOM_TYPE) {
      fromDateControl.setValue(startTime);
      toDateControl.setValue(endTime);

      fromDateControl.valueChanges.subscribe((res) => {
        const maxToLimit = new Date(res);
        this.fromDateValue = new Date(maxToLimit);
        // Check if fromDate is greater than or equal to toDate before setting toDateControl
        maxToLimit.setDate(maxToLimit.getDate() + 1);
        if (maxToLimit >= this.toDateValue) {
          // Calculate the date for one day later
          const nextDayTime = moment(maxToLimit).unix() * 1000;
          toDateControl.setValue(nextDayTime); // Set toDateControl to one day later
        }
        this.updateDateDifference();
        this.minToDate = new Date(maxToLimit); // Create a new date object
        this.minToDate.setDate(maxToLimit.getDate());
        this.formService.reservationDate.next(res);

        if (this.roomControls.valid) {
          this.getSummary.emit();
        }
      });

      toDateControl.valueChanges.subscribe((res) => {
        this.toDateValue = new Date(res);
        this.updateDateDifference();
        if (this.roomControls.valid) {
          this.getSummary.emit();
        }
      });
    }

    // Listen to from and to date changes in Venue
    else if (this.bookingType === EntitySubType.VENUE) {
      fromDateControl.setValue(startTime);
      toDateControl.setValue(endTime);
      this.endMinDate.setDate(this.startMinDate.getDate());
      fromDateControl.valueChanges.subscribe((res) => {
        const maxLimit = new Date(res);
        toDateControl.setValue(moment(maxLimit).unix() * 1000);
        this.maxDate = moment(maxLimit).add(24, 'hours').toDate();
        this.formService.reservationDate.next(res);
      });
    }

    // Listen for date and time change in restaurant and spa
    else {
      dateAndTimeControl.setValue(startTime);
      this.formService.reservationDateAndTime.next(startTime);

      dateAndTimeControl.valueChanges.subscribe((res) => {
        this.formService.reservationDateAndTime.next(res);
      });
    }
  }

  listenForSourceChanges() {
    const sourceControl = this.reservationInfoControls.source;
    const sourceNameControl = this.reservationInfoControls.sourceName;

    sourceControl.valueChanges.subscribe((res) => {
      // this.agentSource = res === 'AGENT';
      this.otaOptions =
        res === 'OTA' && this.configData
          ? this.configData.source.filter((item) => item.value === res)[0].type
          : [];
      if (res === 'OTA') {
        sourceNameControl.clearValidators();
        sourceNameControl.setValidators([Validators.required]);
      } else {
        sourceNameControl.clearValidators();
        sourceNameControl.updateValueAndValidity();
        sourceNameControl.setValidators([
          Validators.required,
          Validators.maxLength(60),
        ]);
      }
      sourceNameControl.reset();
    });

    this.$susbcription.add(
      this.formService.sourceData.subscribe((res) => {
        if (res) {
          sourceControl.setValue(res.source);
          sourceNameControl.setValue(res.sourceName);
        }
      })
    );
  }

  getCountryCode(): void {
    this.configService
      .getColorAndIconConfig(this.entityId)
      .subscribe((response) => {
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
        );
        this.listenForSourceChanges();
      });
    this.configService.getCountryCode().subscribe((res) => {
      const data = new CountryCodeList().deserialize(res);
      this.countries = data.records;
    });
  }

  updateDateDifference() {
    // Get the toDate and fromDate values from the form service

    if (this.fromDateValue && this.toDateValue) {
      // Calculate the date difference in days
      const dateDiffInMilliseconds =
        this.toDateValue.getTime() - this.fromDateValue.getTime();
      const dateDiffInDays = Math.ceil(
        dateDiffInMilliseconds / (1000 * 60 * 60 * 24)
      );
      // Update the dateDifference BehaviorSubject with the new value
      this.formService.dateDifference.next(dateDiffInDays);
    }
  }

  get reservationInfoControls() {
    return (this.controlContainer.control.get(
      'reservationInformation'
    ) as FormGroup).controls as Record<
      keyof ReservationForm['reservationInformation'],
      AbstractControl
    >;
  }

  ngOnDestroy() {
    this.$susbcription.unsubscribe();
  }

  get roomControls() {
    return this.controlContainer.control.get('roomInformation') as FormGroup;
  }
}
