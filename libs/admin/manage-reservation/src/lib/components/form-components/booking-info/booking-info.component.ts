import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import {
  ConfigService,
  CountryCodeList,
  Option,
} from '@hospitality-bot/admin/shared';
import { BookingConfig } from '../../../models/reservations.model';
import * as moment from 'moment';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ActivatedRoute } from '@angular/router';
import { ManageReservationService } from '../../../services/manage-reservation.service';

@Component({
  selector: 'hospitality-bot-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.scss', '../../reservation.styles.scss'],
})
export class BookingInfoComponent implements OnInit {
  startMinDate = new Date();
  endMinDate = new Date();
  maxFromDate = new Date();
  maxToDate = new Date();
  hotelId: string;
  reservationId: string;

  countries: Option[];
  @Input() reservationTypes: Option[] = [];
  @Input() statusOptions: Option[] = [];
  @Input() eventTypes: Option[] = [];
  @Input() bookingType: string;
  configData: BookingConfig;

  constructor(
    public controlContainer: ControlContainer,
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private activatedRoute: ActivatedRoute,
    private manageReservationService: ManageReservationService
  ) {
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.getCountryCode();
    this.initDefaultDates();
    this.listenForDateChange();
  }

  /**
   * Set default to and from dates.
   */
  initDefaultDates() {
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.maxFromDate.setDate(this.endMinDate.getDate() - 1);

    if (this.bookingType === 'HOTEL')
      this.maxToDate.setDate(this.startMinDate.getDate() + 365);
    if (this.bookingType === 'VENUE')
      this.maxToDate = moment().add(24, 'hours').toDate();

    this.endMinDate.setTime(this.endMinDate.getTime() - 5 * 60 * 1000);
  }


  /**
   * Listen for date changes in hotel and outlets.
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
      'reservationInformation.reservationDateAndTime'
    );

    // Listen to from and to date changes in hotel and setting
    // min and max dates accordingly
    if (this.bookingType === 'HOTEL') {
      fromDateControl.setValue(startTime);
      toDateControl.setValue(endTime);
      fromDateControl.valueChanges.subscribe((res) => {
        const maxToLimit = new Date(res);
        this.maxToDate.setDate(maxToLimit.getDate() + 365);
        this.manageReservationService.reservationDate.next(res);
      });
      toDateControl.valueChanges.subscribe((res) => {
        const maxLimit = new Date(res);
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
        this.manageReservationService.reservationDate.next(res);
      });
    } 
    
    // Listen for date and time change in restaurant and spa
    else {
      dateAndTimeControl.setValue(startTime);
      dateAndTimeControl.valueChanges.subscribe((res) => {
        this.manageReservationService.reservationDate.next(res);
      });
    }
  }

  getCountryCode(): void {
    this.configService
      .getColorAndIconConfig(this.hotelId)
      .subscribe((response) => {
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
        );
        this.configData.source = this.configData.source.filter(
          (item) => item.value !== 'CREATE_WITH' && item.value !== 'OTHERS'
        );
      });
    this.configService.getCountryCode().subscribe((res) => {
      const data = new CountryCodeList().deserialize(res);
      this.countries = data.records;
    });
  }
}
