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

@Component({
  selector: 'hospitality-bot-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.scss', '../../reservation.styles.scss'],
})
export class BookingInfoComponent implements OnInit {
  startMinDate = new Date();
  endMinDate = new Date();

  hotelId: string;
  reservationId: string;

  // statusOptions: Option[] = [
  //   { label: 'Confirmed', value: 'CONFIRMED' },
  //   { label: 'Draft', value: 'DRAFT' },
  //   { label: 'Cancelled', value: 'CANCELLED' },
  //   { label: 'Wait Listed', value: 'WAIT_LISTED' },
  //   { label: 'No Show', value: 'NO_SHOW' },
  //   { label: 'In Session', value: 'IN_SESSION' },
  //   { label: 'Completed', value: 'COMPLETED' },
  // ];

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
    private activatedRoute: ActivatedRoute
  ) {
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.endMinDate.setTime(this.endMinDate.getTime() - 5 * 60 * 1000);
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    const startTime = moment(this.startMinDate).unix() * 1000;
    const endTime = moment(this.endMinDate).unix() * 1000;
    if (this.bookingType === 'HOTEL') {
      this.controlContainer.control
        .get('reservationInformation.from')
        .setValue(startTime);
      this.controlContainer.control
        .get('reservationInformation.to')
        .setValue(endTime);
    } else if (this.bookingType !== 'VENUE') {
      this.controlContainer.control
        .get('reservationInformation.reservationDateAndTime')
        .setValue(endTime);
    }
    this.hotelId = this.globalFilterService.hotelId;
    this.getCountryCode();
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

  // getReservationId(): void {
  //   if (this.reservationId) {
  //     this.reservationTypes = [
  //       { label: 'Draft', value: 'DRAFT' },
  //       { label: 'Confirmed', value: 'CONFIRMED' },
  //       { label: 'Cancelled', value: 'CANCELED' },
  //     ];
  //   } else {
  //     this.reservationTypes = [
  //       { label: 'Draft', value: 'DRAFT' },
  //       { label: 'Confirmed', value: 'CONFIRMED' },
  //     ];
  //     this.userForm.valueChanges.subscribe((_) => {
  //       if (!this.formValueChanges) {
  //         this.formValueChanges = true;
  //         this.listenForFormChanges();
  //       }
  //     });
  //   }
  // }
}
