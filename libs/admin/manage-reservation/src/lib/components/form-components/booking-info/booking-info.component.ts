import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import {
  ConfigService,
  CountryCodeList,
  Option,
} from '@hospitality-bot/admin/shared';
import { BookingConfig } from '../../../models/reservations.model';
import * as moment from 'moment';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../../services/form.service';
import { ReservationForm } from '../../../constants/form';

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
  configData: BookingConfig;

  entityId: string;
  startMinDate = new Date();
  endMinDate = new Date();
  maxFromDate = new Date();
  maxToDate = new Date();

  constructor(
    public controlContainer: ControlContainer,
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private activatedRoute: ActivatedRoute,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.getCountryCode();
    this.initDefaultDates();
    this.listenForDateChange();
    // this.listenFormChanges();
  }

  // listenFormChanges() {
  //   this.reservationInfoControls.source.valueChanges.subscribe((res) => {
  //     this.reservationInfoControls.sourceName.setValue('');
  //   });
  // }

  /**
   * Set default to and from dates.
   */
  initDefaultDates() {
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.maxFromDate.setDate(this.endMinDate.getDate() - 1);
    this.formService.toDate = this.endMinDate;
    this.formService.fromDate = this.maxFromDate;

    if (this.bookingType === 'ROOM_TYPE')
      this.maxToDate.setDate(this.startMinDate.getDate() + 365);
    if (this.bookingType === 'VENUE')
      this.maxToDate = moment().add(24, 'hours').toDate();

    this.endMinDate.setTime(this.endMinDate.getTime() - 5 * 60 * 1000);
  }

  /**
   * Listen for date changes in ROOM_TYPE and outlets.
   */
  listenForDateChange() {
    const startTime = moment(this.startMinDate).unix() * 1000;
    const endTime = moment(this.endMinDate).unix() * 1000;
    const toDateControl = this.controlContainer.control.get(
      'reservationInformation.to'
    );
    const fromDateControl = this.controlContainer.control.get(
      'reservationInformation.from'
    );
    const dateAndTimeControl = this.controlContainer.control.get(
      'reservationInformation.dateAndTime'
    );

    // Listen to from and to date changes in ROOM_TYPE and setting
    // min and max dates accordingly
    if (this.bookingType === 'ROOM_TYPE') {
      fromDateControl.setValue(startTime);
      toDateControl.setValue(endTime);
      fromDateControl.valueChanges.subscribe((res) => {
        const maxToLimit = new Date(res);
        this.formService.fromDate = maxToLimit;
        this.updateDateDifference();
        this.maxToDate.setDate(maxToLimit.getDate() + 365);
        this.formService.reservationDate.next(res);
      });
      toDateControl.valueChanges.subscribe((res) => {
        const maxLimit = new Date(res);
        this.formService.toDate = maxLimit;
        this.updateDateDifference();
        this.maxFromDate.setDate(maxLimit.getDate() - 1);
      });
    }

    // Listen to from and to date changes in Venue
    else if (this.bookingType === 'VENUE') {
      fromDateControl.setValue(startTime);
      toDateControl.setValue(endTime);
      this.endMinDate.setDate(this.startMinDate.getDate());
      fromDateControl.valueChanges.subscribe((res) => {
        const maxLimit = new Date(res);
        toDateControl.setValue(moment(maxLimit).unix() * 1000);
        this.maxToDate = moment(maxLimit).add(24, 'hours').toDate();
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

  getCountryCode(): void {
    this.configService
      .getColorAndIconConfig(this.entityId)
      .subscribe((response) => {
        // Config data -> OTA only for rooms, Online Order for restaurant
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
        );
        this.configData.source = this.configData.source.filter(
          (item) =>
            item.value !== 'CREATE_WITH' &&
            item.value !== 'OTHERS' &&
            item.value !== 'OTA'
        );
        if (this.bookingType === 'ROOM_TYPE')
          this.configData.source = [
            ...this.configData.source,
            { label: 'OTA', value: 'OTA' },
          ];
        if (this.bookingType === 'RESTAURANT')
          this.configData.source = [
            ...this.configData.source,
            { label: 'Online food order', value: 'ONLINE_FOOD_ORDER' },
          ];
      });
    this.configService.getCountryCode().subscribe((res) => {
      const data = new CountryCodeList().deserialize(res);
      this.countries = data.records;
    });
  }

  updateDateDifference() {
    // Get the toDate and fromDate values from the form service
    const toDateValue = this.formService.toDate;
    const fromDateValue = this.formService.fromDate;

    if (toDateValue && fromDateValue) {
      // Calculate the date difference in days
      const dateDiffInMilliseconds =
        toDateValue.getTime() - fromDateValue.getTime();
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
}
